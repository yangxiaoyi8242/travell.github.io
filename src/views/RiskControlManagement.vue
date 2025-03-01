<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Delete, Edit, Setting, Warning, Check, Close } from '@element-plus/icons-vue'

// 规则状态选项
const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'enabled', label: '启用' },
  { value: 'disabled', label: '停用' }
]

// 规则分类选项
const categoryOptions = [
  { value: 'all', label: '全部' },
  { value: 'reimbursement', label: '报销规范性' },
  { value: 'payment', label: '付款合理性' },
  { value: 'invoice', label: '票据合规性' },
  { value: 'document', label: '单据合规性' }
]

// 控制方式选项
const controlTypeOptions = [
  { value: 'reject', label: '拒绝提交' },
  { value: 'warn', label: '警告提示' }
]

// 搜索条件
const searchForm = reactive({
  name: '',
  status: 'all',
  category: 'all'
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '支付日期与发票日期不超X天',
    category: 'reimbursement',
    status: 'enabled',
    description: '支付日期早于发票日期合规性校验',
    controlType: 'warn',
    params: { days: 30 }
  },
  {
    id: 2,
    name: '报销总金额不超过预算审批金额',
    category: 'reimbursement',
    status: 'enabled',
    description: '报销总金额不超过预算审批金额',
    controlType: 'reject',
    params: {}
  },
  {
    id: 3,
    name: '支付凭证金额与发票金额一致',
    category: 'reimbursement',
    status: 'enabled',
    description: '支付凭证总金额是否与发票总金额一致',
    controlType: 'warn',
    params: {}
  },
  {
    id: 4,
    name: '未触发一日多餐',
    category: 'reimbursement',
    status: 'enabled',
    description: '一日多餐高风险提醒',
    controlType: 'warn',
    params: {}
  },
  {
    id: 5,
    name: '发票金额与行程单总金额一致性校验（车辆交通）',
    category: 'reimbursement',
    status: 'enabled',
    description: '发票金额与订单金额校验',
    controlType: 'warn',
    params: { tolerance: 5 }
  },
  {
    id: 6,
    name: '支付结算信息与税局登记账户信息校验',
    category: 'payment',
    status: 'enabled',
    description: '发票信息真伪',
    controlType: 'reject',
    params: {}
  },
  {
    id: 7,
    name: '发票日期与提单日期未超过60天',
    category: 'invoice',
    status: 'enabled',
    description: '发票日期取得后，提单日期过晚',
    controlType: 'warn',
    params: { days: 60 }
  },
  {
    id: 8,
    name: '发票敏感词汇校验',
    category: 'invoice',
    status: 'enabled',
    description: '发票敏感词汇校验',
    controlType: 'reject',
    params: { keywords: ['夜总会', '酒吧', '游戏厅', '棋牌室'] }
  },
  {
    id: 9,
    name: '借款未核销',
    category: 'reimbursement',
    status: 'enabled',
    description: '提交报销时，检查是否还有未核销借款',
    controlType: 'warn',
    params: {}
  },
  {
    id: 10,
    name: '单据未占用任何预算',
    category: 'document',
    status: 'enabled',
    description: '提交单据时，检查是否没有占用任何预算方案',
    controlType: 'warn',
    params: {}
  },
  {
    id: 11,
    name: '发票抬头范围校验',
    category: 'invoice',
    status: 'enabled',
    description: '录入发票时，检查员工是否拥有此抬头发票权限',
    controlType: 'reject',
    params: {}
  }
])

const loading = ref(false)
const multipleSelection = ref([])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: tableData.value.length
})

// 模态框相关
const dialogVisible = ref(false)
const dialogType = ref('') // 'edit', 'keywords'
const dialogTitle = ref('')
const currentRule = ref(null)

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  category: '',
  status: 'enabled',
  description: '',
  controlType: 'warn',
  params: {}
})

