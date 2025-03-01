<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Delete, Edit, Setting, Download, Upload, VideoPlay, VideoPause } from '@element-plus/icons-vue'

// 流程状态选项
const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'enabled', label: '启用' },
  { value: 'disabled', label: '停用' }
]

// 流程类型选项
const typeOptions = [
  { value: 'all', label: '全部' },
  { value: 'application', label: '申请单' },
  { value: 'reimbursement', label: '报销单' }
]

// 搜索条件
const searchForm = reactive({
  name: '',
  status: 'all',
  type: 'all'
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const multipleSelection = ref([])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 模态框相关
const dialogVisible = ref(false)
const dialogType = ref('') // 'new', 'edit', 'import', 'associate'
const dialogTitle = ref('')
const currentWorkflow = ref(null)

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  type: 'application',
  status: 'enabled',
  nodes: [],
  documents: []
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择流程类型', trigger: 'change' }]
}

// 内置流程模板选项
const templateOptions = ref([
  { value: 'flow1-1', label: '一录一审（员工-部门主管）', type: 'application' },
  { value: 'flow1-2', label: '一录两审（员工-部门主管-部门总经理）', type: 'application' },
  { value: 'flow1-3', label: '一录三审（员工-项目经理-部门主管-部门总经理）', type: 'application' },
  { value: 'flow1-4', label: '一录四审（员工-项目经理-部门主管-部门总经理-行政人员）', type: 'application' },
  { value: 'flow2-1', label: '一录一审（员工-财务人员）', type: 'reimbursement' },
  { value: 'flow2-2', label: '一录两审（员工-部门主管-财务人员）', type: 'reimbursement' },
  { value: 'flow2-3', label: '一录三审（员工-部门主管-部门总经理-财务人员）', type: 'reimbursement' },
  { value: 'flow2-4', label: '一录四审（员工-项目经理-部门主管-部门总经理-财务人员）', type: 'reimbursement' }
])

// 角色选项
const roleOptions = ref([
  { value: 'employee', label: '员工' },
  { value: 'dept_manager', label: '部门主管' },
  { value: 'finance_staff', label: '财务人员' },
  { value: 'dept_director', label: '部门总经理' },
  { value: 'finance_manager', label: '财务主管' },
  { value: 'project_manager', label: '项目经理' },
  { value: 'admin_staff', label: '行政人员' },
  { value: 'system_admin', label: '商旅系统管理员' }
])

// 单据选项
const documentOptions = ref([])

// 表单引用
const formRef = ref(null)
const associateFormRef = ref(null)

// 初始化数据
onMounted(() => {
  fetchWorkflows()
  fetchDocuments()
})

// 获取流程列表
const fetchWorkflows = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    const mockData = [
      {
        id: '1',
        name: '出差申请单审批流程',
        type: 'application',
        status: 'enabled',
        createTime: '2023-05-15 10:30:00',
        nodes: [
          { id: 1, name: '部门主管审批', role: 'dept_manager' },
          { id: 2, name: '部门总经理审批', role: 'dept_director' }
        ],
        documents: ['出差申请单']
      },
      {
        id: '2',
        name: '出差报销单审批流程',
        type: 'reimbursement',
        status: 'enabled',
        createTime: '2023-05-15 11:20:00',
        nodes: [
          { id: 1, name: '部门主管审批', role: 'dept_manager' },
          { id: 2, name: '部门总经理审批', role: 'dept_director' },
          { id: 3, name: '财务人员审批', role: 'finance_staff' }
        ],
        documents: ['出差报销单']
      },
      {
        id: '3',
        name: '招待费报销审批流程',
        type: 'reimbursement',
        status: 'disabled',
        createTime: '2023-05-16 09:15:00',
        nodes: [
          { id: 1, name: '部门主管审批', role: 'dept_manager' },
          { id: 2, name: '财务人员审批', role: 'finance_staff' }
        ],
        documents: ['招待费报销单']
      }
    ]
    
    // 根据搜索条件过滤
    let filteredData = [...mockData]
    
    if (searchForm.name) {
      filteredData = filteredData.filter(item => item.name.includes(searchForm.name))
    }
    
    if (searchForm.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === searchForm.status)
    }
    
    if (searchForm.type !== 'all') {
      filteredData = filteredData.filter(item => item.type === searchForm.type)
    }
    
    pagination.total = filteredData.length
    
    // 分页处理
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = filteredData.slice(start, end)
    
    loading.value = false
  }, 500)
}

