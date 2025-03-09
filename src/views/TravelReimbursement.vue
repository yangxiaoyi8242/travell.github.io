<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 表单数据
const formData = reactive({
  applicantName: '',
  department: '',
  applicationId: '', // 关联的出差申请单ID
  contractId: '', // 关联的合同ID
  paymentPlanId: '', // 关联的付款计划ID
  expenseType: '差旅费',
  amount: 0,
  startDate: '',
  endDate: '',
  purpose: '',
  invoices: [], // 从票夹导入的发票
  attachments: [], // 上传的附件
  expenseItems: [], // 费用明细
  remark: ''
})

// 表单验证规则
const rules = {
  applicantName: [{ required: true, message: '请输入申请人姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入报销金额', trigger: 'blur' }],
  applicationId: [{ required: false, message: '请选择关联的出差申请单', trigger: 'change' }],
  contractId: [{ required: false, message: '请选择关联的合同', trigger: 'change' }]
}

// 部门选项
const departments = [
  { value: 'sales', label: '销售部' },
  { value: 'marketing', label: '市场部' },
  { value: 'rd', label: '研发部' },
  { value: 'finance', label: '财务部' },
  { value: 'hr', label: '人力资源部' },
  { value: 'admin', label: '行政部' }
]

// 费用类型选项
const expenseTypes = [
  { value: 'travel', label: '差旅费' },
  { value: 'hotel', label: '住宿费' },
  { value: 'meal', label: '餐饮费' },
  { value: 'transport', label: '交通费' },
  { value: 'other', label: '其他费用' }
]

// 表单引用
const formRef = ref(null)
const loading = ref(false)

// 出差申请单列表
const travelApplications = ref([
  {
    id: 'TA20230001',
    title: '上海客户拜访',
    startDate: '2023-07-01',
    endDate: '2023-07-03',
    purpose: '拜访上海客户，洽谈合作事宜',
    status: 'approved'
  },
  {
    id: 'TA20230002',
    title: '北京产品展示会',
    startDate: '2023-07-10',
    endDate: '2023-07-12',
    purpose: '参加北京产品展示会',
    status: 'approved'
  },
  {
    id: 'TA20230003',
    title: '广州技术交流会',
    startDate: '2023-07-15',
    endDate: '2023-07-18',
    purpose: '参加广州技术交流会',
    status: 'approved'
  }
])

// 个人票夹中的发票
const personalInvoices = ref([
  {
    id: 'INV20230001',
    title: '酒店住宿费',
    amount: 680,
    date: '2023-07-01',
    type: '住宿费',
    verified: true
  },
  {
    id: 'INV20230002',
    title: '高铁票',
    amount: 553.5,
    date: '2023-07-01',
    type: '交通费',
    verified: true
  },
  {
    id: 'INV20230003',
    title: '餐饮费',
    amount: 108,
    date: '2023-07-02',
    type: '餐饮费',
    verified: true
  },
  {
    id: 'INV20230004',
    title: '打车费',
    amount: 45,
    date: '2023-07-02',
    type: '交通费',
    verified: true
  }
])

// 选择出差申请单对话框
const applicationDialogVisible = ref(false)

// 选择发票对话框
const invoiceDialogVisible = ref(false)

// 选择的发票
const selectedInvoices = ref([])