// 敏感词表单数据
const keywordsForm = reactive({
  keywords: []
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择规则分类', trigger: 'change' }],
  controlType: [{ required: true, message: '请选择控制方式', trigger: 'change' }]
}

// 获取分类标签类型
const getCategoryTagType = (category) => {
  const map = {
    reimbursement: '',
    payment: 'success',
    invoice: 'warning',
    document: 'info'
  }
  return map[category] || ''
}

// 获取分类名称
const getCategoryName = (category) => {
  const option = categoryOptions.find(item => item.value === category)
  return option ? option.label : ''
}

// 获取状态名称
const getStatusName = (status) => {
  const option = statusOptions.find(item => item.value === status)
  return option ? option.label : ''
}

// 获取控制方式名称
const getControlTypeName = (type) => {
  const option = controlTypeOptions.find(item => item.value === type)
  return option ? option.label : ''
}

// 搜索方法
const handleSearch = () => {
  loading.value = true
  
  // 模拟搜索请求
  setTimeout(() => {
    const filteredData = tableData.value.filter(item => {
      const nameMatch = searchForm.name ? item.name.includes(searchForm.name) : true
      const statusMatch = searchForm.status === 'all' ? true : item.status === searchForm.status
      const categoryMatch = searchForm.category === 'all' ? true : item.category === searchForm.category
      
      return nameMatch && statusMatch && categoryMatch
    })
    
    pagination.total = filteredData.length
    loading.value = false
  }, 300)
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    name: '',
    status: 'all',
    category: 'all'
  })
  handleSearch()
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  multipleSelection.value = selection
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  handleSearch()
}

// 分页页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  handleSearch()
}

// 打开编辑对话框
const handleEdit = (row) => {
  currentRule.value = row
  dialogType.value = 'edit'
  dialogTitle.value = '编辑风险控制规则'
  dialogVisible.value = true
  
  // 复制数据到表单
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    category: row.category,
    status: row.status,
    description: row.description,
    controlType: row.controlType,
    params: JSON.parse(JSON.stringify(row.params || {}))
  })
}

// 打开敏感词编辑对话框
const handleEditKeywords = (row) => {
  if (row.name !== '发票敏感词汇校验') {
    ElMessage.warning('只有发票敏感词汇校验规则可以编辑敏感词')
    return
  }
  
  currentRule.value = row
  dialogType.value = 'keywords'
  dialogTitle.value = '编辑敏感词'
  dialogVisible.value = true
  
  // 复制数据到表单
  keywordsForm.keywords = [...(row.params.keywords || [])]
}

// 切换规则状态
const toggleStatus = (row) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  const statusText = newStatus === 'enabled' ? '启用' : '停用'
  
  ElMessageBox.confirm(
    `确定要${statusText}规则「${row.name}」吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟API请求
    setTimeout(() => {
      row.status = newStatus
      ElMessage.success(`已${statusText}规则「${row.name}」`)
    }, 300)
  }).catch(() => {})
}

// 批量启用
const handleBatchEnable = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请至少选择一条规则')
    return
  }
  
  ElMessageBox.confirm(
    `确定要启用选中的 ${multipleSelection.value.length} 条规则吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟API请求
    setTimeout(() => {
      multipleSelection.value.forEach(item => {
        const row = tableData.value.find(r => r.id === item.id)
        if (row) row.status = 'enabled'
      })
      ElMessage.success(`已启用 ${multipleSelection.value.length} 条规则`)
    }, 300)
  }).catch(() => {})
}

