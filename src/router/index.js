import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/expense-application',
    name: 'ExpenseApplication',
    component: () => import('../views/ExpenseApplication.vue'),
    meta: { title: '费用申请' }
  },
  {
    path: '/expense-approval',
    name: 'ExpenseApproval',
    component: () => import('../views/ExpenseApproval.vue'),
    meta: { title: '费用审批' }
  },
  {
    path: '/travel-reimbursement',
    name: 'TravelReimbursement',
    component: () => import('../views/TravelReimbursement.vue'),
    meta: { title: '出差报销' }
  },
  {
    path: '/reimbursement',
    name: 'Reimbursement',
    component: () => import('../views/Reimbursement.vue'),
    meta: { title: '报销管理' }
  },
  {
    path: '/budget-management',
    name: 'BudgetManagement',
    component: () => import('../views/BudgetManagement.vue'),
    meta: { title: '预算管理' }
  },
  {
    path: '/expense-statistics',
    name: 'ExpenseStatistics',
    component: () => import('../views/ExpenseStatistics.vue'),
    meta: { title: '费用统计' }
  },
  {
    path: '/document-management',
    name: 'DocumentManagement',
    component: () => import('../views/DocumentManagement.vue'),
    meta: { title: '单据管理' }
  },
  {
    path: '/workflow-management',
    name: 'WorkflowManagement',
    component: () => import('../views/WorkflowManagement.vue'),
    meta: { title: '流程管理' }
  },
  {
    path: '/difference-standard-management',
    name: 'DifferenceStandardManagement',
    component: () => import('../views/DifferenceStandardManagement.vue'),
    meta: { title: '差标管理' }
  },
  {
    path: '/risk-control-management',
    name: 'RiskControlManagement',
    component: () => import('../views/RiskControlManagement.vue'),
    meta: { title: '风险控制' }
  },
  {
    path: '/contract-payment',
    name: 'ContractPayment',
    component: () => import('../views/ContractPayment.vue'),
    meta: { title: '合同付款' }
  }
]

const router = createRouter({
  history: createWebHistory('/travell/'),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 企业费控系统` : '企业费控系统'
  
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  if (requiresAuth && !isLoggedIn) {
    // 如果需要认证但用户未登录，重定向到登录页
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    // 如果用户已登录但尝试访问登录页，重定向到首页
    next('/')
  } else {
    next()
  }
})

export default router