// 合同列表数据
const contracts = ref([
  {
    id: 'CT20230001',
    title: '软件开发合同A',
    customer: '上海某科技有限公司',
    amount: 100000,
    paymentPlans: [
      {
        id: 'PP20230001',
        phase: '项目启动',
        amount: 30000,
        planDate: '2023-07-15',
        status: 'pending'
      },
      {
        id: 'PP20230002',
        phase: '中期交付',
        amount: 40000,
        planDate: '2023-08-15',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CT20230002',
    title: '技术服务合同B',
    customer: '北京某信息技术有限公司',
    amount: 80000,
    paymentPlans: [
      {
        id: 'PP20230003',
        phase: '服务启动',
        amount: 40000,
        planDate: '2023-07-20',
        status: 'pending'
      }
    ]
  }
])

// 选择合同对话框
const contractDialogVisible = ref(false)

// 当前选中的合同
const currentContract = ref(null)

// 初始化数据
onMounted(() => {
  // 这里可以添加获取数据的逻辑
})

// 打开选择出差申请单对话框
const openApplicationDialog = () => {
  applicationDialogVisible.value = true
}

// 选择出差申请单
const selectApplication = (application) => {
  formData.applicationId = application.id
  formData.purpose = application.purpose
  formData.startDate = application.startDate
  formData.endDate = application.endDate
  
  applicationDialogVisible.value = false
  
  ElMessage.success('已关联出差申请单：' + application.title)
}

// 打开选择发票对话框
const openInvoiceDialog = () => {
  invoiceDialogVisible.value = true
  selectedInvoices.value = [...formData.invoices]
}

// 打开选择合同对话框
const openContractDialog = () => {
  contractDialogVisible.value = true
}

// 选择合同和付款计划
const selectContractAndPlan = (contract, plan) => {
  formData.contractId = contract.id
  formData.paymentPlanId = plan.id
  
  // 根据合同和付款计划填充表单数据
  formData.amount = plan.amount
  formData.purpose = `合同「${contract.title}」的${plan.phase}付款`
  
  contractDialogVisible.value = false
  
  ElMessage.success(`已关联合同：${contract.title} - ${plan.phase}`)
}

// 选择/取消选择发票
const toggleInvoiceSelection = (invoice) => {
  const index = selectedInvoices.value.findIndex(item => item.id === invoice.id)
  if (index === -1) {
    selectedInvoices.value.push(invoice)
  } else {
    selectedInvoices.value.splice(index, 1)
  }
}

// 确认选择发票
const confirmInvoiceSelection = () => {
  formData.invoices = [...selectedInvoices.value]
  
  // 更新费用明细和总金额
  updateExpenseItems()
  
  invoiceDialogVisible.value = false
  
  ElMessage.success(`已选择${formData.invoices.length}张发票`)
}

// 更新费用明细和总金额
const updateExpenseItems = () => {
  // 清空现有费用明细
  formData.expenseItems = []
  
  // 根据发票生成费用明细
  formData.invoices.forEach(invoice => {
    formData.expenseItems.push({
      type: invoice.type,
      date: invoice.date,
      description: invoice.title,
      amount: invoice.amount
    })
  })
  
  // 计算总金额
  formData.amount = formData.expenseItems.reduce((sum, item) => sum + item.amount, 0)
}

// 上传文件变化处理
const handleFileChange = (file, fileList) => {
  formData.attachments = fileList
  return false
}

// 删除文件处理
const handleFileRemove = (file, fileList) => {
  formData.attachments = fileList
}

// 上传文件前的验证
const beforeUpload = (file) => {
  const isValidFormat = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10
  
  if (!isValidFormat) {
    ElMessage.error('上传文件只能是JPG/PNG/PDF格式!')
    return false
  }
  
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过10MB!')
    return false
  }
  
  // 模拟OCR识别
  setTimeout(() => {
    ElMessage.success('文件上传成功，已自动识别文件内容')
  }, 1000)
  
  return true
}

// 添加费用明细
const addExpenseItem = () => {
  formData.expenseItems.push({
    type: '',
    date: '',
    description: '',
    amount: 0
  })
}

// 删除费用明细
const removeExpenseItem = (index) => {
  formData.expenseItems.splice(index, 1)
  // 重新计算总金额
  formData.amount = formData.expenseItems.reduce((sum, item) => sum + item.amount, 0)
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      
      // 模拟提交数据到后端
      setTimeout(() => {
        loading.value = false
        ElMessage({
          message: '出差报销单提交成功！',
          type: 'success'
        })
        resetForm()
      }, 1000)
    } else {
      console.log('表单验证失败', fields)
    }
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    formData.invoices = []
    formData.attachments = []
    formData.expenseItems = []
  }
}
</script>

