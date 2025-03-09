<template>
  <div class="department-management">
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增部门</el-button>
    </div>

    <el-table :data="departmentList" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="parentName" label="上级部门" />
      <el-table-column prop="manager" label="部门主管" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="部门名称">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="上级部门">
          <el-select v-model="formData.parentId" placeholder="请选择上级部门">
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门主管">
          <el-input v-model="formData.manager" placeholder="请输入部门主管" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 替换Supabase导入为本地API
import { departmentApi } from '../api/localApi'

// 部门列表数据
const departmentList = ref([])

// 部门选项数据
const departmentOptions = ref([])

// 对话框相关数据
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formData = ref({
  id: null,
  name: '',
  parentId: null,
  manager: ''
})

// 获取部门列表
const fetchDepartments = async () => {
  try {
    const data = await departmentApi.getAllDepartments()
    
    // 更新部门选项
    departmentOptions.value = data.map(dept => ({
      id: dept.id,
      name: dept.name
    }))

    departmentList.value = data.map(dept => ({
      id: dept.id,
      name: dept.name,
      parentName: data.find(item => item.id === dept.parent_id)?.name || '无',
      manager: dept.manager,
      createTime: new Date(dept.created_at).toLocaleString()
    }))
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  }
}

// 添加部门
const handleAdd = () => {
  dialogTitle.value = '添加部门'
  formData.value = {
    id: null,
    name: '',
    parentId: null,
    manager: ''
  }
  dialogVisible.value = true
}

// 编辑部门
const handleEdit = (row) => {
  dialogTitle.value = '编辑部门'
  formData.value = {
    id: row.id,
    name: row.name,
    parentId: departmentList.value.find(dept => dept.name === row.parentName)?.id || null,
    manager: row.manager
  }
  dialogVisible.value = true
}

// 删除部门
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该部门吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await departmentApi.deleteDepartment(row.id)
      ElMessage.success('删除成功')
      fetchDepartments()
    } catch (error) {
      console.error('删除部门失败:', error)
      ElMessage.error('删除部门失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (formData.value.id) {
      // 更新部门
      await departmentApi.updateDepartment(formData.value.id, {
        name: formData.value.name,
        parent_id: formData.value.parentId,
        manager: formData.value.manager
      })
      ElMessage.success('更新成功')
    } else {
      // 创建部门
      await departmentApi.createDepartment({
        name: formData.value.name,
        parent_id: formData.value.parentId,
        manager: formData.value.manager
      })
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    fetchDepartments()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  }
}

// 页面加载时获取部门列表
onMounted(() => {
  fetchDepartments()
})
</script>

<style scoped>
.department-management {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>