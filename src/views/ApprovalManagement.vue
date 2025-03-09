<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 审批类型
const approvalTypes = [
  { value: 'expense', label: '费用审批' },
  { value: 'reimbursement', label: '报销审批' }
]

// 当前选中的审批类型
const currentType = ref('expense')

// 模拟审批数据
const approvalList = ref([
  // 费用审批数据
  {
    id: '2023060001',
    type: 'expense',
    applicantName: '张三',
    department: '销售部',
    expenseType: '差旅费',
    amount: 2580.50,
    purpose: '客户拜访交通及住宿费用',
    submitTime: '2023-06-10 09:30:45',
    status: 'pending',
    paymentStatus: 'unpaid'
  },
  {
    id: '2023060002',
    type: 'expense',
    applicantName: '李四',
    department: '市场部',
    expenseType: '业务招待费',
    amount: 1850.00,
    purpose: '与潜在客户洽谈业务',
    submitTime: '2023-06-11 14:20:33',
    status: 'pending',
    paymentStatus: 'unpaid'
  },
  // 报销审批数据
  {
    id: '2023070001',
    type: 'reimbursement',
    applicantName: '王五',
    department: '研发部',
    expenseType: '办公用品',
    amount: 3200.00,
    submitTime: '2023-07-05 16:10:45',
    status: 'approved',
    paymentStatus: 'unpaid'
  },
  {
    id: '2023070002',
    type: 'reimbursement',
    applicantName: '赵六',
    department: '人力资源部',
    expenseType: '培训费',
    amount: 5000.00,
    submitTime: '2023-07-07 14:25:30',
    status: 'approved',
    paymentStatus: 'paid'
  }
])

// 表格加载状态
const tableLoading = ref(false)

// 当前选中的审批详情
const currentApproval = ref(null)

// 审批对话框可见性
const approvalDialogVisible = ref(false)

// 付款对话框可见性
const paymentDialogVisible = ref(false)

// 审批表单
const approvalForm = reactive({
  result: '',
  comment: ''
})

// 付款表单
const paymentForm = reactive({
  paymentMethod: '',
  paymentAccount: '',
  paymentDate: '',
  remark: ''
})

// 审批结果选项
const approvalOptions = [
  { value: 'approved', label: '同意' },
  { value: 'rejected', label: '拒绝' }
]

// 付款方式选项
const paymentMethods = [
  { value: 'bank', label: '银行转账' },
  { value: 'cash', label: '现金支付' },
  { value: 'wechat', label: '微信支付' },
  { value: 'alipay', label: '支付宝' }
]

// 表单规则
const approvalRules = {
  result: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  comment: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
}

const paymentRules = {
  paymentMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
  paymentAccount: [{ required: true, message: '请输入付款账号', trigger: 'blur' }],
  paymentDate: [{ required: true, message: '请选择付款日期', trigger: 'change' }]
}

const approvalFormRef = ref(null)
const paymentFormRef = ref(null)

// 切换审批类型
const handleTypeChange = (type) => {
  currentType.value = type
}

// 获取当前类型的数据
const filteredList = computed(() => {
  return approvalList.value.filter(item => item.type === currentType.value)
})

// 查看审批详情
const viewDetail = (row) => {
  currentApproval.value = row
  if (row.status === 'pending' && row.type === 'expense') {
    approvalDialogVisible.value = true
    // 重置审批表单
    approvalForm.result = ''
    approvalForm.comment = ''
  } else if (row.status === 'approved' && row.paymentStatus === 'unpaid' && row.type === 'reimbursement') {
    paymentDialogVisible.value = true
    // 重置付款表单
    paymentForm.paymentMethod = ''
    paymentForm.paymentAccount = ''
    paymentForm.paymentDate = ''
    paymentForm.remark = ''
  } else {
    ElMessageBox.alert('查看详情', {
      title: '详情信息',
      message: h('div', null, [
        h('p', null, `申请编号：${row.id}`),
        h('p', null, `申请人：${row.applicantName}`),
        h('p', null, `部门：${row.department}`),
        h('p', null, `费用类型：${row.expenseType}`),
        h('p', null, `金额：¥${row.amount.toFixed(2)}`),
        h('p', null, `状态：${getStatusText(row.status)}`),
        h('p', null, `付款状态：${getPaymentStatusText(row.paymentStatus)}`),
        h('p', null, `提交时间：${row.submitTime}`)
      ])
    })
  }
}

