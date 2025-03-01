<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'finish'])

// 当前步骤
const activeStep = ref(0)

// 问卷调查数据
const surveyData = reactive({
  companySize: '',
  industry: '',
  travelFrequency: '',
  expenseTypes: [],
  approvalLevels: ''
})

// 模块选择数据
const moduleSelection = reactive({
  basic: true,
  budget: false,
  ledger: false,
  order: false
})

// 模板配置数据
const templateConfig = reactive({
  roles: [],
  documents: [],
  approvalFlow: '',
  reimbursementFlow: ''
})

// 准备工作清单状态
const worklistStatus = reactive({
  basic: {
    organization: false,
    users: false,
    roles: false,
    documents: false,
    workflow: false,
    standards: false,
    riskControl: false
  },
  budget: {
    rules: false
  },
  ledger: {
    accounting: false,
    voucher: false
  },
  order: {
    serviceProvider: false
  }
})

// 问卷选项
const surveyOptions = {
  companySizes: ['50人以下', '50-200人', '200-500人', '500-1000人', '1000人以上'],
  industries: ['互联网', '制造业', '金融业', '教育', '医疗', '其他'],
  travelFrequencies: ['频繁', '一般', '较少'],
  expenseTypesList: ['差旅费', '招待费', '办公用品', '培训费', '其他'],
  approvalLevelsList: ['一级审批', '两级审批', '三级审批', '四级审批']
}

// 模板选项
const templateOptions = {
  roles: ['员工', '部门主管', '财务人员', '部门总经理', '财务主管', '项目经理', '行政人员', '商旅系统管理员'],
  documents: ['出差申请/报销单', '借款单', '招待费报销单', '费用报销单', '合同付款单'],
  approvalFlows: [
    { label: '一录一审（员工-部门主管）', value: 'flow1-1' },
    { label: '一录两审（员工-部门主管-部门总经理）', value: 'flow1-2' },
    { label: '一录三审（员工-项目经理-部门主管-部门总经理）', value: 'flow1-3' },
    { label: '一录四审（员工-项目经理-部门主管-部门总经理-行政人员）', value: 'flow1-4' }
  ],
  reimbursementFlows: [
    { label: '一录一审（员工-财务人员）', value: 'flow2-1' },
    { label: '一录两审（员工-部门主管-财务人员）', value: 'flow2-2' },
    { label: '一录三审（员工-部门主管-部门总经理-财务人员）', value: 'flow2-3' },
    { label: '一录四审（员工-项目经理-部门主管-部门总经理-财务人员）', value: 'flow2-4' }
  ]
}

// 步骤标题
const steps = [
  { title: '问卷调查', description: '了解企业偏好' },
  { title: '配置模块', description: '选择所需功能模块' },
  { title: '配置模板', description: '设置模块参数' },
  { title: '准备工作清单', description: '完成必要配置' },
  { title: '统一视图', description: '确认配置信息' }
]

// 验证当前步骤
const validateStep = (step) => {
  switch (step) {
    case 0: // 问卷调查可以跳过
      return true
    case 1:
      return moduleSelection.basic // 基础模块必选
    case 2:
      return templateConfig.roles.length > 0 && templateConfig.documents.length > 0
    case 3:
      return checkWorklist()
    case 4:
      return true
    default:
      return false
  }
}

// 检查工作清单完成状态
const checkWorklist = () => {
  // 基础模块必选项检查
  const basicRequired = Object.values(worklistStatus.basic).every(status => status)
  if (!basicRequired) return false

  // 其他模块根据选择情况检查
  if (moduleSelection.budget && !worklistStatus.budget.rules) return false
  if (moduleSelection.ledger && !Object.values(worklistStatus.ledger).every(status => status)) return false
  if (moduleSelection.order && !worklistStatus.order.serviceProvider) return false

  return true
}

// 下一步
const nextStep = () => {
  if (validateStep(activeStep.value)) {
    if (activeStep.value < steps.length - 1) {
      activeStep.value++
    } else {
      finishSetup()
    }
  } else {
    ElMessage.warning('请完成当前步骤的必要配置')
  }
}

// 上一步
const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// 完成设置
const finishSetup = () => {
  const config = {
    survey: surveyData,
    modules: moduleSelection,
    template: templateConfig,
    worklist: worklistStatus
  }
  
  // 保存配置
  localStorage.setItem('setupConfig', JSON.stringify(config))
  localStorage.setItem('setupCompleted', 'true')
  
  emit('finish', config)
  emit('update:visible', false)
  
  ElMessage.success('配置向导完成')
}

