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
  applyTo: [{ required: