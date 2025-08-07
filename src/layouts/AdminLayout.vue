<template>
    <el-container style="height: 100vh">
      <el-aside width="200px" style="background-color: #f5f7fa">
        <el-menu :default-active="$route.path" router>
          <el-menu-item index="/products">商品管理</el-menu-item>
        </el-menu>
         <el-menu :default-active="$route.path" router>
          <el-menu-item v-if="authStore.role === 'admin'" index="/admin">使用者管理</el-menu-item>
        </el-menu>

      </el-aside>

  
      <el-container>
        <el-header style="display: flex; justify-content: space-between; background-color: #409EFF; color: white; text-align: center;">
          <div style="margin-left: 10px;">後台管理系統</div>
          <h4 style="margin-right: 10px;">歡迎, {{ authStore.username }}</h4>
          <el-button type="danger" @click="logout" style="margin-left: auto;">登出</el-button>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script setup>
    import { ElMessage } from 'element-plus'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '../stores/index'

    const router = useRouter()
    const authStore = useAuthStore()

    // 登出功能
    function logout() {
      authStore.logout(); // 移除 token
      ElMessage.success('登出成功') // 顯示登出訊息
      router.push('/login') // 導回登入頁
    }
  </script>