// 获取单据列表
const fetchDocuments = () => {
  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    documentOptions.value = [
      { value: '1', label: '出差申请单', type: 'application', status: 'enabled' },
      { value: '2', label: '出差报销单', type: 'reimbursement', status: 'enabled' },
      { value: '3', label: '借款单', type: 'application', status: 'enabled' },
      { value: '4', label: '招待费报销单', type: 'reimbursement', status: 'enabled' },
      { value: '5', label: '费用报销单', type: 'reimbursement', status: 'enabled' },
      { value: '6', label: '合同付款单', type: 'application', status: 'disabled' }
    ]
  }, 500)
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchWorkflows()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = 'all'
  searchForm.type = 'all'
  handleSearch()
}

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  multipleSelection.value = selection
}

// 处理分页变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchWorkflows()
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  fetchWorkflows()
}

// 打开新增流程对话框
const openNewDialog = () => {
  dialogType.value = 'new'
  dialogTitle.value = '新增流程'
  resetForm()
  dialogVisible.value = true
}

// 打开导入模板对话框
const openImportDialog = () => {
  dialogType.value = 'import'
  dialogTitle.value = '导入流程模板'
  resetForm()
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (row) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑流程'
  currentWorkflow.value = row
  
  // 填充表单数据
  Object.keys(formData).forEach(key => {
    if (key in row) {
      formData[key] = row[key]
    }
  })
  
  dialogVisible.value = true
}

// 打开关联单据对话框
const openAssociateDialog = (row) => {
  dialogType.value = 'associate'
  dialogTitle.value = '关联单据'
  currentWorkflow.value = row
  formData.documents = row.documents || []
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.type = 'application'
  formData.status = 'enabled'
  formData.nodes = []
  formData.documents = []
  
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'new' || dialogType.value === 'edit') {
        // 模拟保存数据
        ElMessage.success(dialogType.value === 'new' ? '新增流程成功' : '编辑流程成功')
        dialogVisible.value = false
        fetchWorkflows()
      } else if (dialogType.value === 'import') {
        // 模拟导入模板
        ElMessage.success('导入流程模板成功')
        dialogVisible.value = false
        fetchWorkflows()
      }
    }
  })
}

// 提交关联单据
const submitAssociate = async () => {
  if (!associateFormRef.value) return
  
  await associateFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟保存关联单据
      ElMessage.success('关联单据成功')
      dialogVisible.value = false
      fetchWorkflows()
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请至少选择一条记录')
    return
  }
  
  ElMessageBox.confirm('确认删除选中的流程吗？删除后将无法恢复', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除操作
    ElMessage.success('删除成功')
    fetchWorkflows()
  }).catch(() => {})
}

