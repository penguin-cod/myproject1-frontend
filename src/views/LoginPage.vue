<template>
    <h1 style="margin-top: 0;margin-bottom: 50px;margin-left:50px;">登入系統</h1>
    <el-form :model="loginForm" label-width="80px" style="max-width: 300px; margin: 100px auto;">
      <el-form-item label="帳號">
        <el-input v-model="loginForm.username" />
      </el-form-item>
      <el-form-item label="密碼">
        <el-input v-model="loginForm.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toLogin">登入</el-button>
      </el-form-item>
    </el-form>
</template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { login } from "../api/userApi"
  import { ElMessage } from 'element-plus'
  import { useAuthStore } from '../stores/index' // 引入 Pinia store
  
  const router = useRouter()
  const loginForm = reactive({
    username: '',
    password: '',
  })
  const authStore = useAuthStore()//第一次使用pinia 初始化
  
  async function toLogin() {
    if (!loginForm.username && !loginForm.password) {
      ElMessage.error("請輸入帳號密碼")
      return
    }
    try{
      const res=await login(loginForm)
      if(res.data.success){    // 模擬登入成功
        const token=res.data.data.token //後端回傳token
        authStore.setToken(token)//存token
        ElMessage.success("登入成功")
        router.push("/products")//跳轉到商品頁
      }else{
        ElMessage.error(res.data.message)
      }
    }catch(err){
      ElMessage.error("登入失敗")
    }
  }
  </script>