// 提交审批
const submitApproval = async () => {
  if (!approvalFormRef.value) return
  
  await approvalFormRef.value.validate((valid, fields) => {
    if (valid) {
      const loading = ElMessage({
        message: '正在提交审批结果...',
        type: 'info',
        duration: 0
      })
      
      setTimeout(() => {
        loading.close()
        
        // 更新申请状态
        const index = approvalList.value.findIndex(item => item.id === currentApproval.value.id)
        if (index !== -1) {
          approvalList.value[index].status = approvalForm.result
        }
        
        ElMessage({
          message: '审批操作已完成！',
          type: 'success'
        })
        
        approvalDialogVisible.value = false
      }, 1000)
    }
  })
}

// 提交付款
const submitPayment = async () => {
  if (!paymentFormRef.value) return
  
  await paymentFormRef.value.validate((valid, fields) => {
    if (valid) {
      const loading = ElMessage({
        message: '正在处理付款...',
        type: 'info',
        duration: 0
      })
      
      setTimeout(() => {
        loading.close()
        
        // 更新付款状态
        const index = approvalList.value.findIndex(item => item.id === currentApproval.value.id)
        if (index !== -1) {
          approvalList.value[index].paymentStatus = 'paid'
        }
        
        ElMessage({
          message: '付款处理成功！',
          type: 'success'
        })
        
        paymentDialogVisible.value = false
      }, 1000)
    }
  })
}

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态显示文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待审批',
    approved: '已同意',
    rejected: '已拒绝'
  }
  return statusMap[status] || '未知状态'
}

// 获取付款状态标签类型
const getPaymentStatusType = (status) => {
  const statusMap = {
    unpaid: 'warning',
    paid: 'success'
  }
  return statusMap[status] || 'info'
}

// 获取付款状态显示文本
const getPaymentStatusText = (status) => {
  const statusMap = {
    unpaid: '未付款',
    paid: '已付款'
  }
  return statusMap[status] || '未知状态'
}

// 加载数据
onMounted(() => {
  tableLoading.value = true
  // 模拟从服务器加载数据
  setTimeout(() => {
    tableLoading.value = false
  }, 800)
})
</script>

<template>
  <div class="approval-container">
    <el-card class="approval-card">
      <template #header>
        <div class="card-header">
          <h2>审批管理</h2>
          <el-radio-group v-model="currentType" @change="handleTypeChange">
            <el-radio-button
              v-for="type in approvalTypes"
              :key="type.value"
              :label="type.value"
            >
              {{ type.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </template>
      
      <el-table
        :data="filteredList"
        style="width: 100%"
        border
        v-loading="tableLoading"
        row-key="id"
      >
        <el-table-column prop="id" label="申请编号" width="120" />
        <el-table-column prop="applicantName" label="申请人" width="100" />
        <el-table-column prop="department" label="所属部门" width="120" />
        <el-table-column prop="expenseType" label="费用类型" width="120" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            <span>¥ {{ scope.row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审批状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="付款状态" width="100">
          <template #default="scope">
            <el-tag :type="getPaymentStatusType(scope.row.paymentStatus)">
              {{ getPaymentStatusText(scope.row.paymentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="viewDetail(scope.row)"
            >
              {{ scope.row.status === 'pending' && scope.row.type === 'expense' ? '审批' : 
                 scope.row.status === 'approved' && scope.row.paymentStatus === 'unpaid' && scope.row.type === 'reimbursement' ? '付款' : '查看' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 审批对话框 -->
    <el-dialog
      v-model="approvalDialogVisible"
      title="费用申请审批"
      width="600px"
      destroy-on-close
    >
      <div v-if="currentApproval" class="approval-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请编号">{{ currentApproval.id }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ currentApproval.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ currentApproval.department }}</el-descriptions-item>
          <el-descriptions-item label="费用类型">{{ currentApproval.expenseType }}</el-descriptions-item>
          <el-descriptions-item label="金额">¥ {{ currentApproval.amount.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ currentApproval.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="用途" :span="2">{{ currentApproval.purpose }}</el-descriptions-item>
        </el-descriptions>
        
        <el-divider content-position="center">审批意见</el-divider>
        
        <el-form
          ref="approvalFormRef"
          :model="approvalForm"
          :rules="approvalRules"
          label-width="100px"
        >
          <el-form-item label="审批结果" prop="result">
            <el-radio-group v-model="approvalForm.result">
              <el-radio
                v-for="option in approvalOptions"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="审批意见" prop="comment">
            <el-input
              v-model="approvalForm.comment"
              type="textarea"
              :rows="4"
              placeholder="请输入审批意见"
            />
          </el-form-item>
        </el-form>
        
        <div class="dialog-footer">
          <el-button @click="approvalDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApproval">提交</el-button>
        </div>
      </div>
    </el-dialog>