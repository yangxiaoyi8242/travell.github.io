<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Delete, Edit, Setting, Download, Upload, VideoPlay, VideoPause } from '@element-plus/icons-vue'

// 单据状态选项
const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'enabled', label: '启用' },
  { value: 'disabled', label: '停用' }
]

// 单据类型选项
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
const dialogType = ref('') // 'new', 'edit', 'import', 'workflow'
const dialogTitle = ref('')
const currentDocument = ref(null)

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  type: 'application',
  status: 'enabled',
  content: [],
  workflow: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入单据名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择单据类型', trigger: 'change' }]
}

// 审批流程选项
const workflowOptions = ref([
  { value: 'flow1-1', label: '一录一审（员工-部门主管）' },
  { value: 'flow1-2', label: '一录两审（员工-部门主管-部门总经理）' },
  { value: 'flow1-3', label: '一录三审（员工-项目经理-部门主管-部门总经理）' },
  { value: 'flow1-4', label: '一录四审（员工-项目经理-部门主管-部门总经理-行政人员）' },
  { value: 'flow2-1', label: '一录一审（员工-财务人员）' },
  { value: 'flow2-2', label: '一录两审（员工-部门主管-财务人员）' },
  { value: 'flow2-3', label: '一录三审（员工-部门主管-部门总经理-财务人员）' },
  { value: 'flow2-4', label: '一录四审（员工-项目经理-部门主管-部门总经理-财务人员）' }
])

// 内置模板选项
const templateOptions = ref([
  { value: 'travel-application', label: '出差申请单', type: 'application' },
  { value: 'travel-reimbursement', label: '出差报销单', type: 'reimbursement' },
  { value: 'loan-application', label: '借款单', type: 'application' },
  { value: 'entertainment-reimbursement', label: '招待费报销单', type: 'reimbursement' },
  { value: 'expense-reimbursement', label: '费用报销单', type: 'reimbursement' },
  { value: 'contract-payment', label: '合同付款单', type: 'application' }
])

// 表单引用
const formRef = ref(null)
const workflowFormRef = ref(null)

// 初始化数据
onMounted(() => {
  fetchDocuments()
})

// 获取单据列表
const fetchDocuments = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    const mockData = [
      {
        id: '1',
        name: '出差申请单',
        type: 'application',
        status: 'enabled',
        createTime: '2023-05-15 10:30:00',
        workflow: 'flow1-2',
        content: []
      },
      {
        id: '2',
        name: '出差报销单',
        type: 'reimbursement',
        status: 'enabled',
        createTime: '2023-05-15 11:20:00',
        workflow: 'flow2-3',
        content: []
      },
      {
        id: '3',
        name: '招待费报销单',
        type: 'reimbursement',
        status: 'disabled',
        createTime: '2023-05-16 09:15:00',
        workflow: 'flow2-2',
        content: []
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

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchDocuments()
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
  fetchDocuments()
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  fetchDocuments()
}

// 打开新增单据对话框
const openNewDialog = () => {
  dialogType.value = 'new'
  dialogTitle.value = '新增单据'
  resetForm()
  dialogVisible.value = true
}

// 打开导入模板对话框
const openImportDialog = () => {
  dialogType.value = 'import'
  dialogTitle.value = '导入模板'
  resetForm()
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (row) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑单据'
  currentDocument.value = row
  
  // 填充表单数据
  Object.keys(formData).forEach(key => {
    if (key in row) {
      formData[key] = row[key]
    }
  })
  
  dialogVisible.value = true
}

// 打开关联流程对话框
const openWorkflowDialog = (row) => {
  dialogType.value = 'workflow'
  dialogTitle.value = '关联审批流程'
  currentDocument.value = row
  formData.workflow = row.workflow
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.type = 'application'
  formData.status = 'enabled'
  formData.content = []
  formData.workflow = ''
  
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
        ElMessage.success(dialogType.value === 'new' ? '新增单据成功' : '编辑单据成功')
        dialogVisible.value = false
        fetchDocuments()
      } else if (dialogType.value === 'import') {
        // 模拟导入模板
        ElMessage.success('导入模板成功')
        dialogVisible.value = false
        fetchDocuments()
      }
    }
  })
}

// 提交关联流程
const submitWorkflow = async () => {
  if (!workflowFormRef.value) return
  
  await workflowFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟保存关联流程
      ElMessage.success('关联审批流程成功')
      dialogVisible.value = false
      fetchDocuments()
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请至少选择一条记录')
    return
  }
  
  ElMessageBox.confirm('确认删除选中的单据吗？删除后将无法恢复', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除操作
    ElMessage.success('删除成功')
    fetchDocuments()
  }).catch(() => {})
}

