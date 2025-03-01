<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Delete, Edit, Setting, Download, Upload, VideoPlay, VideoPause } from '@element-plus/icons-vue'

// 标签页激活名称
const activeTab = ref('standard')

// ================ 差标管理相关 ================

// 差标类型选项
const standardTypeOptions = [
  { value: 'all', label: '全部' },
  { value: 'domestic', label: '国内差标' },
  { value: 'international', label: '国际差标' },
  { value: 'special', label: '特殊差标' }
]

// 差标状态选项
const standardStatusOptions = [
  { value: 'all', label: '全部' },
  { value: 'enabled', label: '启用' },
  { value: 'disabled', label: '停用' }
]

// 差标搜索条件
const standardSearchForm = reactive({
  name: '',
  type: 'all',
  status: 'all'
})

// 差标表格数据
const standardTableData = ref([])
const standardLoading = ref(false)
const standardMultipleSelection = ref([])

// 差标分页
const standardPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 差标模态框相关
const standardDialogVisible = ref(false)
const standardDialogType = ref('') // 'new', 'edit'
const standardDialogTitle = ref('')
const currentStandard = ref(null)

// 差标表单数据
const standardFormData = reactive({
  id: '',
  name: '',
  type: 'domestic',
  status: 'enabled',
  hotelStandard: '',
  mealStandard: '',
  trafficStandard: '',
  otherStandard: '',
  description: ''
})

// 差标表单验证规则
const standardRules = {
  name: [{ required: true, message: '请输入差标名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择差标类型', trigger: 'change' }],
  hotelStandard: [{ required: true, message: '请输入住宿标准', trigger: 'blur' }],
  mealStandard: [{ required: true, message: '请输入餐饮标准', trigger: 'blur' }],
  trafficStandard: [{ required: true, message: '请输入交通标准', trigger: 'blur' }]
}

// 差标表单引用
const standardFormRef = ref(null)

// 初始化差标数据
onMounted(() => {
  fetchStandards()
  fetchAllowances()
})

// 获取差标列表
const fetchStandards = () => {
  standardLoading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    const mockData = [
      {
        id: '1',
        name: '普通员工国内差标',
        type: 'domestic',
        status: 'enabled',
        hotelStandard: '三星级酒店标准间，不超过400元/晚',
        mealStandard: '不超过100元/天',
        trafficStandard: '高铁二等座，飞机经济舱',
        otherStandard: '市内交通不超过80元/天',
        description: '适用于普通员工国内出差'
      },
      {
        id: '2',
        name: '经理级国内差标',
        type: 'domestic',
        status: 'enabled',
        hotelStandard: '四星级酒店标准间，不超过600元/晚',
        mealStandard: '不超过150元/天',
        trafficStandard: '高铁一等座，飞机经济舱',
        otherStandard: '市内交通不超过100元/天',
        description: '适用于经理级别人员国内出差'
      },
      {
        id: '3',
        name: '总监级国内差标',
        type: 'domestic',
        status: 'enabled',
        hotelStandard: '五星级酒店标准间，不超过800元/晚',
        mealStandard: '不超过200元/天',
        trafficStandard: '高铁商务座，飞机公务舱',
        otherStandard: '市内交通不超过150元/天',
        description: '适用于总监级别人员国内出差'
      },
      {
        id: '4',
        name: '普通员工国际差标',
        type: 'international',
        status: 'enabled',
        hotelStandard: '三星级酒店标准间，不超过100美元/晚',
        mealStandard: '不超过60美元/天',
        trafficStandard: '飞机经济舱',
        otherStandard: '市内交通不超过50美元/天',
        description: '适用于普通员工国际出差'
      },
      {
        id: '5',
        name: '经理级国际差标',
        type: 'international',
        status: 'enabled',
        hotelStandard: '四星级酒店标准间，不超过150美元/晚',
        mealStandard: '不超过80美元/天',
        trafficStandard: '飞机经济舱',
        otherStandard: '市内交通不超过70美元/天',
        description: '适用于经理级别人员国际出差'
      },
      {
        id: '6',
        name: '特殊项目差标',
        type: 'special',
        status: 'disabled',
        hotelStandard: '四星级酒店标准间，不超过1000元/晚',
        mealStandard: '不超过300元/天',
        trafficStandard: '高铁商务座，飞机公务舱',
        otherStandard: '市内交通不限额',
        description: '适用于特殊项目出差'
      }
    ]
    
    // 根据搜索条件过滤
    let filteredData = [...mockData]
    
    if (standardSearchForm.name) {
      filteredData = filteredData.filter(item => item.name.includes(standardSearchForm.name))
    }
    
    if (standardSearchForm.type !== 'all') {
      filteredData = filteredData.filter(item => item.type === standardSearchForm.type)
    }
    
    if (standardSearchForm.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === standardSearchForm.status)
    }
    
    standardPagination.total = filteredData.length
    
    // 分页处理
    const start = (standardPagination.currentPage - 1) * standardPagination.pageSize
    const end = start + standardPagination.pageSize
    standardTableData.value = filteredData.slice(start, end)
    
    standardLoading.value = false
  }, 500)
}

