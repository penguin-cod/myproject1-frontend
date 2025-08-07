import {defineStore} from "pinia"
import { jwtDecode } from "jwt-decode"//npm install jwtDecode

export const useAuthStore = defineStore("auth",{
    state:()=>({ //第一次初始化會使用。箭頭函示回傳物件要用()框起來，這是箭頭函式的「隱式回傳」語法，只要你省略大括號 {}，就會自動 return () 裡面的值。
                 //刷新頁面pinia記憶會消失,localStorage不會,所以要從localStorage取值
        token:localStorage.getItem("token")||"",//初始化token
        username:localStorage.getItem("username") || "null",//初始化用戶資料 
        role:localStorage.getItem("role") || "null",//初始化權限 
    }),
    actions:{
        setToken(token){
            this.token=token
            localStorage.setItem("token",this.token)//儲存token
            try {
                const decoded=jwtDecode(token)
                this.username=decoded.sub
                this.role=decoded.role
            } catch (error) {
                this.username=""
                this.role=""
            }
            localStorage.setItem("username",this.username)
            localStorage.setItem("role",this.role)
        },
        logout(){
            this.token=""
            this.username=""
            this.role=""
            localStorage.removeItem("token")//清除token
            localStorage.removeItem("username")//清除用戶名
            localStorage.removeItem("role")//清除權限
        },
        clearToken() {
            this.token = null
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            localStorage.removeItem('username')
        }   
    }
})