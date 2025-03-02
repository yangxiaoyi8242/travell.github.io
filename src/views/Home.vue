<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SetupWizard from '../components/SetupWizard.vue'
import {
  Document,
  Tickets,
  Money,
  TrendCharts,
  Setting,
  Check,
  Guide,
  Connection,
  Warning,
  ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter()

// 配置向导相关
const setupWizardVisible = ref(false)
const isFirstVisit = ref(false)

// 检查是否首次访问
onMounted(() => {
  const setupCompleted = localStorage.getItem('setupCompleted')
  if (!setupCompleted) {
    isFirstVisit.value = true
    setupWizardVisible.value = true
  }
  
  // 添加事件监听器，用于从导航菜单打开配置向导
  window.addEventListener('open-setup-wizard', () => {
    setupWizardVisible.value = true
  })
})

// 处理配置向导完成
const handleSetupFinish = (config) => {
  console.log('配置完成:', config)
  // 这里可以添加其他处理逻辑
}

// 打开配置向导
const openSetupWizard = () => {
  setupWizardVisible.value = true
}

// 流程步骤定义
const processSteps = ref([
  {
    title: '系统配置',
    icon: Guide,
    color: '#9C27B0',
    onClick: openSetupWizard,
    hasSubModules: true,
    expanded: true,
    subModules: [
      {
        title: '预算管理',
        desc: '设置和监控部门预算',
        icon: Money,
        path: '/budget-management',
        color: '#F56C6C'
      },
      {
        title: '单据管理',
        desc: '管理系统单据模板',
        icon: Document,
        path: '/document-management',
        color: '#3F51B5'
      },
      {
        title: '流程管理',
        desc: '配置审批流程和节点',
        icon: Connection,
        path: '/workflow-management',
        color: '#00BCD4'
      },
      {
        title: '差标管理',
        desc: '管理差旅标准和补贴',
        icon: Setting,
        path: '/difference-standard-management',
        color: '#795548'
      },
      {
        title: '风险控制',
        desc: '管理风险控制规则',
        icon: Warning,
        path: '/risk-control-management',
        color: '#FF9800'
      }
    ]
  },
  {
    title: '费用申请',
    desc: '创建新的费用申请单',
    icon: Document,
    path: '/expense-application',
    color: '#409EFF',
    hasSubModules: false,
    subModules: []
  },
  {
    title: '申请审核',
    desc: '审批待处理的费用申请',
    icon: Check,
    path: '/expense-approval',
    color: '#67C23A',
    hasSubModules: false,
    subModules: []
  },
  {
    title: '提交报销',
    desc: '创建出差报销单据',
    icon: Tickets,
    path: '/travel-reimbursement',
    color: '#FF9800',
    hasSubModules: false,
    subModules: []
  },
  {
    title: '审核支付',
    desc: '管理报销单据和流程',
    icon: Tickets,
    path: '/reimbursement',
    color: '#E6A23C',
    hasSubModules: true,
    expanded: false,
    subModules: [
      {
        title: '报销审核',
        desc: '审核报销单据和支付',
        icon: Tickets,
        path: '/reimbursement',
        color: '#E6A23C'
      },
      {
        title: '付款合同',
        desc: '管理合同付款和计划',
        icon: Document,
        path: '/contract-payment',
        color: '#FF9800'
      }
    ]
  },
  {
    title: '费用统计',
    desc: '查看费用统计报表',
    icon: TrendCharts,
    path: '/expense-statistics',
    color: '#909399',
    hasSubModules: false,
    subModules: []
  }
])

const navigateTo = (path) => {
  router.push(path)
}

// 切换子模块显示状态
const toggleSubModules = (index) => {
  if (processSteps.value[index].hasSubModules) {
    processSteps.value[index].expanded = !processSteps.value[index].expanded
  }
}

// 计算哪些模块应该显示子模块
const visibleSubModules = computed(() => {
  return processSteps.value.filter(step => step.hasSubModules && step.expanded)
})
</script>

<template>
  <div class="home-container">
    <el-row class="mb-4">
      <el-col :span="24" class="header-actions">
        <h1 class="welcome-title">欢迎使用企业费控系统</h1>
        <p class="welcome-subtitle">高效管理企业费用，助力业务发展</p>
      </el-col>
    </el-row>

    <div class="process-flow">
      <!-- 主流程步骤 -->
      <div class="process-steps">
        <div v-for="(step, index) in processSteps" :key="index" class="process-step"
          :class="{ 'has-sub-modules': step.hasSubModules, 'expanded': step.expanded }"
          @click="step.onClick ? step.onClick() : navigateTo(step.path)">
          <div class="step-content" :style="{ borderColor: step.color }">
            <el-icon :style="{ color: step.color }" :size="32">
              <component :is="step.icon" />
            </el-icon>
            <h3>{{ step.title }}</h3>
            <p v-if="step.desc">{{ step.desc }}</p>
            <div v-if="step.hasSubModules" class="sub-module-indicator" @click.stop="toggleSubModules(index)">
              <el-icon :style="{ color: step.color }" :class="{ 'rotated': step.expanded }">
                <arrow-down />
              </el-icon>
            </div>
          </div>
          <!-- 连接线 -->
          <div v-if="index < processSteps.length - 1" class="step-connector"
            :style="{ backgroundColor: processSteps[index + 1].color }">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>

      <!-- 子模块区域 -->
      <div v-for="(step, stepIndex) in visibleSubModules" :key="'sub-' + stepIndex" class="sub-modules-container">
        <div class="sub-modules-header" :style="{ borderColor: step.color }">
          <div class="vertical-connector" :style="{ backgroundColor: step.color }"></div>
          <h3>{{ step.title }}子模块</h3>
        </div>
        <div class="sub-modules">
          <div v-for="subModule in step.subModules" :key="subModule.path"
            class="sub-module" @click="navigateTo(subModule.path)" 
            :style="{ borderColor: subModule.color }">
            <el-icon :style="{ color: subModule.color }" :size="24">
              <component :is="subModule.icon" />
            </el-icon>
            <div class="sub-module-text">
              <h4>{{ subModule.title }}</h4>
              <p>{{ subModule.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 配置向导组件 -->
    <SetupWizard 
      v-model:visible="setupWizardVisible" 
      @finish="handleSetupFinish"
    />
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 10px;
  text-align: center;
}

.welcome-subtitle {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
  text-align: center;
}

.process-flow {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  position: relative;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.process-step {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  flex: 1;
  transition: all 0.3s ease;
}

.step-content {
  background: #fff;
  border: 2px solid;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
  width: 100%;
  position: relative;
}

.step-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.step-content h3 {
  margin: 10px 0;
  color: #303133;
}

.step-content p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.step-connector {
  height: 2px;
  flex-grow: 1;
  margin: 0 10px;
  position: relative;
}

.step-connector i {
  position: absolute;
  right: -6px;
  top: -6px;
  color: inherit;
}

.sub-modules-container {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

.sub-modules-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-left: 20px;
  border-left: 3px solid;
}

.vertical-connector {
  position: absolute;
  top: -30px;
  left: 20px;
  width: 3px;
  height: 30px;
}

.sub-modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 10px;
  padding-left: 40px;
}

.sub-module {
  background: #fff;
  border-radius: 8px;
  border: 1px solid;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sub-module:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sub-module-text {
  flex: 1;
}

.sub-module-text h4 {
  margin: 0 0 5px;
  color: #303133;
}

.sub-module-text p {
  margin: 0;
  color: #606266;
  font-size: 12px;
}

.sub-module-indicator {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s ease;
}

.rotated {
  transform: rotate(180deg);
}

.has-sub-modules {
  z-index: 2;
}

.has-sub-modules .step-content {
  box-shadow: 0 0 0 4px rgba(156, 39, 176, 0.1);
}

.expanded .step-content {
  box-shadow: 0 0 0 4px rgba(156, 39, 176, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>