// 差标搜索
const handleStandardSearch = () => {
  standardPagination.currentPage = 1
  fetchStandards()
}

// 重置差标搜索
const resetStandardSearch = () => {
  standardSearchForm.name = ''
  standardSearchForm.type = 'all'
  standardSearchForm.status = 'all'
  handleStandardSearch()
}

// 处理差标表格选择变化
const handleStandardSelectionChange = (selection) => {
  standardMultipleSelection.value = selection
}

// 处理差标分页变化
const handleStandardCurrentChange = (val) => {
  standardPagination.currentPage = val
  fetchStandards()
}

// 处理差标每页条数变化
const handleStandardSizeChange = (val) => {
  standardPagination.pageSize = val
  standardPagination.currentPage = 1
  fetchStandards()
}

// 打开新增差标对话框
const openNewStandardDialog = () => {
  standardDialogType.value = 'new'
  standardDialogTitle.value = '新增差标'
  resetStandardForm()
  standardDialogVisible.value = true
}

// 打开编辑差标对话框
const openEditStandardDialog = (row) => {
  standardDialogType.value = 'edit'
  standardDialogTitle.value = '编辑差标'
  currentStandard.value = row
  
  // 填充表单数据
  Object.keys(standardFormData).forEach(key => {
    if (key in row) {
      standardFormData[key] = row[key]
    }
  })
  
  standardDialogVisible.value = true
}

// 重置差标表单
const resetStandardForm = () => {
  standardFormData.id = ''
  standardFormData.name = ''
  standardFormData.type = 'domestic'
  standardFormData.status = 'enabled'
  standardFormData.hotelStandard = ''
  standardFormData.mealStandard = ''
  standardFormData.trafficStandard = ''
  standardFormData.otherStandard = ''
  standardFormData.description = ''
  
  // 如果表单引用存在，重置校验结果
  if (standardFormRef.value) {
    standardFormRef.value.resetFields()
  }
}

// 提交差标表单
const submitStandardForm = () => {
  standardFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟提交
      setTimeout(() => {
        ElMessage.success(standardDialogType.value === 'new' ? '新增差标成功' : '编辑差标成功')
        standardDialogVisible.value = false
        fetchStandards()
      }, 500)
    }
  })
}

// 删除差标
const deleteStandard = (row) => {
  ElMessageBox.confirm('确认删除该差标吗？删除后无法恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除操作
    ElMessage.success('删除成功')
    fetchStandards()
  }).catch(() => {})
}

