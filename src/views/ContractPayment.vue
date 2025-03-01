<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Delete, Edit, Setting, Warning, Check, Close, Upload, Plus } from '@element-plus/icons-vue'

// 合同列表数据
const contractList = ref([
  {
    id: 1,
    contractNo: 'HT-2023-001',
    counterparty: '北京科技有限公司',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    totalAmount: 100000,
    paidAmount: 30000,
    status: 'active',
    visibility: ['sales', 'finance'],
    paymentPlans: [
      { id: 1, phase: '首付款', amount: 30000, planDate: '2023-01-15', condition: '合同签订后', status: 'paid', paidDate: '2023-01-16' },
      { id: 2, phase: '进度款', amount: 40000, planDate: '2023-06-15', condition: '项目中期验收后', status: 'unpaid', paidDate: null },
      { id: 3, phase: '尾款', amount: 30000, planDate: '2023-12-15', condition: '项目终验后', status: 'unpaid', paidDate: null }
    ]
  },
  {
    id: 2,
    contractNo: 'HT-2023-002',
    counterparty: '上海贸易有限公司',
    startDate: '2023-03-01',
    endDate: '2024-02-29',
    totalAmount: 200000,
    paidAmount: 100000,
    status: 'active',
    visibility: ['marketing', 'finance', 'admin'],
    paymentPlans: [
      { id: 4, phase: '首付款', amount: 100000, planDate: '2023-03-10', condition: '合同签订后', status: 'paid', paidDate: '2023-03-12' },
      { id: 5, phase: '尾款', amount: 100000, planDate: '2023-09-10', condition: '货物交付后', status: 'unpaid', paidDate: null }
    ]
  }
])

// 搜索条件
const searchForm = reactive({
  contractNo: '',
  counterparty: '',
  status: 'all'
})

// 合同状态选项
const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '有效' },
  { value: 'expired', label: '已过期' },
  { value: 'completed', label: '已完成' }
]

// 部门选项（用于设置可见范围）
const departmentOptions = [
  { value: 'sales', label: '销售部' },
  { value: 'marketing', label: '市场部' },
  { value: 'rd', label: '研发部' },
  { value: 'finance', label: '财务部' },
  { value: 'hr', label: '人力资源部' },
  { value: 'admin', label: '行政部' }
]

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('') // 'add', 'edit', 'view', 'payment'
const dialogTitle = ref('')

// 当前选中的合同
const currentContract = ref(null)

// 合同表单数据
const formData = reactive({
  id: null,
  contractNo: '',
  counterparty: '',
  startDate: '',
  endDate: '',
  totalAmount: '',
  status: 'active',
  visibility: [],
  attachments: [],
  paymentPlans: []
})

// 表单验证规则
const rules = {
  contractNo: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
  counterparty: [{ required: true, message: '请输入签约方', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  totalAmount: [
    { required: true, message: '请输入合同总金额', trigger: 'blur' },
    { type: 'number', message: '金额必须为数字', trigger: 'blur', transform: value => Number(value) }
  ],
  visibility: [{ required: true, message: '请选择可见范围', trigger: 'change' }],
  paymentPlans: [{ required: true, message: '请至少添加一个付款计划', trigger: 'change' }]
}

const formRef = ref(null)

// 付款计划表单
const paymentPlanForm = reactive({
  phase: '',
  amount: '',
  planDate: '',
  condition: ''
})

// 付款计划表单验证规则
const paymentPlanRules = {
  phase: [{ required: true, message: '请输入付款阶段名称', trigger: 'blur' }],
  amount: [
    { required: true, message: '请输入付款金额', trigger: 'blur' },
    { type: 'number', message: '金额必须为数字', trigger: 'blur', transform: value => Number(value) }
  ],
  planDate: [{ required: true, message: '请选择计划付款日期', trigger: 'change' }],
  condition: [{ required: true, message: '请输入付款条件', trigger: 'blur' }]
}

const paymentPlanFormRef = ref(null)
const paymentPlanDialogVisible = ref(false)
const isEditingPaymentPlan = ref(false)
const currentPaymentPlanIndex = ref(-1)

// 格式化金额
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
}

// 获取合同状态类型
const getContractStatusType = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'expired':
      return 'danger'
    case 'completed':
      return 'info'
    default:
      return 'warning'
  }
}

// 获取付款状态类型
const getStatusType = (status) => {
  return status === 'paid' ? 'success' : 'warning'
}

// 获取合同付款状态
const getContractPaymentStatus = (contract) => {
  if (!contract) return ''
  if (contract.paidAmount === 0) return '未付款'
  if (contract.paidAmount === contract.totalAmount) return '已付清'
  return '部分付款'
}

// 搜索合同
const searchContracts = () => {
  // 实际项目中这里会调用API进行搜索
  console.log('搜索条件:', searchForm)
  ElMessage.success('搜索完成')
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.contractNo = ''
  searchForm.counterparty = ''
  searchForm.status = 'all'
}