<template>
  <div class="travel-reimbursement-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h2>出差报销单</h2>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="reimbursement-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请人" prop="applicantName">
              <el-input v-model="formData.applicantName" placeholder="请输入申请人姓名" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department">
              <el-select v-model="formData.department" placeholder="请选择所属部门" style="width: 100%">
                <el-option
                  v-for="dept in departments"
                  :key="dept.value"
                  :label="dept.label"
                  :value="dept.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="关联申请单" prop="applicationId">
          <div class="application-selector">
            <el-input 
              v-model="formData.applicationId" 
              placeholder="请选择关联的出差申请单" 
              readonly 
              class="application-input"
            />
            <el-button type="primary" @click="openApplicationDialog">选择申请单</el-button>
            <el-button type="success" @click="openContractDialog">选择付款合同</el-button>
          </div>
        </el-form-item>
        
        <el-row :gutter="20" v-if="formData.applicationId">
          <el-col :span="12">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="开始日期"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                placeholder="结束日期"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="出差事由" v-if="formData.applicationId">
          <el-input
            v-model="formData.purpose"
            type="textarea"
            rows="2"
            placeholder="出差事由"
            disabled
          />
        </el-form-item>
        
        <el-divider content-position="center">费用明细</el-divider>
        
        <el-form-item>
          <div class="invoice-actions">
            <el-button type="primary" @click="openInvoiceDialog">从票夹导入发票</el-button>
            <el-button type="success" @click="addExpenseItem">手动添加费用</el-button>
          </div>
        </el-form-item>
        
        <el-table :data="formData.expenseItems" style="width: 100%" border>
          <el-table-column label="费用类型" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.type" placeholder="请选择费用类型" style="width: 100%">
                <el-option
                  v-for="type in expenseTypes"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column label="日期" width="150">
            <template #default="scope">
              <el-date-picker
                v-model="scope.row.date"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          
          <el-table-column label="描述" min-width="200">
            <template #default="scope">
              <el-input v-model="scope.row.description" placeholder="请输入费用描述" />
            </template>
          </el-table-column>
          
          <el-table-column label="金额" width="150">
            <template #default="scope">
              <el-input-number 
                v-model="scope.row.amount" 
                :precision="2" 
                :step="10" 
                :min="0"
                @change="updateExpenseItems"
              />
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button 
                type="danger" 
                circle 
                size="small"
                @click="removeExpenseItem(scope.$index)"
              >
                <el-icon><i-ep-delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-form-item label="报销总额" prop="amount">
          <el-input-number 
            v-model="formData.amount" 
            :precision="2" 
            :step="100" 
            :min="0"
            :disabled="formData.expenseItems.length > 0"
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="上传附件">
          <el-upload
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="beforeUpload"
            :file-list="formData.attachments"
            multiple
            list-type="picture-card"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="upload-tip">请上传相关票据或证明文件，支持JPG/PNG/PDF格式，单个文件不超过10MB</div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息（选填）"
          />
        </el-form-item>
        
        <el-form-item class="form-buttons">
          <el-button type="primary" @click="submitForm" :loading="loading">提交报销</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 选择出差申请单对话框 -->
    <el-dialog
      v-model="applicationDialogVisible"
      title="选择关联的出差申请单"
      width="700px"
    >
      <el-table
        :data="travelApplications"
        style="width: 100%"
        border
        @row-click="selectApplication"
      >
        <el-table-column prop="id" label="申请单号" width="120" />
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="purpose" label="出差事由" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 'approved'">已批准</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 'pending'">审批中</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 'rejected'">已拒绝</el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="applicationDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 选择发票对话框 -->
    <el-dialog
      v-model="invoiceDialogVisible"
      title="从票夹选择发票"
      width="700px"
    >
      <el-table
        :data="personalInvoices"
        style="width: 100%"
        border
        @row-click="toggleInvoiceSelection"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="发票编号" width="120" />
        <el-table-column prop="title" label="发票内容" min-width="150" />
        <el-table-column prop="type" label="费用类型" width="120" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            <span>¥ {{ scope.row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="verified" label="验真状态" width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.verified">已验真</el-tag>
            <el-tag type="warning" v-else>未验真</el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="invoiceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmInvoiceSelection">确认选择</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 选择合同对话框 -->
    <el-dialog
      v-model="contractDialogVisible"
      title="选择关联的付款合同"
      width="800px"
    >
      <div v-for="contract in contracts" :key="contract.id" class="contract-item">
        <el-card class="contract-card">
          <template #header>
            <div class="contract-header">
              <h3>{{ contract.title }}</h3>
              <span>合同编号: {{ contract.id }}</span>
            </div>
          </template>
          
          <div class="contract-info">
            <p><strong>客户:</strong> {{ contract.customer }}</p>
            <p><strong>合同金额:</strong> ¥ {{ contract.amount.toLocaleString() }}</p>
          </div>
          
          <el-divider content-position="center">付款计划</el-divider>
          
          <el-table :data="contract.paymentPlans" style="width: 100%" border>
            <el-table-column prop="phase" label="阶段" width="150" />
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="scope">
                <span>¥ {{ scope.row.amount.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="planDate" label="计划日期" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag type="warning" v-if="scope.row.status === 'pending'">待付款</el-tag>
                <el-tag type="success" v-else-if="scope.row.status === 'paid'">已付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button 
                  type="primary" 
                  size="small"
                  @click="selectContractAndPlan(contract, scope.row)"
                >
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="contractDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.travel-reimbursement-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.form-card {
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

.application-selector {
  display: flex;
  gap: 10px;
}

.application-input {
  flex: 1;
}

.invoice-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 5px;
}

.form-buttons {
  margin-top: 20px;
  text-align: center;
}

.contract-item {
  margin-bottom: 20px;
}

.contract-card {
  margin-bottom: 15px;
}

.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contract-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.contract-info {
  margin-bottom: 15px;
}
</style>