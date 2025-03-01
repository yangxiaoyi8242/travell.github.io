<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟报销数据
const reimbursementList = ref([
  {
    id: '2023070001',
    applicantName: '张三',
    department: '销售部',
    expenseType: '差旅费',
    amount: 2580.50,
    status: 'pending',
    submitTime: '2023-07-01 10:15:30',
    approvalTime: '2023-07-02 14:30:00',
    paymentStatus: 'unpaid'
  },
  {
    id: '2023070002',
    applicantName: '李四',
    department: '市场部',
    expenseType: '业务招待费',
    amount: 1850.00,
    status: 'approved',
    submitTime: '2023-07-03 09:20:15',
    approvalTime: '2023-07-04 11:45:20',
    paymentStatus: 'unpaid'
  },
  {
    id: '2023070003',
    applicantName: '王五',
    department: '研发部',
    expenseType: '办公用品',
    amount: 3200.00,
    status: 'approved',
    submitTime: '2023-07-05 16:10:45',
    approvalTime: '2023-07-06 10:30:00',
    paymentStatus: 'paid'
  },
  {
    id: '2023070004',
    applicantName: '赵六',
    department: '人力资源部',
    expenseType: '培训费',
    amount: 5000.00,
    status: 'rejected',
    submitTime: '2023-07-07 14:25:30',
    approvalTime: '2023-07-08 09:15:10',
    paymentStatus: 'unpaid'
  }
])

// 表格加载状态
const tableLoading = ref(false)

// 当前选中的报销详情
const currentReimbursement = ref(null)

// 详情对话框可见性
const detailDialogVisible = ref(false)

// 付款对话框可见性
const paymentDialogVisible = ref(false)

// 付款表单
const paymentForm = reactive({
  paymentMethod: '',
  paymentAccount: '',
  paymentDate: '',
  remark: ''
})

// 付款方式选项
const paymentMethods = [
  { value: 'bank', label: '银行转账' },
  { value: 'cash', label: '现金支付' },
  { value: 'wechat', label: '微信支付' },
  { value: 'alipay', label: '支付宝' }
]

// 付款表单规则
const paymentRules = {
  paymentMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
  paymentAccount: [{ required: true, message: '请输入付款账号', trigger: 'blur' }],
  paymentDate: [{ required: true, message: '请选择付款日期', trigger: 'change' }]
}

const paymentFormRef = ref(null)

// 查看报销详情
const viewDetail = (row) => {
  currentReimbursement.value = row
  detailDialogVisible.value = true
}

// 处理付款
const handlePayment = (row) => {
  currentReimbursement.value = row
  paymentDialogVisible.value = true
  // 重置付款表单
  paymentForm.paymentMethod = ''
  paymentForm.paymentAccount = ''
  paymentForm.paymentDate = ''
  paymentForm.remark = ''
}

// 提交付款
const submitPayment = async () => {
  if (!paymentFormRef.value) return
  
  await paymentFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 模拟提交付款信息
      const loading = ElMessage({
        message: '正在处理付款...',
        type: 'info',
        duration: 0
      })
      
      setTimeout(() => {
        loading.close()
        
        // 更新报销状态
        const index = reimbursementList.value.findIndex(item => item.id === currentReimbursement.value.id)
        if (index !== -1) {
          reimbursementList.value[index].paymentStatus = 'paid'
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
  <div class="reimbursement-container">
    <el-card class="reimbursement-card">
      <template #header>
        <div class="card-header">
          <h2>报销管理</h2>
        </div>
      </template>
      
      <el-table
        :data="reimbursementList"
        style="width: 100%"
        border
        v-loading="tableLoading"
        row-key="id"
      >
        <el-table-column prop="id" label="报销单号" width="120" />
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
              查看
            </el-button>
            <el-button
              link
              type="success"
              @click="handlePayment(scope.row)"
              :disabled="scope.row.status !== 'approved' || scope.row.paymentStatus === 'paid'"
            >
              付款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="报销单详情"
      width="600px"
      destroy-on-close
    >
      <div v-if="currentReimbursement" class="reimbursement-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="报销单号">{{ currentReimbursement.id }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ currentReimbursement.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ currentReimbursement.department }}</el-descriptions-item>
          <el-descriptions-item label="费用类型">{{ currentReimbursement.expenseType }}</el-descriptions-item>
          <el-descriptions-item label="金额">¥ {{ currentReimbursement.amount.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="审批状态">
            <el-tag :type="getStatusType(currentReimbursement.status)">
              {{ getStatusText(currentReimbursement.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ currentReimbursement.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="审批时间">{{ currentReimbursement.approvalTime }}</el-descriptions-item>
          <el-descriptions-item label="付款状态">
            <el-tag :type="getPaymentStatusType(currentReimbursement.paymentStatus)">
              {{ getPaymentStatusText(currentReimbursement.paymentStatus) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
    
    <!-- 付款对话框 -->
    <el-dialog
      v-model="paymentDialogVisible"
      title="处理付款"
      width="500px"
      destroy-on-close
    >
      <div v-if="currentReimbursement" class="payment-form">
        <el-alert
          title="请确认付款信息无误后再提交"
          type="warning"
          :closable="false"
          style="margin-bottom: 20px"
        />
        
        <el-descriptions :column="1" border size="small" style="margin-bottom: 20px">
          <el-descriptions-item label="报销单号">{{ currentReimbursement.id }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ currentReimbursement.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="金额">¥ {{ currentReimbursement.amount.toFixed(2) }}</el-descriptions-item>
        </el-descriptions>
        
        <el-form
          ref="paymentFormRef"
          :model="paymentForm"
          :rules="paymentRules"
          label-width="100px"
        >
          <el-form-item label="付款方式" prop="paymentMethod">
            <el-select v-model="paymentForm.paymentMethod" placeholder="请选择付款方式" style="width: 100%">
              <el-option
                v-for="item in paymentMethods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="付款账号" prop="paymentAccount">
            <el-input v-model="paymentForm.paymentAccount" placeholder="请输入付款账号" />
          </el-form-item>
          
          <el-form-item label="付款日期" prop="paymentDate">
            <el-date-picker
              v-model="paymentForm.paymentDate"
              type="date"
              placeholder="选择付款日期"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="备注">
            <el-input
              v-model="paymentForm.remark"
              type="textarea"
              rows="3"
              placeholder="请输入备注信息（选填）"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paymentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPayment">确认付款</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.reimbursement-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.reimbursement-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reimbursement-detail {
  padding: 10px;
}

.payment-form {
  padding: 10px;
}
</style>