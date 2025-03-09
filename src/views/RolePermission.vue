<template>
  <div class="role-permission">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>角色权限管理</span>
          <el-button type="primary" @click="handleAdd">添加角色</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="搜索">
            <el-input
              v-model="searchForm.keyword"
              placeholder="输入角色名称搜索"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="roles" border style="width: 100%">
        <el-table-column prop="id" label="角色ID" width="100" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="权限" width="200">
          <template #default="{ row }">
            <el-button size="small" type="info" @click="handlePermissions(row)">
              配置权限
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="total, prev, pager, next"
      />
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加角色' : '编辑角色'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog
      title="权限配置"
      v-model="permissionDialogVisible"
      width="600px"
    >
      <el-tree
        ref="permissionTree"
        :data="permissions"
        :props="{
          label: 'name',
          children: 'children'
        }"
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedPermissions"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermissions">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { supabase } from '../api/supabase'

// 状态定义
const roles = ref([])
const permissions = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const dialogType = ref('add')
const selectedPermissions = ref([])
const currentRole = ref(null)

const roleForm = ref({
  name: '',
  description: ''
})

const searchForm = reactive({
  keyword: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
}

// 获取角色列表
const fetchRoles = async () => {
  try {
    let query = supabase
      .from('roles')
      .select('*')
      .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1)

    if (searchForm.keyword) {
      query = query.ilike('name', `%${searchForm.keyword}%`)
    }

    const { data, error, count } = await query.order('id')
    if (error) throw error

    roles.value = data
    total.value = count || 0
  } catch (error) {
    ElMessage.error('获取角色列表失败：' + error.message)
  }
}

// 获取权限列表
const fetchPermissions = async () => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('id')
    if (error) throw error

    // 构建权限树结构
    permissions.value = buildPermissionTree(data)
  } catch (error) {
    ElMessage.error('获取权限列表失败：' + error.message)
  }
}

// 构建权限树结构
const buildPermissionTree = (permissions) => {
  const tree = []
  const map = {}

  permissions.forEach(item => {
    map[item.id] = { ...item, children: [] }
  })

  permissions.forEach(item => {
    if (item.parent_id) {
      map[item.parent_id].children.push(map[item.id])
    } else {
      tree.push(map[item.id])
    }
  })

  return tree
}

// 获取角色权限
const fetchRolePermissions = async (roleId) => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', roleId)
    if (error) throw error

    selectedPermissions.value = data.map(item => item.permission_id)
  } catch (error) {
    ElMessage.error('获取角色权限失败：' + error.message)
  }
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchRoles()
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchRoles()
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  handleSearch()
}

// 处理添加角色
const handleAdd = () => {
  dialogType.value = 'add'
  roleForm.value = {
    name: '',
    description: ''
  }
  dialogVisible.value = true
}

// 处理编辑角色
const handleEdit = (row) => {
  dialogType.value = 'edit'
  roleForm.value = { ...row }
  dialogVisible.value = true
}

// 处理删除角色
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该角色吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', row.id)
      if (error) throw error

      ElMessage.success('删除成功')
      fetchRoles()
    } catch (error) {
      ElMessage.error('删除失败：' + error.message)
    }
  })
}

// 处理权限配置
const handlePermissions = async (row) => {
  currentRole.value = row
  await fetchRolePermissions(row.id)
  permissionDialogVisible.value = true
}

// 保存权限配置
const savePermissions = async () => {
  try {
    const permissionTree = ref(null)
    const checkedKeys = permissionTree.value.getCheckedKeys()
    const halfCheckedKeys = permissionTree.value.getHalfCheckedKeys()
    const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

    // 删除原有权限
    await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', currentRole.value.id)

    // 添加新权限
    const { error } = await supabase
      .from('role_permissions')
      .insert(
        allCheckedKeys.map(permissionId => ({
          role_id: currentRole.value.id,
          permission_id: permissionId
        }))
      )
    if (error) throw error

    ElMessage.success('权限配置保存成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('权限配置保存失败：' + error.message)
  }
}

// 提交表单
const submitForm = async () => {
  const roleFormRef = ref(null)
  await roleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          const { error } = await supabase
            .from('roles')
            .insert([roleForm.value])
          if (error) throw error
          ElMessage.success('添加成功')
        } else {
          const { error } = await supabase
            .from('roles')
            .update(roleForm.value)
            .eq('id', roleForm.value.id)
          if (error) throw error
          ElMessage.success('更新成功')
        }

        dialogVisible.value = false
        fetchRoles()
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '添加失败：' : '更新失败：' + error.message)
      }
    }
  })
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<style scoped>
.role-permission {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>