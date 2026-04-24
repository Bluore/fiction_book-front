<template>
  <div class="login-page">
    <Header />
    <div class="login-container">
      <div class="auth-card-wrapper" :class="{ 'is-register': isRegister }">
        <!-- 登录面 -->
        <div class="auth-card-front">
          <h2 class="auth-title">登 录</h2>
          <div class="auth-form">
            <div class="form-item">
              <label class="form-label">用户名</label>
              <n-input v-model:value="loginForm.username" placeholder="请输入用户名" size="large" />
            </div>
            <div class="form-item">
              <label class="form-label">密码</label>
              <n-input
                v-model:value="loginForm.password"
                type="password"
                show-password-on="click"
                placeholder="请输入密码"
                size="large"
              />
            </div>
            <div class="auth-actions">
              <n-button type="primary" size="large" block @click="handleLogin">
                进入书斋
              </n-button>
              <p class="switch-tip">
                尚无账号？
                <span class="switch-link" @click="isRegister = true">立即注册</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 注册面 -->
        <div class="auth-card-back">
          <h2 class="auth-title">注 册</h2>
          <div class="auth-form">
            <div class="form-item">
              <label class="form-label">用户名</label>
              <n-input v-model:value="registerForm.username" placeholder="建议使用雅号" size="large" />
            </div>
            <div class="form-item">
              <label class="form-label">电子邮驿</label>
              <n-input v-model:value="registerForm.email" placeholder="email@example.com" size="large" />
            </div>
            <div class="form-item">
              <label class="form-label">邮驿验证</label>
              <div class="email-verify-group">
                <n-input v-model:value="registerForm.verifyCode" placeholder="验证码" size="large" />
                <n-button ghost @click="sendVerifyCode">获取</n-button>
              </div>
            </div>
            <div class="form-item">
              <label class="form-label">设置密码</label>
              <n-input
                v-model:value="registerForm.password"
                type="password"
                show-password-on="click"
                placeholder="请设置密码"
                size="large"
              />
            </div>
            <div class="form-item">
              <label class="form-label">确认密码</label>
              <n-input
                v-model:value="registerForm.passwordRepeat"
                type="password"
                show-password-on="click"
                placeholder="请再次输入密码"
                size="large"
              />
            </div>
            <div class="auth-actions">
              <n-button type="primary" size="large" block @click="handleRegister">
                完成注册
              </n-button>
              <p class="switch-tip">
                已有账号？
                <span class="switch-link" @click="isRegister = false">返回登录</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/utils/auth'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import './Login.css'

const router = useRouter()
const isRegister = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  email: '',
  verifyCode: '',
  password: '',
  passwordRepeat: ''
})

const handleLogin = () => {
  console.log('Login:', loginForm)
  // 模拟登录成功
  login()
  router.push('/')
}

const handleRegister = () => {
  if (registerForm.password !== registerForm.passwordRepeat) {
    alert('两次输入的密码不一致')
    return
  }
  console.log('Register:', registerForm)
  // TODO: 实现注册逻辑
}

const sendVerifyCode = () => {
  console.log('Send verify code to:', registerForm.email)
  // TODO: 实现发送验证码逻辑
}
</script>