// 切换差标状态
const toggleStandardStatus = (row) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  const statusText = newStatus === 'enabled' ? '启用' : '停用'
  
  ElMessageBox.confirm(`确认${statusText}该差标吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟状态切换
    row.status = newStatus
    ElMessage.success(`${statusText}成功`)
    fetchStandards()
  }).catch(() => {})
}

// ================ 差补管理相关 ================

// 差补类型选项
const allowanceTypeOptions = [
  { value: 'all', label: '全部' },
  { value: 'meal', label: '餐饮补贴' },
  { value: 'traffic', label: '交通补贴' },
  { value: 'accommodation', label: '住宿补贴' },
  { value: 'other', label: '其他补贴' }
]

// 差补状态选项
const allowanceStatusOptions = [
  { value: 'all', label: '全部' },
  { value: 'enabled', label: '启用' },
  { value: 'disabled', label: '停用' }
]

// 差补搜索条件
const allowanceSearchForm = reactive({
  name: '',
  type: 'all',
  status: 'all'
})

// 差补表格数据
const allowanceTableData = ref([])
const allowanceLoading = ref(false)
const allowanceMultipleSelection = ref([])

// 差补分页
const allowancePagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 差补模态框相关
const allowanceDialogVisible = ref(false)
const allowanceDialogType = ref('') // 'new', 'edit'
const allowanceDialogTitle = ref('')
const currentAllowance = ref(null)

// 差补表单数据
const allowanceFormData = reactive({
  id: '',
  name: '',
  type: 'meal',
  status: 'enabled',
  amount: '',
  unit: '元/天',
  applyTo: '',
  description: ''
})

// 差补表单验证规则
const allowanceRules = {
  name: [{ required: true, message: '请输入差补名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择差补类型', trigger: 'change' }],
  amount: [{ required: true, message: '请输入差补金额', trigger: 'blur' }],
  applyTo: [{ required: true, message: '请输入适用范围', trigger: 'blur' }]
}

// 差补表单引用
const allowanceFormRef = ref(null)

// 获取差补列表
const fetchAllowances = () => {
  allowanceLoading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    const mockData = [
      {
        id: '1',
        name: '出差餐饮补贴',
        type: 'meal',
        status: 'enabled',
        amount: '50',
        unit: '元/天',
        applyTo: '所有员工',
        description: '出差期间的餐饮补贴'
      },
      {
        id: '2',
        name: '市内交通补贴',
        type: 'traffic',
        status: 'enabled',
        amount: '30',
        unit: '元/天',
        applyTo: '所有员工',
        description: '出差期间的市内交通补贴'
      },
      {
        id: '3',
        name: '住宿补贴',
        type: 'accommodation',
        status: 'enabled',
        amount: '100',
        unit: '元/天',
        applyTo: '基层员工',
        description: '基层员工出差住宿补贴'
      },
      {
        id: '4',
        name: '通讯补贴',
        type: 'other',
        status: 'enabled',
        amount: '20',
        unit: '元/天',
        applyTo: '所有员工',
        description: '出差期间的通讯补贴'
      },
      {
        id: '5',
        name: '特殊地区补贴',
        type: 'other',
        status: 'disabled',
        amount: '100',
        unit: '元/天',
        applyTo: '所有员工',
        description: '前往特殊地区出差的额外补贴'
      }
    ]
    
    // 根据搜索条件过滤
    let filteredData = [...mockData]
    
    if (allowanceSearchForm.name) {
      filteredData = filteredData.filter(item => item.name.includes(allowanceSearchForm.name))
    }
    
    if (allowanceSearchForm.type !== 'all') {
      filteredData = filteredData.filter(item => item.type === allowanceSearchForm.type)
    }
    
    if (allowanceSearchForm.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === allowanceSearchForm.status)
    }
    
    allowancePagination.total = filteredData.length
    
    // 分页处理
    const start = (allowancePagination.currentPage - 1) * allowancePagination.pageSize
    const end = start + allowancePagination.pageSize
    allowanceTableData.value = filteredData.slice(start, end)
    
    allowanceLoading.value = false
  }, 500)
}

// 差补搜索
const handleAllowanceSearch = () => {
  allowancePagination.currentPage = 1
  fetchAllowances()
}

// 重置差补搜索
const resetAllowanceSearch = () => {
  allowanceSearchForm.name = ''
  allowanceSearchForm.type = 'all'
  allowanceSearchForm.status = 'all'
  handleAllowanceSearch()
}

// 处理差补表格选择变化
const handleAllowanceSelectionChange = (selection) => {
  allowanceMultipleSelection.value = selection
}

// 处理差补分页变化
const handleAllowanceCurrentChange = (val) => {
  allowancePagination.currentPage = val
  fetchAllowances()
}

// 处理差补每页条数变化
const handleAllowanceSizeChange = (val) => {
  allowancePagination.pageSize = val
  allowancePagination.currentPage = 1
  fetchAllowances()
}

// 打开新增差补对话框
const openNewAllowanceDialog = () => {
  allowanceDialogType.value = 'new'
  allowanceDialogTitle.value = '新增差补'
  resetAllowanceForm()
  allowanceDialogVisible.value = true
}

// 打开编辑差补对话框
const openEditAllowanceDialog = (row) => {
  allowanceDialogType.value = 'edit'
  allowanceDialogTitle.value = '编辑差补'
  currentAllowance.value = row
  
  // 填充表单数据
  Object.keys(allowanceFormData).forEach(key => {
    if (key in row) {
      allowanceFormData[key] = row[key]
    }
  })
  
  allowanceDialogVisible.value = true
}

// 重置差补表单
const resetAllowanceForm = () => {
  allowanceFormData.id = ''
  allowanceFormData.name = ''
  allowanceFormData.type = 'meal'
  allowanceFormData.status = 'enabled'
  allowanceFormData.amount = ''
  allowanceFormData.unit = '元/天'
  allowanceFormData.applyTo = ''
  allowanceFormData.description = ''
  
  // 如果表单引用存在，重置校验结果
  if (allowanceFormRef.value) {
    allowanceFormRef.value.resetFields()
  }
}

// 提交差补表单
const submitAllowanceForm = () => {
  allowanceFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟提交
      setTimeout(() => {
        ElMessage.success(allowanceDialogType.value === 'new' ? '新增差补成功' : '编辑差补成功')
        allowanceDialogVisible.value = false
        fetchAllowances()
      }, 500)
    }
  })
}

// 删除差补
const deleteAllowance = (row) => {
  ElMessageBox.confirm('确认删除该差补吗？删除后无法恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除操作
    ElMessage.success('删除成功')
    fetchAllowances()
  }).catch(() => {})
}

// 切换差补状态
const toggleAllowanceStatus = (row) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  const statusText = newStatus === 'enabled' ? '启用' : '停用'
  
  ElMessageBox.confirm(`确认${statusText}该差补吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟状态切换
    row.status = newStatus
    ElMessage.success(`${statusText}成功`)
    fetchAllowances()
  }).catch(() => {})
}
</script>