// 切换单据状态
const toggleStatus = (row) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  const statusText = newStatus === 'enabled' ? '启用' : '停用'
  
  ElMessageBox.confirm(`确认${statusText}该单据吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟状态切换
    row.status = newStatus
    ElMessage.success(`${statusText}成功`)
    fetchDocuments()
  }).catch(() => {})
}

// 跳转到凭证模板
const goToVoucherTemplate = (row) => {
  ElMessage.info('跳转到智能凭证中心功能')
  // 实际项目中应该是路由跳转
  // router.push('/voucher-template')
}

// 导入模板
const importTemplate = (templateId) => {
  const template = templateOptions.value.find(t => t.value === templateId)
  if (template) {
    formData.name = template.label
    formData.type = template.type
    // 这里应该有更多的模板内容导入逻辑
    ElMessage.success(`已选择${template.label}模板`)
  }
}
</script>

<template>
  <div class="document-management-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="单据名称">
          <el-input v-model="searchForm.name" placeholder="请输入单据名称" clearable></el-input>
        </el-form-item>
        
        <el-form-item label="单据状态">
          <el-select v-model="searchForm.status" placeholder="请选择单据状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="单据类型">
          <el-select v-model="searchForm.type" placeholder="请选择单据类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 表格区域 -->
    <el-card class="table-card">
      <div class="table-operations">
        <div>
          <el-button type="primary" @click="openNewDialog">
            <el-icon><Document /></el-icon>新增
          </el-button>
          <el-button type="success" @click="openImportDialog">
            <el-icon><Download /></el-icon>导入模板
          </el-button>
          <el-button type="danger" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>
      </div>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="name" label="单据名称" min-width="150" />
        
        <el-table-column prop="type" label="单据类型" width="120">
          <template #default="{row}">
            <el-tag :type="row.type === 'application' ? 'primary' : 'success'">
              {{ row.type === 'application' ? '申请单' : '报销单' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="单据状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
              {{ row.status === 'enabled' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="180" />
        
        <el-table-column prop="workflow" label="关联流程" min-width="180">
          <template #default="{row}">
            {{ workflowOptions.find(w => w.value === row.workflow)?.label || '未关联' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{row}">
            <el-button size="small" type="primary" @click="openEditDialog(row)">
              <el-icon><Edit /></el-icon>修改
            </el-button>
            
            <el-button 
              size="small" 
              :type="row.status === 'enabled' ? 'warning' : 'success'"
              @click="toggleStatus(row)"
            >
              <el-icon>{{ row.status === 'enabled' ? '<VideoPause />' : '<VideoPlay />' }}</el-icon>
              {{ row.status === 'enabled' ? '停用' : '启用' }}
            </el-button>
            
            <el-button size="small" type="info" @click="openWorkflowDialog(row)">
              <el-icon><Setting /></el-icon>关联流程
            </el-button>
            
            <el-button 
              v-if="row.type === 'reimbursement'"
              size="small" 
              type="success" 
              @click="goToVoucherTemplate(row)"
            >
              <el-icon><Document /></el-icon>生成凭证模板
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
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
    
    <!-- 对话框区域 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      destroy-on-close
    >
      <!-- 新增/编辑单据表单 -->
      <el-form
        v-if="dialogType === 'new' || dialogType === 'edit'"
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="单据名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入单据名称" />
        </el-form-item>
        
        <el-form-item label="单据类型" prop="type">
          <el-select 
            v-model="formData.type" 
            placeholder="请选择单据类型"
            :disabled="dialogType === 'edit'"
          >
            <el-option label="申请单" value="application" />
            <el-option label="报销单" value="reimbursement" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="单据状态">
          <el-switch
            v-model="formData.status"
            :active-value="'enabled'"
            :inactive-value="'disabled'"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
        
        <el-form-item label="单据内容">
          <div class="form-designer-placeholder">
            <el-empty description="单据设计器功能将在后期实现">
              <template #image>
                <el-icon :size="60"><Document /></el-icon>
              </template>
            </el-empty>
          </div>
        </el-form-item>
      </el-form>
      
      <!-- 导入模板表单 -->
      <div v-if="dialogType === 'import'">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
          <el-form-item label="选择模板" required>
            <el-radio-group v-model="formData.templateId">
              <el-space wrap>
                <el-radio-button 
                  v-for="template in templateOptions" 
                  :key="template.value"
                  :label="template.value"
                  @change="importTemplate(template.value)"
                >
                  {{ template.label }}
                </el-radio-button>
              </el-space>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="单据名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入单据名称" />
          </el-form-item>
          
          <el-form-item label="单据类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择单据类型" disabled>
              <el-option label="申请单" value="application" />
              <el-option label="报销单" value="reimbursement" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="单据状态">
            <el-switch
              v-model="formData.status"
              :active-value="'enabled'"
              :inactive-value="'disabled'"
              active-text="启用"
              inactive-text="停用"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 关联审批流程表单 -->
      <el-form
        v-if="dialogType === 'workflow'"
        ref="workflowFormRef"
        :model="formData"
        label-width="100px"
      >
        <el-form-item label="审批流程" prop="workflow">
          <el-select v-model="formData.workflow" placeholder="请选择审批流程">
            <el-option
              v-for="option in workflowOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="() => { ElMessage.info('跳转到流程管理功能') }">
            新增审批流程
          </el-button>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="dialogType === 'workflow' ? submitWorkflow() : submitForm()"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.document-management-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.table-operations {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.form-designer-placeholder {
  border: 1px dashed #ccc;
  border-radius: 4px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>