// 批量停用
const handleBatchDisable = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请至少选择一条规则')
    return
  }
  
  ElMessageBox.confirm(
    `确定要停用选中的 ${multipleSelection.value.length} 条规则吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟API请求
    setTimeout(() => {
      multipleSelection.value.forEach(item => {
        const row = tableData.value.find(r => r.id === item.id)
        if (row) row.status = 'disabled'
      })
      ElMessage.success(`已停用 ${multipleSelection.value.length} 条规则`)
    }, 300)
  }).catch(() => {})
}

// 提交表单
const handleSubmit = () => {
  if (dialogType.value === 'edit') {
    // 模拟API请求
    setTimeout(() => {
      const index = tableData.value.findIndex(item => item.id === formData.id)
      if (index !== -1) {
        tableData.value[index] = { ...tableData.value[index], ...formData }
      }
      
      dialogVisible.value = false
      ElMessage.success('规则已更新')
    }, 300)
  } else if (dialogType.value === 'keywords') {
    // 模拟API请求
    setTimeout(() => {
      const index = tableData.value.findIndex(item => item.id === currentRule.value.id)
      if (index !== -1) {
        tableData.value[index].params.keywords = [...keywordsForm.keywords]
      }
      
      dialogVisible.value = false
      ElMessage.success('敏感词已更新')
    }, 300)
  }
}

// 添加敏感词
const addKeyword = () => {
  keywordsForm.keywords.push('')
}

// 删除敏感词
const removeKeyword = (index) => {
  keywordsForm.keywords.splice(index, 1)
}

// 初始化
onMounted(() => {
  handleSearch()
})
</script>

<template>
  <div class="risk-control-management">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="规则名称">
          <el-input v-model="searchForm.name" placeholder="请输入规则名称" clearable />
        </el-form-item>
        
        <el-form-item label="规则状态">
          <el-select v-model="searchForm.status" placeholder="请选择规则状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="规则分类">
          <el-select v-model="searchForm.category" placeholder="请选择规则分类" clearable>
            <el-option
              v-for="item in categoryOptions"
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
    
    <!-- 表格区域 -->
    <el-card class="table-card">
      <div class="table-operations">
        <div class="left-operations">
          <el-button type="primary" @click="handleBatchEnable">
            <el-icon><Check /></el-icon> 批量启用
          </el-button>
          <el-button type="danger" @click="handleBatchDisable">
            <el-icon><Close /></el-icon> 批量停用
          </el-button>
        </div>
      </div>
      
      <el-table
        v-loading="loading"
        :data="tableData.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="name" label="规则名称" min-width="200" show-overflow-tooltip />
        
        <el-table-column label="规则分类" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryTagType(scope.row.category)">
              {{ getCategoryName(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="规则状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'info'">
              {{ scope.row.status === 'enabled' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="控制方式" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.controlType === 'reject' ? 'danger' : 'warning'">
              {{ getControlTypeName(scope.row.controlType) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="规则说明" min-width="200" show-overflow-tooltip />
        
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            
            <el-button
              v-if="scope.row.name === '发票敏感词汇校验'"
              type="warning"
              size="small"
              @click="handleEditKeywords(scope.row)"
            >
              <el-icon><Setting /></el-icon> 敏感词
            </el-button>
            
            <el-button
              :type="scope.row.status === 'enabled' ? 'danger' : 'success'"
              size="small"
              @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status === 'enabled' ? '停用' : '启用' }}
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
      <!-- 编辑规则表单 -->
      <el-form
        v-if="dialogType === 'edit'"
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入规则名称" :disabled="true" />
        </el-form-item>
        
        <el-form-item label="规则分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择规则分类" :disabled="true">
            <el-option
              v-for="item in categoryOptions.filter(item => item.value !== 'all')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="控制方式" prop="controlType">
          <el-select v-model="formData.controlType" placeholder="请选择控制方式">
            <el-option
              v-for="item in controlTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="规则状态">
          <el-switch
            v-model="formData.status"
            :active-value="'enabled'"
            :inactive-value="'disabled'"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
        
        <el-form-item label="规则说明">
          <el-input v-model="formData.description" type="textarea" rows="3" placeholder="请输入规则说明" />
        </el-form-item>
        
        <!-- 动态参数表单 -->
        <template v-if="formData.name === '支付日期与发票日期不超X天'">
          <el-form-item label="天数">
            <el-input-number v-model="formData.params.days" :min="1" :max="365" />
          </el-form-item>
        </template>
        
        <template v-if="formData.name === '发票日期与提单日期未超过60天'">
          <el-form-item label="天数">
            <el-input-number v-model="formData.params.days" :min="1" :max="365" />
          </el-form-item>
        </template>
        
        <template v-if="formData.name === '发票金额与行程单总金额一致性校验（车辆交通）'">
          <el-form-item label="误差容忍度(%)">
            <el-input-number v-model="formData.params.tolerance" :min="0" :max="20" :step="0.5" />
          </el-form-item>
        </template>
      </el-form>
      
      <!-- 敏感词编辑表单 -->
      <div v-if="dialogType === 'keywords'">
        <p class="keywords-tip">请添加或编辑敏感词，发票内容包含这些词汇将被拦截</p>
        
        <div v-for="(keyword, index) in keywordsForm.keywords" :key="index" class="keyword-item">
          <el-input v-model="keywordsForm.keywords[index]" placeholder="请输入敏感词" />
          <el-button type="danger" @click="removeKeyword(index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
        
        <el-button type="primary" @click="addKeyword" class="add-keyword-btn">
          添加敏感词
        </el-button>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.risk-control-management {
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

.keyword-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.keyword-item .el-input {
  margin-right: 10px;
}

.add-keyword-btn {
  margin-top: 10px;
}

.keywords-tip {
  margin-bottom: 15px;
  color: #606266;
}
</style>