// 关闭向导
const closeWizard = () => {
  emit('update:visible', false)
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    @close="closeWizard"
    title="企业费控系统配置向导"
    width="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
  >
    <el-steps :active="activeStep" finish-status="success" align-center>
      <el-step
        v-for="(step, index) in steps"
        :key="index"
        :title="step.title"
        :description="step.description"
      />
    </el-steps>

    <div class="step-content">
      <!-- 问卷调查 -->
      <div v-if="activeStep === 0" class="survey-form">
        <el-form :model="surveyData" label-width="120px">
          <el-form-item label="企业规模">
            <el-select v-model="surveyData.companySize" placeholder="请选择企业规模">
              <el-option
                v-for="size in surveyOptions.companySizes"
                :key="size"
                :label="size"
                :value="size"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="所属行业">
            <el-select v-model="surveyData.industry" placeholder="请选择所属行业">
              <el-option
                v-for="industry in surveyOptions.industries"
                :key="industry"
                :label="industry"
                :value="industry"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="差旅频率">
            <el-select v-model="surveyData.travelFrequency" placeholder="请选择差旅频率">
              <el-option
                v-for="freq in surveyOptions.travelFrequencies"
                :key="freq"
                :label="freq"
                :value="freq"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="常用费用类型">
            <el-checkbox-group v-model="surveyData.expenseTypes">
              <el-checkbox
                v-for="type in surveyOptions.expenseTypesList"
                :key="type"
                :label="type"
              />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="期望审批层级">
            <el-radio-group v-model="surveyData.approvalLevels">
              <el-radio
                v-for="level in surveyOptions.approvalLevelsList"
                :key="level"
                :label="level"
              />
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <!-- 配置模块 -->
      <div v-if="activeStep === 1" class="module-selection">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>请选择需要的功能模块</span>
            </div>
          </template>
          
          <el-checkbox v-model="moduleSelection.basic" disabled>基础模块（必选）</el-checkbox>
          <el-checkbox v-model="moduleSelection.budget">预算模块</el-checkbox>
          <el-checkbox v-model="moduleSelection.ledger">总账模块</el-checkbox>
          <el-checkbox v-model="moduleSelection.order">订单模块</el-checkbox>
        </el-card>
      </div>

      <!-- 配置模板 -->
      <div v-if="activeStep === 2" class="template-config">
        <el-form :model="templateConfig" label-width="120px">
          <el-form-item label="角色选择" required>
            <el-checkbox-group v-model="templateConfig.roles">
              <el-checkbox
                v-for="role in templateOptions.roles"
                :key="role"
                :label="role"
              />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="单据模板" required>
            <el-checkbox-group v-model="templateConfig.documents">
              <el-checkbox
                v-for="doc in templateOptions.documents"
                :key="doc"
                :label="doc"
              />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="申请单审批流程">
            <el-select v-model="templateConfig.approvalFlow" placeholder="请选择审批流程">
              <el-option
                v-for="flow in templateOptions.approvalFlows"
                :key="flow.value"
                :label="flow.label"
                :value="flow.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="报销单审批流程">
            <el-select v-model="templateConfig.reimbursementFlow" placeholder="请选择审批流程">
              <el-option
                v-for="flow in templateOptions.reimbursementFlows"
                :key="flow.value"
                :label="flow.label"
                :value="flow.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 准备工作清单 -->
      <div v-if="activeStep === 3" class="worklist">
        <el-card class="mb-4">
          <template #header>
            <div class="card-header">
              <span>基础模块配置</span>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="(status, key) in worklistStatus.basic" :key="key">
              <template #label>
                {{ {
                  organization: '设置企业组织架构',
                  users: '维护开薪易用户信息',
                  roles: '企业商旅角色设置与导入',
                  documents: '设置出差申请单和报销单据模板',
                  workflow: '设置单据审批流程',
                  standards: '设置费用标准管控流程',
                  riskControl: '设置单据提交时检查事项'
                }[key] }}
              </template>
              <el-switch v-model="worklistStatus.basic[key]" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card v-if="moduleSelection.budget" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>预算模块配置</span>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item>
              <template #label>设置预算初始化规则</template>
              <el-switch v-model="worklistStatus.budget.rules" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card v-if="moduleSelection.ledger" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>总账模块配置</span>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="(status, key) in worklistStatus.ledger" :key="key">
              <template #label>
                {{ {
                  accounting: '引导企业跳转开薪易财务记账首页',
                  voucher: '内置凭证模板配置'
                }[key] }}
              </template>
              <el-switch v-model="worklistStatus.ledger[key]" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card v-if="moduleSelection.order" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>订单模块配置</span>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item>
              <template #label>签约企业服务商</template>
              <el-switch v-model="worklistStatus.order.serviceProvider" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>

      <!-- 统一视图 -->
      <div v-if="activeStep === 4" class="unified-view">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>配置信息总览</span>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item label="问卷调查信息">
              <div>企业规模：{{ surveyData.companySize || '未填写' }}</div>
              <div>所属行业：{{ surveyData.industry || '未填写' }}</div>
              <div>差旅频率：{{ surveyData.travelFrequency || '未填写' }}</div>
              <div>常用费用类型：{{ surveyData.expenseTypes.join('、') || '未选择' }}</div>
              <div>期望审批层级：{{ surveyData.approvalLevels || '未选择' }}</div>
            </el-descriptions-item>

            <el-descriptions-item label="已选择模块">
              <el-tag v-if="moduleSelection.basic" class="mr-2">基础模块</el-tag>
              <el-tag v-if="moduleSelection.budget" type="success" class="mr-2">预算模块</el-tag>
              <el-tag v-if="moduleSelection.ledger" type="warning" class="mr-2">总账模块</el-tag>
              <el-tag v-if="moduleSelection.order" type="danger">订单模块</el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="模板配置">
              <div>已选角色：{{ templateConfig.roles.join('、') || '未选择' }}</div>
              <div>已选单据：{{ templateConfig.documents.join('、') || '未选择' }}</div>
              <div>申请单审批流程：{{ templateConfig.approvalFlow ? templateOptions.approvalFlows.find(f => f.value === templateConfig.approvalFlow)?.label : '未选择' }}</div>
              <div>报销单审批流程：{{ templateConfig.reimbursementFlow ? templateOptions.reimbursementFlows.find(f => f.value === templateConfig.reimbursementFlow)?.label : '未选择' }}</div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="prevStep" :disabled="activeStep === 0">上一步</el-button>
        <el-button type="primary" @click="nextStep">
          {{ activeStep === steps.length - 1 ? '完成' : '下一步' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.step-content {
  margin-top: 20px;
  min-height: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-4 {
  margin-bottom: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.dialog-footer {
  text-align: right;
}

.el-checkbox {
  margin-right: 20px;
  margin-bottom: 10px;
}

.el-radio {
  margin-bottom: 10px;
}
</style>