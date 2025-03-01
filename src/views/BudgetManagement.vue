<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟部门预算数据
const departmentBudgets = ref([
  {
    id: 1,
    department: '销售部',
    yearlyBudget: 500000,
    usedAmount: 320000,
    remainingAmount: 180000,
    usageRate: 64,
    lastUpdateTime: '2023-06-15 10:30:45'
  },
  {
    id: 2,
    department: '市场部',
    yearlyBudget: 300000,
    usedAmount: 210000,
    remainingAmount: 90000,
    usageRate: 70,
    lastUpdateTime: '2023-06-14 16:20:33'
  },
  {
    id: 3,
    department: '研发部',
    yearlyBudget: 800000,
    usedAmount: 450000,
    remainingAmount: 350000,
    usageRate: 56.25,
    lastUpdateTime: '2023-06-16 09:15:27'
  },
  {
    id: 4,
    department: '财务部',
    yearlyBudget: 150000,
    usedAmount: 80000,
    remainingAmount: 70000,
    usageRate: 53.33,
    lastUpdateTime: '2023-06-13 14:45:12'
  },
  {
    id: 5,
    department: '人力资源部',
    yearlyBudget: 200000,
    usedAmount: 120000,
    remainingAmount: 80000,
    usageRate: 60,
    lastUpdateTime: '2023-06-12 11:30:45'
  },
  {
    id: 6,
    department: '行政部',
    yearlyBudget: 250000,
    usedAmount: 180000,
    remainingAmount: 70000,
    usageRate: 72,
    lastUpdateTime: '2023-06-11 15:20:33'
  }
])

// 表格加载状态
const tableLoading = ref(false)

// 当前选中的部门预算
const currentBudget = ref(null)

// 编辑对话框可见性
const editDialogVisible = ref(false)

// 编辑表单
const editForm = reactive({
  id: '',
  department: '',
  yearlyBudget: 0
})

// 编辑表单规则
const editRules = {
  yearlyBudget: [
    { required: true, message: '请输入年度预算金额', trigger: 'blur' },
    { type: 'number', message: '金额必须为数字', trigger: 'blur', transform: value => Number(value) },
    { type: 'number', min: 0, message: '金额不能小于0', trigger: 'blur', transform: value => Number(value) }
  ]
}

const editFormRef = ref(null)

// 编辑预算
const editBudget = (row) => {
  currentBudget.value = row
  editDialogVisible.value = true
  
  // 设置表单初始值
  editForm.id = row.id
  editForm.department = row.department
  editForm.yearlyBudget = row.yearlyBudget
}

// 提交编辑
const submitEdit = async () => {
  if (!editFormRef.value) return
  
  await editFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 模拟提交编辑结果
      const loading = ElMessage({
        message: '正在更新预算...',
        type: 'info',
        duration: 0
      })
      
      setTimeout(() => {
        loading.close()
        
        // 更新预算数据
        const index = departmentBudgets.value.findIndex(item => item.id === editForm.id)
        if (index !== -1) {
          // 计算剩余金额和使用率
          const usedAmount = departmentBudgets.value[index].usedAmount
          const newYearlyBudget = editForm.yearlyBudget
          const newRemainingAmount = newYearlyBudget - usedAmount
          const newUsageRate = (usedAmount / newYearlyBudget * 100).toFixed(2)
          
          // 更新数据
          departmentBudgets.value[index].yearlyBudget = newYearlyBudget
          departmentBudgets.value[index].remainingAmount = newRemainingAmount
          departmentBudgets.value[index].usageRate = parseFloat(newUsageRate)
          departmentBudgets.value[index].lastUpdateTime = new Date().toLocaleString()
        }
        
        ElMessage({
          message: '预算更新成功！',
          type: 'success'
        })
        
        editDialogVisible.value = false
      }, 1000)
    }
  })
}

// 获取使用率进度条类型
const getProgressType = (rate) => {
  if (rate < 50) return 'success'
  if (rate < 80) return 'warning'
  return 'danger'
}

// 格式化金额
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })
    .replace('CN¥', '¥')
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
  <div class="budget-management-container">
    <el-card class="budget-card">
      <template #header>
        <div class="card-header">
          <h2>预算管理</h2>
          <el-button type="primary" size="small">
            <el-icon><Plus /></el-icon>新增部门预算
          </el-button>
        </div>
      </template>
      
      <el-table
        :data="departmentBudgets"
        style="width: 100%"
        border
        v-loading="tableLoading"
        row-key="id"
      >
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="yearlyBudget" label="年度预算" width="150">
          <template #default="scope">
            {{ formatAmount(scope.row.yearlyBudget) }}
          </template>
        </el-table-column>
        <el-table-column prop="usedAmount" label="已使用" width="150">
          <template #default="scope">
            {{ formatAmount(scope.row.usedAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="remainingAmount" label="剩余预算" width="150">
          <template #default="scope">
            {{ formatAmount(scope.row.remainingAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="usageRate" label="使用率" min-width="200">
          <template #default="scope">
            <el-progress 
              :percentage="scope.row.usageRate" 
              :type="'line'" 
              :stroke-width="15"
              :status="getProgressType(scope.row.usageRate)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdateTime" label="最后更新时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="editBudget(scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑部门预算"
      width="500px"
      destroy-on-close
    >
      <div v-if="currentBudget" class="edit-form">
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editRules"
          label-width="100px"
        >
          <el-form-item label="部门">
            <el-input v-model="editForm.department" disabled />
          </el-form-item>
          
          <el-form-item label="年度预算" prop="yearlyBudget">
            <el-input-number
              v-model="editForm.yearlyBudget"
              :precision="2"
              :step="10000"
              :min="0"
              style="width: 100%"
              placeholder="请输入年度预算金额"
            />
          </el-form-item>
          
          <el-alert
            v-if="currentBudget.usedAmount > editForm.yearlyBudget"
            title="警告：设置的预算金额小于已使用金额！"
            type="error"
            :closable="false"
            style="margin-top: 15px"
          />
        </el-form>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.budget-management-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.budget-card {
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

.edit-form {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>