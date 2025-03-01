<script setup>
import { ref, onMounted } from 'vue'
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
  Warning
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

const menuItems = ref([
  {
    title: '配置向导',
    desc: '系统功能配置与初始化',
    icon: Guide,
    path: '',
    color: '#9C27B0',
    onClick: openSetupWizard
  },
  {
    title: '费用申请',
    desc: '创建新的费用申请单',
    icon: Document,
    path: '/expense-application',
    color: '#409EFF'
  },
  {
    title: '费用审批',
    desc: '审批待处理的费用申请',
    icon: Check,
    path: '/expense-approval',
    color: '#67C23A'
  },
  {
    title: '报销管理',
    desc: '管理报销单据和流程',
    icon: Tickets,
    path: '/reimbursement',
    color: '#E6A23C'
  },
  {
    title: '预算管理',
    desc: '设置和监控部门预算',
    icon: Money,
    path: '/budget-management',
    color: '#F56C6C'
  },
  {
    title: '费用统计',
    desc: '查看费用统计报表',
    icon: TrendCharts,
    path: '/expense-statistics',
    color: '#909399'
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
  },
  {
    title: '合同付款',
    desc: '管理合同付款计划',
    icon: Document,
    path: '/contract-payment',
    color: '#607D8B'
  }
])

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="home-container">
    <el-row class="mb-4">
      <el-col :span="24" class="header-actions">
        <h1 class="welcome-title">欢迎使用企业费控系统</h1>
        <p class="welcome-subtitle">高效管理企业费用，助力业务发展</p>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col v-for="item in menuItems" :key="item.path || item.title" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="menu-card" shadow="hover" @click="item.onClick ? item.onClick() : navigateTo(item.path)">
          <div class="card-content">
            <el-icon :style="{ color: item.color }" :size="40">
              <component :is="item.icon" />
            </el-icon>
            <div class="card-text">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
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
  max-width: 1200px;
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

.menu-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.card-text {
  margin-left: 15px;
}

.card-text h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #303133;
}

.card-text p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.mb-4 {
  margin-bottom: 24px;
}

.header-actions {
  position: relative;
}

.setup-wizard-btn {
  position: absolute;
  right: 0;
  top: 0;
}
</style>