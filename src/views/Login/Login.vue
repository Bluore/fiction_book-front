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
              <n-input v-model:value="registerForm.username" placeholder="请输入用户名" size="large" />
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
import { setToken, setUserInfo } from '@/utils/auth'
import { loginApi, registerApi, sendEmailVerifyApi, getUserInfoApi } from '@/api/auth'
import { useMessage } from 'naive-ui'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import './Login.css'

const router = useRouter()
const message = useMessage()
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

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    message.warning('请填写完整的登录信息')
    return
  }

  try {
    const res = await loginApi(loginForm)
    if (res.data.data.token) {
      setToken(res.data.data.token)
      
      // 登录成功后立即获取用户信息
      try {
        const userRes = await getUserInfoApi()
        if (userRes.data.code === 200 || userRes.data.code === 0) {
          setUserInfo(userRes.data.data)
        }
      } catch (infoErr) {
        console.error('获取用户信息失败:', infoErr)
      }

      message.success('登录成功，欢迎回来')
      router.push('/')
    }
  } catch (err: any) {
    message.error(err.message || '登录失败，请检查用户名或密码')
  }
}

const handleRegister = async () => {
  if (registerForm.password !== registerForm.passwordRepeat) {
    message.error('两次输入的密码不一致')
    return
  }

  if (!registerForm.username || !registerForm.email || !registerForm.verifyCode || !registerForm.password) {
    message.warning('请填写完整的注册信息')
    return
  }

  try {
    await registerApi({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      verify: registerForm.verifyCode
    })
    message.success('注册成功，请登录')
    isRegister.value = false
  } catch (err: any) {
    message.error(err.message || '注册失败')
  }
}

const sendVerifyCode = async () => {
  if (!registerForm.email) {
    message.warning('请先输入电子邮驿地址')
    return
  }

  try {
    await sendEmailVerifyApi(registerForm.email)
    message.success('验证码已发送至您的邮驿')
  } catch (err: any) {
    message.error(err.message || '发送验证码失败')
  }
}
</script>