// 打开新增合同对话框
const openAddDialog = () => {
  dialogType.value = 'add'
  dialogTitle.value = '新增合同'
  dialogVisible.value = true
  
  // 重置表单
  Object.assign(formData, {
    id: null,
    contractNo: '',
    counterparty: '',
    startDate: '',
    endDate: '',
    totalAmount: '',
    status: 'active',
    visibility: [],
    attachments: [],
    paymentPlans: []
  })
}

// 打开编辑合同对话框
const openEditDialog = (contract) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑合同'
  dialogVisible.value = true
  currentContract.value = contract
  
  // 填充表单数据
  Object.assign(formData, {
    id: contract.id,
    contractNo: contract.contractNo,
    counterparty: contract.counterparty,
    startDate: contract.startDate,
    endDate: contract.endDate,
    totalAmount: contract.totalAmount,
    status: contract.status,
    visibility: [...contract.visibility],
    attachments: [], // 实际项目中这里应该填充已有附件
    paymentPlans: [...contract.paymentPlans]
  })
}

// 查看合同详情
const viewContractDetail = (contract) => {
  dialogType.value = 'view'
  dialogTitle.value = '合同详情'
  dialogVisible.value = true
  currentContract.value = contract
  
  // 填充表单数据（只读模式）
  Object.assign(formData, {
    id: contract.id,
    contractNo: contract.contractNo,
    counterparty: contract.counterparty,
    startDate: contract.startDate,
    endDate: contract.endDate,
    totalAmount: contract.totalAmount,
    status: contract.status,
    visibility: [...contract.visibility],
    attachments: [], // 实际项目中这里应该填充已有附件
    paymentPlans: [...contract.paymentPlans]
  })
}

