<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Setting,
  User,
  Lock,
  Management
} from '@element-plus/icons-vue'

const router = useRouter()

const menuItems = ref([
  {
    title: '人员管理',
    icon: User,
    path: '/system-config/user-management'
  },
  {
    title: '角色权限',
    icon: Lock,
    path: '/system-config/role-permission'
  },
  {
    title: '部门管理',
    icon: Management,
    path: '/system-config/department-management'
  }
])

const handleMenuClick = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="system-config-container">
    <el-row :gutter="20">
      <el-col :span="8" v-for="item in menuItems" :key="item.path">
        <el-card class="menu-card" shadow="hover" @click="handleMenuClick(item.path)">
          <div class="card-content">
            <el-icon :size="40" :color="'#409EFF'">
              <component :is="item.icon" />
            </el-icon>
            <div class="card-text">
              <h3>{{ item.title }}</h3>
              <p>管理{{ item.title }}相关配置</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.system-config-container {
  padding: 20px;
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
  padding: 20px;
}

.card-text {
  margin-left: 20px;
}

.card-text h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #303133;
}

.card-text p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}
</style>