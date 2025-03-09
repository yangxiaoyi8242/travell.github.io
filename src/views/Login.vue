<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { supabase } from '../api/supabase'

const router = useRouter()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单数据
const registerForm = reactive({
  email: '',
  password: ''
})

// 是否显示注册表单
const showRegister = ref(false)

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
  ]
}

// 注册表单验证规则
const registerRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
  ]
}

// 表单引用
const loginFormRef = ref(null)
const registerFormRef = ref(null)

// 登录加载状态
const loading = ref(false)

// 记住密码
const rememberMe = ref(false)

// 切换到注册表单
const toggleRegister = () => {
  showRegister.value = !showRegister.value
}

// 注册方法
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    const { data, error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password
    })
    
    if (error) throw error
    
    ElMessage.success('注册邮件已发送，请查收邮箱完成验证')
    showRegister.value = false
  } catch (error) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

// 登录方法
const handleLogin = () => {
  if (!loginFormRef.value) return
  
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      
      // 模拟登录请求
      setTimeout(() => {
        if (loginForm.username === 'admin' && loginForm.password === '123456') {
          // 登录成功，存储登录状态
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('user', JSON.stringify({
            username: loginForm.username,
            role: 'admin'
          }))
          
          ElMessage.success('登录成功')
          // 路由跳转
          router.push('/')
        } else {
          ElMessage.error('用户名或密码错误')
        }
        loading.value = false
      }, 1000)
    }
  }).catch(error => {
    console.error('登录验证出错:', error)
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>企业费控系统</h2>
        <p>高效管理企业费用，助力业务发展</p>
      </div>
      
      <el-form
        v-if="!showRegister"
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
        <el-form-item prop="username" label="用户名">
          <el-input 
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password" label="密码">
          <el-input 
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <div class="form-options">
          <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          <el-link type="primary">忘记密码？</el-link>
        </div>
        
        <el-button
          type="primary"
          class="login-button"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>

        <div class="form-footer">
          <span>还没有账号？</span>
          <el-link type="primary" @click="toggleRegister">立即注册</el-link>
        </div>
      </el-form>

      <el-form
        v-else
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        class="login-form"
      >
        <el-form-item prop="email" label="邮箱">
          <el-input 
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            prefix-icon="Message"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password" label="密码">
          <el-input 
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-button
          type="primary"
          class="login-button"
          :loading="loading"
          @click="handleRegister"
        >
          注册
        </el-button>

        <div class="form-footer">
          <span>已有账号？</span>
          <el-link type="primary" @click="toggleRegister">返回登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
}

.login-header p {
  margin: 10px 0 0;
  color: #909399;
  font-size: 14px;
}

.login-form {
  margin-top: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  padding: 12px 20px;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

.form-footer span {
  margin-right: 8px;
  color: #909399;
}
</style>