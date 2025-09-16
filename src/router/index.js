import {createRouter,createWebHistory} from "vue-router"
import Loginpage from "../views/LoginPage.vue"
import ProductPage from "../views/ProductPage.vue"
import AdminLayout from "../layouts/AdminLayout.vue"
import { useAuthStore } from '../stores/index.js'
import { isTokenExpired } from '../utils/token'
import UserPage from "../views/UserPage.vue"
const routes=[
    {path:"/login",component:Loginpage},
   
    {path:"/",
    component:AdminLayout,
    meta: { requiresAuth : true},
    children:[
        {path:"products",component:ProductPage,meta: { requiresAuth: true }},//需登入驗證
        {path:"admin",component:UserPage,meta:{requiresAuth:true}}//需登入驗證
      ]}
]

const router=createRouter({
    history:createWebHistory(), //history模式。vite內建 fallback 功能，回傳index.html
    routes
})

router.beforeEach((to, from, next) => {//全域前置守衛
  const authStore = useAuthStore()
  let token = authStore.token//讓token能夠重新賦值

   // 自動載入 localStorage 的 token
  if (!token) {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      authStore.setToken(savedToken)
      token = savedToken
    }
  }
  if (to.path === '/login') {
    // 如果已經登入且 token 還有效，從登入頁自動導到主頁或產品頁
    if (token && !isTokenExpired(token)) {
      next('/products')  // 或你想跳的頁面
      return
    }
    next()
    return
  }
 
  if (to.meta.requiresAuth) { // 如果路由需要登錄並且用戶未登錄，則重定向到登入頁
    if (!token || isTokenExpired(token)) { //沒登錄或是token過期
      authStore.clearToken() // 可選：清掉過期 token
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