<template>
  <div class="container">
    <el-tabs v-model="activeTab" class="tabs-container">
      <!-- 差标管理标签页 -->
      <el-tab-pane label="差标管理" name="standard">
        <div class="tab-content">
          <!-- 搜索区域 -->
          <el-card class="search-card" shadow="never">
            <el-form :inline="true" :model="standardSearchForm" class="search-form">
              <el-form-item label="差标名称">
                <el-input v-model="standardSearchForm.name" placeholder="请输入差标名称" clearable />
              </el-form-item>
              <el-form-item label="差标类型">
                <el-select v-model="standardSearchForm.type" placeholder="请选择差标类型" clearable>
                  <el-option
                    v-for="item in standardTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="standardSearchForm.status" placeholder="请选择状态" clearable>
                  <el-option
                    v-for="item in standardStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleStandardSearch">
                  <el-icon><Document /></el-icon>查询
                </el-button>
                <el-button @click="resetStandardSearch">
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
          
          <!-- 表格工具栏 -->
          <div class="table-toolbar">
            <el-button type="primary" @click="openNewStandardDialog">
              <el-icon><Document /></el-icon>新增差标
            </el-button>
          </div>
          
          <!-- 差标表格 -->
          <el-table
            v-loading="standardLoading"
            :data="standardTableData"
            style="width: 100%"
            border
            @selection-change="handleStandardSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="差标名称" min-width="150" show-overflow-tooltip />
            <el-table-column prop="type" label="差标类型" width="120">
              <template #default="{ row }">
                <el-tag v-if="row.type === 'domestic'" type="success">国内差标</el-tag>
                <el-tag v-else-if="row.type === 'international'" type="warning">国际差标</el-tag>
                <el-tag v-else-if="row.type === 'special'" type="info">特殊差标</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="hotelStandard" label="住宿标准" min-width="180" show-overflow-tooltip />
            <el-table-column prop="mealStandard" label="餐饮标准" min-width="150" show-overflow-tooltip />
            <el-table-column prop="trafficStandard" label="交通标准" min-width="180" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
                  {{ row.status === 'enabled' ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="openEditStandardDialog(row)">
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button 
                  :type="row.status === 'enabled' ? 'warning' : 'success'" 
                  size="small" 
                  @click="toggleStandardStatus(row)"
                >
                  <el-icon>
                    <component :is="row.status === 'enabled' ? VideoPause : VideoPlay" />
                  </el-icon>
                  {{ row.status === 'enabled' ? '停用' : '启用' }}
                </el-button>
                <el-button type="danger" size="small" @click="deleteStandard(row)">
                  <el-icon><Delete /></el-icon>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 差标分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="standardPagination.currentPage"
              v-model:page-size="standardPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="standardPagination.total"
              @size-change="handleStandardSizeChange"
              @current-change="handleStandardCurrentChange"
            />
          </div>
          
          <!-- 差标表单对话框 -->
          <el-dialog
            v-model="standardDialogVisible"
            :title="standardDialogTitle"
            width="650px"
            destroy-on-close
          >
            <el-form
              ref="standardFormRef"
              :model="standardFormData"
              :rules="standardRules"
              label-width="100px"
            >
              <el-form-item label="差标名称" prop="name">
                <el-input v-model="standardFormData.name" placeholder="请输入差标名称" />
              </el-form-item>
              <el-form-item label="差标类型" prop="type">
                <el-select v-model="standardFormData.type" placeholder="请选择差标类型" style="width: 100%">
                  <el-option
                    v-for="item in standardTypeOptions.filter(item => item.value !== 'all')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="standardFormData.status">
                  <el-radio label="enabled">启用</el-radio>
                  <el-radio label="disabled">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="住宿标准" prop="hotelStandard">
                <el-input v-model="standardFormData.hotelStandard" placeholder="请输入住宿标准" />
              </el-form-item>
              <el-form-item label="餐饮标准" prop="mealStandard">
                <el-input v-model="standardFormData.mealStandard" placeholder="请输入餐饮标准" />
              </el-form-item>
              <el-form-item label="交通标准" prop="trafficStandard">
                <el-input v-model="standardFormData.trafficStandard" placeholder="请输入交通标准" />
              </el-form-item>
              <el-form-item label="其他标准" prop="otherStandard">
                <el-input v-model="standardFormData.otherStandard" placeholder="请输入其他标准" />
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input
                  v-model="standardFormData.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入描述信息"
                />
              </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="standardDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitStandardForm">确定</el-button>
              </div>
            </template>
          </el-dialog>
          
          <!-- 差补表单对话框 -->
          <el-dialog
            v-model="allowanceDialogVisible"
            :title="allowanceDialogTitle"
            width="650px"
            destroy-on-close
          >
            <el-form
              ref="allowanceFormRef"
              :model="allowanceFormData"
              :rules="allowanceRules"
              label-width="100px"
            >
              <el-form-item label="差补名称" prop="name">
                <el-input v-model="allowanceFormData.name" placeholder="请输入差补名称" />
              </el-form-item>
              <el-form-item label="差补类型" prop="type">
                <el-select v-model="allowanceFormData.type" placeholder="请选择差补类型" style="width: 100%">
                  <el-option
                    v-for="item in allowanceTypeOptions.filter(item => item.value !== 'all')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="allowanceFormData.status">
                  <el-radio label="enabled">启用</el-radio>
                  <el-radio label="disabled">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="补贴金额" prop="amount">
                <el-input v-model="allowanceFormData.amount" placeholder="请输入补贴金额" />
              </el-form-item>
              <el-form-item label="单位" prop="unit">
                <el-input v-model="allowanceFormData.unit" placeholder="请输入单位" />
              </el-form-item>
              <el-form-item label="适用范围" prop="applyTo">
                <el-input v-model="allowanceFormData.applyTo" placeholder="请输入适用范围" />
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input
                  v-model="allowanceFormData.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入描述信息"
                />
              </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="allowanceDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAllowanceForm">确定</el-button>
              </div>
            </template>
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.tabs-container {
  margin-bottom: 20px;
}

.tab-content {
  padding: 10px 0;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

.table-toolbar {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
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