// 删除合同
const deleteContract = (contract) => {
  ElMessageBox.confirm(
    `确定要删除合同 ${contract.contractNo} 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实际项目中这里会调用API删除合同
    const index = contractList.value.findIndex(item => item.id === contract.id)
    if (index !== -1) {
      contractList.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 提交合同表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      // 验证付款计划总金额是否等于合同总金额
      const totalPlanAmount = formData.paymentPlans.reduce((sum, plan) => sum + Number(plan.amount), 0)
      if (totalPlanAmount !== Number(formData.totalAmount)) {
        ElMessage.error(`付款计划总金额(${totalPlanAmount})与合同总金额(${formData.totalAmount})不一致`)
        return
      }
      
      // 模拟提交数据到后端
      const loading = ElMessage({
        message: dialogType.value === 'add' ? '正在创建合同...' : '正在更新合同...',
        type: 'info',
        duration: 0
      })
      
      setTimeout(() => {
        loading.close()
        
        if (dialogType.value === 'add') {
          // 新增合同
          const newContract = {
            id: contractList.value.length + 1,
            contractNo: formData.contractNo,
            counterparty: formData.counterparty,
            startDate: formData.startDate,
            endDate: formData.endDate,
            totalAmount: Number(formData.totalAmount),
            paidAmount: 0,
            status: formData.status,
            visibility: [...formData.visibility],
            paymentPlans: formData.paymentPlans.map((plan, index) => ({
              id: new Date().getTime() + index,
              phase: plan.phase,
              amount: Number(plan.amount),
              planDate: plan.planDate,
              condition: plan.condition,
              status: 'unpaid',
              paidDate: null
            }))
          }
          contractList.value.push(newContract)
        } else if (dialogType.value === 'edit') {
          // 更新合同
          const index = contractList.value.findIndex(item => item.id === formData.id)
          if (index !== -1) {
            // 保留已付款信息
            const paidAmount = contractList.value[index].paidAmount
            const paymentPlans = formData.paymentPlans.map(plan => {
              const existingPlan = contractList.value[index].paymentPlans.find(p => p.id === plan.id)
              return {
                ...plan,
                status: existingPlan?.status || 'unpaid',
                paidDate: existingPlan?.paidDate || null
              }
            })
            
            contractList.value[index] = {
              ...formData,
              id: formData.id,
              totalAmount: Number(formData.totalAmount),
              paidAmount,
              paymentPlans
            }
          }
        }
        
        dialogVisible.value = false
        ElMessage.success(dialogType.value === 'add' ? '合同创建成功' : '合同更新成功')
      }, 1000)
    }
  })
}

// 打开付款计划对话框
const openPaymentPlanDialog = (isEdit = false, index = -1) => {
  isEditingPaymentPlan.value = isEdit
  currentPaymentPlanIndex.value = index
  paymentPlanDialogVisible.value = true

  if (isEdit) {
    const plan = formData.paymentPlans[index]
    Object.assign(paymentPlanForm, {
      phase: plan.phase,
      amount: plan.amount,
      planDate: plan.planDate
    })
  } else {
    // 重置表单
    Object.assign(paymentPlanForm, {
      phase: '',
      amount: '',
      planDate: '',
      condition: ''
    })
  }
}

// 提交付款计划表单
const submitPaymentPlan = async () => {
  if (!paymentPlanFormRef.value) return
  
  await paymentPlanFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (isEditingPaymentPlan.value) {
        // 编辑付款计划
        formData.paymentPlans[currentPaymentPlanIndex.value] = {
          ...formData.paymentPlans[currentPaymentPlanIndex.value],
          ...paymentPlanForm
        }
      } else {
        // 添加付款计划
        formData.paymentPlans.push({
          ...paymentPlanForm
        })
      }
      paymentPlanDialogVisible.value = false
    }
  })
}

// 删除付款计划
const deletePaymentPlan = (index) => {
  formData.paymentPlans.splice(index, 1)
}
</script>

<template>
  <div class="contract-payment-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="合同编号">
          <el-input v-model="searchForm.contractNo" placeholder="请输入合同编号" clearable />
        </el-form-item>
        <el-form-item label="签约方">
          <el-input v-model="searchForm.counterparty" placeholder="请输入签约方" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchContracts">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 合同列表 -->
    <el-card class="contract-list-card">
      <template #header>
        <div class="card-header">
          <span>合同列表</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon>新增合同
          </el-button>
        </div>
      </template>

      <el-table :data="contractList" style="width: 100%">
        <el-table-column prop="contractNo" label="合同编号" width="120" />
        <el-table-column prop="counterparty" label="签约方" width="180" />
        <el-table-column label="合同期限" width="240">
          <template #default="{ row }">
            {{ row.startDate }} 至 {{ row.endDate }}
          </template>
        </el-table-column>
        <el-table-column label="金额信息" width="200">
          <template #default="{ row }">
            <div>总金额：{{ formatAmount(row.totalAmount) }}</div>
            <div>已付金额：{{ formatAmount(row.paidAmount) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getContractStatusType(row.status)">
              {{ row.status === 'active' ? '有效' : row.status === 'expired' ? '已过期' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.paidAmount === row.totalAmount ? 'success' : row.paidAmount === 0 ? 'info' : 'warning'">
              {{ getContractPaymentStatus(row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" @click="viewContractDetail(row)" title="查看">
                <el-icon><Document /></el-icon>
              </el-button>
              <el-button type="warning" @click="openEditDialog(row)" title="编辑">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" @click="deleteContract(row)" title="删除">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 合同表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        :disabled="dialogType === 'view'"
      >
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="formData.contractNo" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="签约方" prop="counterparty">
          <el-input v-model="formData.counterparty" placeholder="请输入签约方" />
        </el-form-item>
        <el-form-item label="合同期限">
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="开始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2" class="text-center">
            <span>-</span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="合同金额" prop="totalAmount">
          <el-input-number
            v-model="formData.totalAmount"
            :min="0"
            :precision="2"
            :step="1000"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="可见范围" prop="visibility">
          <el-select
            v-model="formData.visibility"
            multiple
            placeholder="请选择可见范围"
            style="width: 100%"
          >
            <el-option
              v-for="option in departmentOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="付款计划" prop="paymentPlans">
          <div class="payment-plans-container">
            <el-table :data="formData.paymentPlans" style="width: 100%">
              <el-table-column prop="phase" label="付款阶段" width="150" />
              <el-table-column prop="amount" label="付款金额" width="150">
                <template #default="{ row }">
                  {{ formatAmount(row.amount) }}
                </template>
              </el-table-column>
              <el-table-column prop="planDate" label="计划付款日期" width="150" />
              <el-table-column prop="condition" label="付款条件" />
              <el-table-column label="操作" width="150" v-if="dialogType !== 'view'">
                <template #default="{ $index }">
                  <el-button-group>
                    <el-button
                      type="primary"
                      @click="openPaymentPlanDialog(true, $index)"
                      title="编辑"
                    >
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button
                      type="danger"
                      @click="deletePaymentPlan($index)"
                      title="删除"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-plan-button" v-if="dialogType !== 'view'">
              <el-button type="primary" @click="openPaymentPlanDialog()">
                <el-icon><Plus /></el-icon>添加付款计划
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" v-if="dialogType !== 'view'">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 付款计划表单对话框 -->
    <el-dialog
      v-model="paymentPlanDialogVisible"
      :title="isEditingPaymentPlan ? '编辑付款计划' : '添加付款计划'"
      width="40%"
    >
      <el-form
        ref="paymentPlanFormRef"
        :model="paymentPlanForm"
        :rules="paymentPlanRules"
        label-width="100px"
      >
        <el-form-item label="付款阶段" prop="phase">
          <el-input v-model="paymentPlanForm.phase" placeholder="请输入付款阶段名称" />
        </el-form-item>
        <el-form-item label="付款金额" prop="amount">
          <el-input-number
            v-model="paymentPlanForm.amount"
            :min="0"
            :precision="2"
            :step="1000"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="计划日期" prop="planDate">
          <el-date-picker
            v-model="paymentPlanForm.planDate"
            type="date"
            placeholder="请选择计划付款日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="付款条件" prop="condition">
          <el-input
            v-model="paymentPlanForm.condition"
            type="textarea"
            placeholder="请输入付款条件"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paymentPlanDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPaymentPlan">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.contract-payment-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.contract-list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-plans-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 20px;
}

.add-plan-button {
  margin-top: 20px;
  text-align: center;
}

.text-center {
  text-align: center;
}

.dialog-footer {
  text-align: right;
}
</style>