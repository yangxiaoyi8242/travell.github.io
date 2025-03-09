<template>
  <div class="employee-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>人员管理</span>
          <el-button type="primary" @click="handleAdd">添加员工</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="部门">
            <el-select v-model="searchForm.department" placeholder="选择部门" clearable>
              <el-option
                v-for="dept in departments"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索">
            <el-input
              v-model="searchForm.keyword"
              placeholder="输入姓名或工号搜索"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="filteredEmployees" border style="width: 100%">
        <el-table-column prop="id" label="工号" width="100" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="department_name" label="所属部门" width="150" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话" width="120" />
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

    <!-- 添加/编辑员工对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加员工' : '编辑员工'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="employeeForm"
        :model="employeeForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="employeeForm.name" />
        </el-form-item>
        <el-form-item label="部门" prop="department_id">
          <el-select v-model="employeeForm.department_id" placeholder="选择部门">
            <el-option
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="employeeForm.position" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="employeeForm.email" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="employeeForm.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 替换Supabase导入为本地API
import { employeeApi, departmentApi } from '../api/localApi'

// 员工列表数据
const employees = ref([])
const departments = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => filteredEmployees.value.length)

// 搜索表单
const searchForm = reactive({
  department: '',
  keyword: ''
})

// 过滤后的员工列表
const filteredEmployees = computed(() => {
  let result = [...employees.value]
  
  // 按部门筛选
  if (searchForm.department) {
    result = result.filter(emp => emp.department_id === searchForm.department)
  }
  
  // 按关键词筛选
  if (searchForm.keyword) {
    const keyword = searchForm.keyword.toLowerCase()
    result = result.filter(emp => 
      emp.name.toLowerCase().includes(keyword) || 
      emp.id.toString().includes(keyword)
    )
  }
  
  return result
})

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const employeeForm = reactive({
  id: null,
  name: '',
  department_id: '',
  position: '',
  email: '',
  phone: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  department_id: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
}

const employeeFormRef = ref(null)

// 获取员工列表
const fetchEmployees = async () => {
  try {
    const data = await employeeApi.getAllEmployees()
    employees.value = data
  } catch (error) {
    console.error('获取员工列表失败:', error)
    ElMessage.error('获取员工列表失败')
  }
}

// 获取部门列表
const fetchDepartments = async () => {
  try {
    const data = await departmentApi.getAllDepartments()
    departments.value = data.map(dept => ({
      id: dept.id,
      name: dept.name
    }))
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 重置搜索
const resetSearch = () => {
  searchForm.department = ''
  searchForm.keyword = ''
  currentPage.value = 1
}

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page
}

// 添加员工
const handleAdd = () => {
  dialogType.value = 'add'
  employeeForm.id = null
  employeeForm.name = ''
  employeeForm.department_id = ''
  employeeForm.position = ''
  employeeForm.email = ''
  employeeForm.phone = ''
  dialogVisible.value = true
}

// 编辑员工
const handleEdit = (row) => {
  dialogType.value = 'edit'
  employeeForm.id = row.id
  employeeForm.name = row.name
  employeeForm.department_id = row.department_id
  employeeForm.position = row.position
  employeeForm.email = row.email
  employeeForm.phone = row.phone
  dialogVisible.value = true
}

// 删除员工
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该员工吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await employeeApi.deleteEmployee(row.id)
      ElMessage.success('删除成功')
      fetchEmployees()
    } catch (error) {
      console.error('删除员工失败:', error)
      ElMessage.error('删除员工失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const submitForm = async () => {
  if (!employeeFormRef.value) return
  
  await employeeFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          // 创建员工
          await employeeApi.createEmployee({
            name: employeeForm.name,
            department_id: employeeForm.department_id,
            position: employeeForm.position,
            email: employeeForm.email,
            phone: employeeForm.phone
          })
          ElMessage.success('添加成功')
        } else {
          // 更新员工
          await employeeApi.updateEmployee(employeeForm.id, {
            name: employeeForm.name,
            department_id: employeeForm.department_id,
            position: employeeForm.position,
            email: employeeForm.email,
            phone: employeeForm.phone
          })
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchEmployees()
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
      }
    } else {
      console.log('表单验证失败', fields)
    }
  })
}

// 页面加载时获取数据
onMounted(() => {
  fetchDepartments()
  fetchEmployees()
})
</script>

<style scoped>
.employee-management {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>