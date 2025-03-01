<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Document,
  Tickets,
  Money,
  TrendCharts,
  HomeFilled,
  Check,
  Guide,
  Connection,
  Warning,
  Expand,
  Fold
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)

const handleSelect = (key) => {
  router.push(key)
}

// 获取当前激活的菜单项
const getActiveMenu = () => {
  return route.path
}

// 打开配置向导
// 处理退出登录
const handleLogout = () => {
  // 清除登录状态和用户信息
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')
  
  // 重定向到登录页
  router.push('/login')
}

const openSetupWizard = () => {
  // 如果当前不在首页，先跳转到首页
  if (route.path !== '/') {
    router.push('/').then(() => {
      // 等待路由跳转完成后再触发事件
      window.dispatchEvent(new CustomEvent('open-setup-wizard'))
    })
  } else {
    // 如果已经在首页，直接触发事件
    window.dispatchEvent(new CustomEvent('open-setup-wizard'))
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="auto">
      <el-menu
        :default-active="getActiveMenu()"
        class="el-menu-vertical"
        :collapse="isCollapse"
        @select="handleSelect"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
        router
      >
        <div class="logo-container">
          <h1 v-if="!isCollapse" class="logo-text">企业费控系统</h1>
          <el-icon v-else class="logo-icon" :size="24" color="#fff"><Money /></el-icon>
        </div>
        
        <el-menu-item index="/setup" @click.stop.prevent="openSetupWizard">
          <el-icon><Guide /></el-icon>
          <template #title>配置向导</template>
        </el-menu-item>

        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        
        <el-menu-item index="/expense-application">
          <el-icon><Document /></el-icon>
          <template #title>费用申请</template>
        </el-menu-item>
        
        <el-menu-item index="/expense-approval">
          <el-icon><Check /></el-icon>
          <template #title>费用审批</template>
        </el-menu-item>
        
        <el-menu-item index="/reimbursement">
          <el-icon><Tickets /></el-icon>
          <template #title>报销管理</template>
        </el-menu-item>
        
        <el-menu-item index="/budget-management">
          <el-icon><Money /></el-icon>
          <template #title>预算管理</template>
        </el-menu-item>
        
        <el-menu-item index="/expense-statistics">
          <el-icon><TrendCharts /></el-icon>
          <template #title>费用统计</template>
        </el-menu-item>
        
        <el-menu-item index="/document-management">
          <el-icon><Document /></el-icon>
          <template #title>单据管理</template>
        </el-menu-item>
        
        <el-menu-item index="/workflow-management">
          <el-icon><Connection /></el-icon>
          <template #title>流程管理</template>
        </el-menu-item>
        
        <el-menu-item index="/difference-standard-management">
          <el-icon><Document /></el-icon>
          <template #title>差标管理</template>
        </el-menu-item>
        
        <el-menu-item index="/risk-control-management">
          <el-icon><Warning /></el-icon>
          <template #title>风险控制</template>
        </el-menu-item>
        
        <el-menu-item index="/contract-payment">
          <el-icon><Document /></el-icon>
          <template #title>合同付款</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-left">
          <el-icon 
            class="collapse-btn" 
            @click="isCollapse = !isCollapse"
            :size="20"
          >
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <h2 class="page-title">{{ route.meta.title || '企业费控系统' }}</h2>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span class="username">管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
      
      <el-footer>
        <div class="footer-content">
          © {{ new Date().getFullYear() }} 企业费控系统 - 提供高效的企业费用管理解决方案
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-aside {
  background-color: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 0 20px;
  overflow: hidden;
}

.logo-text {
  margin: 0;
  font-size: 18px;
  white-space: nowrap;
}

.logo-icon {
  margin: 0;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  cursor: pointer;
  margin-right: 15px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

.el-footer {
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
  text-align: center;
  padding: 15px 0;
  color: #909399;
  font-size: 14px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
</style>
