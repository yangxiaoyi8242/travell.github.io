<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 费用类型选项
const expenseTypes = [
  { value: 'travel', label: '差旅费' },
  { value: 'office', label: '办公用品' },
  { value: 'entertainment', label: '业务招待费' },
  { value: 'training', label: '培训费' },
  { value: 'other', label: '其他费用' }
]

// 部门选项
const departments = [
  { value: 'sales', label: '销售部' },
  { value: 'marketing', label: '市场部' },
  { value: 'rd', label: '研发部' },
  { value: 'finance', label: '财务部' },
  { value: 'hr', label: '人力资源部' },
  { value: 'admin', label: '行政部' }
]

// 表单数据
const formData = reactive({
  applicantName: '',
  department: '',
  expenseType: '',
  amount: '',
  purpose: '',
  startDate: '',
  endDate: '',
  attachments: [],
  remark: ''
})

// 表单验证规则
const rules = {
  applicantName: [{ required: true, message: '请输入申请人姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  expenseType: [{ required: true, message: '请选择费用类型', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入费用金额', trigger: 'blur' },
    { type: 'number', message: '金额必须为数字', trigger: 'blur', transform: value => Number(value) }
  ],
  purpose: [{ required: true, message: '请输入费用用途', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }]
}

const formRef = ref(null)
const loading = ref(false)

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
          message: '费用申请提交成功！',
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
    formData.attachments = []
  }
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
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过 10MB!')
    return false
  }
  return true
}
</script>

<template>
  <div class="expense-application-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h2>费用申请表</h2>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        require-asterisk-position="right"
        scroll-to-error
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
                  v-for="item in departments"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="费用类型" prop="expenseType">
              <el-select v-model="formData.expenseType" placeholder="请选择费用类型" style="width: 100%">
                <el-option
                  v-for="item in expenseTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="费用金额 (元)" prop="amount">
              <el-input-number
                v-model="formData.amount"
                :precision="2"
                :step="100"
                :min="0"
                style="width: 100%"
                placeholder="请输入费用金额"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="费用用途" prop="purpose">
          <el-input v-model="formData.purpose" placeholder="请简要描述费用用途" />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="选择开始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                placeholder="选择结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
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
          <el-button type="primary" @click="submitForm" :loading="loading">提交申请</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.expense-application-container {
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

.form-buttons {
  margin-top: 20px;
  text-align: center;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>