// 切换流程状态
const toggleStatus = (row) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  const statusText = newStatus === 'enabled' ? '启用' : '停用'
  
  ElMessageBox.confirm(`确认${statusText}该流程吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟状态切换
    row.status = newStatus
    ElMessage.success(`${statusText}成功`)
    fetchWorkflows()
  }).catch(() => {})
}

// 跳转到单据管理
const goToDocumentManagement = () => {
  ElMessage.info('跳转到单据管理功能')
  // 实际项目中应该使用路由跳转
  // router.push('/document-management')
}

// 获取流程类型文本
const getTypeText = (type) => {
  const option = typeOptions.find(opt => opt.value === type)
  return option ? option.label : ''
}

// 获取流程状态文本
const getStatusText = (status) => {
  const option = statusOptions.find(opt => opt.value === status)
  return option ? option.label : ''
}
</script>

<template>
  <div class="workflow-management-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="流程名称">
          <el-input v-model="searchForm.name" placeholder="请输入流程名称" clearable />
        </el-form-item>
        
        <el-form-item label="流程类型">
          <el-select v-model="searchForm.type" placeholder="请选择流程类型" clearable>
            <el-option 
              v-for="item in typeOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="流程状态">
          <el-select v-model="searchForm.status" placeholder="请选择流程状态" clearable>
            <el-option 
              v-for="item in statusOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Document /></el-icon> 查询
          </el-button>
          <el-button @click="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 操作按钮 -->
    <div class="operation-container">
      <div class="left-buttons">
        <el-button type="primary" @click="openNewDialog">
          <el-icon><Document /></el-icon> 新增流程
        </el-button>
        <el-button type="success" @click="openImportDialog">
          <el-icon><Upload /></el-icon> 导入模板
        </el-button>
        <el-button type="danger" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon> 批量删除
        </el-button>
        <el-button @click="goToDocumentManagement">
          <el-icon><Setting /></el-icon> 单据管理
        </el-button>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="流程ID" width="100" />
        
        <el-table-column prop="name" label="流程名称" min-width="150" show-overflow-tooltip />
        
        <el-table-column prop="type" label="流程类型" width="120">
          <template #default="scope">
            <el-tag
              :type="scope.row.type === 'application' ? 'primary' : 'success'"
              effect="plain"
            >
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="流程状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 'enabled' ? 'success' : 'info'"
              effect="dark"
            >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="180" />
        
        <el-table-column label="关联单据" width="150">
          <template #default="scope">
            <el-tooltip 
              effect="dark" 
              :content="scope.row.documents.join('、')" 
              placement="top"
              :disabled="!scope.row.documents || scope.row.documents.length === 0"
            >
              <span>{{ scope.row.documents ? scope.row.documents.length : 0 }}个单据</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="openEditDialog(scope.row)"
            >
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            
            <el-button 
              type="success" 
              size="small" 
              @click="openAssociateDialog(scope.row)"
            >
              <el-icon><Document /></el-icon> 关联单据
            </el-button>
            
            <el-button 
              :type="scope.row.status === 'enabled' ? 'warning' : 'success'" 
              size="small" 
              @click="toggleStatus(scope.row)"
            >
              <el-icon v-if="scope.row.status === 'enabled'">
                <VideoPause />
              </el-icon>
              <el-icon v-else>
                <VideoPlay />
              </el-icon>
              {{ scope.row.status === 'enabled' ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="650px"
      destroy-on-close
    >
      <!-- 新增/编辑流程表单 -->
      <el-form
        v-if="dialogType === 'new' || dialogType === 'edit'"
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入流程名称" />
        </el-form-item>
        
        <el-form-item label="流程类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择流程类型">
            <el-option label="申请单" value="application" />
            <el-option label="报销单" value="reimbursement" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="流程状态">
          <el-switch
            v-model="formData.status"
            :active-value="'enabled'"
            :inactive-value="'disabled'"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
        
        <el-form-item label="审批节点">
          <el-table :data="formData.nodes" style="width: 100%">
            <el-table-column label="节点名称" prop="name">
              <template #default="scope">
                <el-input v-model="scope.row.name" placeholder="请输入节点名称" />
              </template>
            </el-table-column>
            
            <el-table-column label="审批角色" prop="role">
              <template #default="scope">
                <el-select v-model="scope.row.role" placeholder="请选择审批角色">
                  <el-option
                    v-for="option in roleOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="80">
              <template #default="scope">
                <el-button
                  type="danger"
                  size="small"
                  @click="formData.nodes.splice(scope.$index, 1)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div style="margin-top: 10px;">
            <el-button 
              type="primary" 
              @click="formData.nodes.push({ id: formData.nodes.length + 1, name: '', role: '' })"
            >
              添加节点
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <!-- 导入模板表单 -->
      <el-form
        v-if="dialogType === 'import'"
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入流程名称" />
        </el-form-item>
        
        <el-form-item label="流程类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择流程类型">
            <el-option label="申请单" value="application" />
            <el-option label="报销单" value="reimbursement" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="流程模板">
          <el-select 
            v-model="formData.template" 
            placeholder="请选择流程模板"
            style="width: 100%"
          >
            <el-option
              v-for="option in templateOptions.filter(item => item.type === formData.type)"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="流程状态">
          <el-switch
            v-model="formData.status"
            :active-value="'enabled'"
            :inactive-value="'disabled'"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
      </el-form>
      
      <!-- 关联单据表单 -->
      <el-form
        v-if="dialogType === 'associate'"
        ref="associateFormRef"
        :model="formData"
        label-width="100px"
      >
        <el-form-item label="关联单据">
          <el-select
            v-model="formData.documents"
            multiple
            placeholder="请选择关联单据"
            style="width: 100%"
          >
            <el-option
              v-for="option in documentOptions.filter(item => item.type === currentWorkflow?.type && item.status === 'enabled')"
              :key="option.value"
              :label="option.label"
              :value="option.label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="dialogType === 'associate' ? submitAssociate() : submitForm()"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.workflow-management-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.operation-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>