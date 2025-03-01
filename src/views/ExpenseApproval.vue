<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟待审批的费用申请数据
const expenseApplications = ref([
  {
    id: '2023060001',
    applicantName: '张三',
    department: '销售部',
    expenseType: '差旅费',
    amount: 2580.50,
    purpose: '客户拜访交通及住宿费用',
    submitTime: '2023-06-10 09:30:45',
    status: 'pending'
  },
  {
    id: '2023060002',
    applicantName: '李四',
    department: '市场部',
    expenseType: '业务招待费',
    amount: 1850.00,
    purpose: '与潜在客户洽谈业务',
    submitTime: '2023-06-11 14:20:33',
    status: 'pending'
  },
  {
    id: '2023060003',
    applicantName: '王五',
    department: '研发部',
    expenseType: '办公用品',
    amount: 3200.00,
    purpose: '购买团队开发设备',
    submitTime: '2023-06-12 11:05:27',
    status: 'pending'
  },
  {
    id: '2023060004',
    applicantName: '赵六',
    department: '人力资源部',
    expenseType: '培训费',
    amount: 5000.00,
    purpose: '员工技能提升培训',
    submitTime: '2023-06-13 16:45:12',
    status: 'pending'
  }
])

// 表格加载状态
const tableLoading = ref(false)

// 当前选中的申请详情
const currentApplication = ref(null)

// 审批对话框可见性
const approvalDialogVisible = ref(false)

// 审批表单
const approvalForm = reactive({
  result: '',
  comment: ''
})

// 审批结果选项
const approvalOptions = [
  { value: 'approved', label: '同意' },
  { value: 'rejected', label: '拒绝' }
]

// 审批表单规则
const approvalRules = {
  result: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  comment: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
}

const approvalFormRef = ref(null)

// 查看申请详情
const viewDetail = (row) => {
  currentApplication.value = row
  approvalDialogVisible.value = true
  // 重置审批表单
  approvalForm.result = ''
  approvalForm.comment = ''
}

// 提交审批
const submitApproval = async () => {
  if (!approvalFormRef.value) return
  
  await approvalFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 模拟提交审批结果
      const loading = ElMessage({
        message: '正在提交审批结果...',
        type: 'info',
        duration: 0
      })
      
      setTimeout(() => {
        loading.close()
        
        // 更新申请状态
        const index = expenseApplications.value.findIndex(item => item.id === currentApplication.value.id)
        if (index !== -1) {
          expenseApplications.value[index].status = approvalForm.result
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
  <div class="expense-approval-container">
    <el-card class="approval-card">
      <template #header>
        <div class="card-header">
          <h2>费用审批</h2>
        </div>
      </template>
      
      <el-table
        :data="expenseApplications"
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
        <el-table-column prop="purpose" label="用途" min-width="200" show-overflow-tooltip />
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="viewDetail(scope.row)"
              :disabled="scope.row.status !== 'pending'"
            >
              审批
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
      <div v-if="currentApplication" class="approval-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请编号">{{ currentApplication.id }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ currentApplication.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ currentApplication.department }}</el-descriptions-item>
          <el-descriptions-item label="费用类型">{{ currentApplication.expenseType }}</el-descriptions-item>
          <el-descriptions-item label="金额">¥ {{ currentApplication.amount.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ currentApplication.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="用途" :span="2">{{ currentApplication.purpose }}</el-descriptions-item>
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
              rows="3"
              placeholder="请输入审批意见"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approvalDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApproval">提交审批</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.expense-approval-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.approval-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.approval-detail {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>