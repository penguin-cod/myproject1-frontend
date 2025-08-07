<template>
    <div>
        <!-- 查詢框 -->
      <el-input v-model="keyword" placeholder="輸入使用者名稱搜尋" @input="fetchUsers"></el-input>

      <el-button type="primary" @click="openAddDialog">註冊使用者</el-button>
      <!-- 使用者列表 -->
      <el-table :data="users" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="userId" label="使用者編號" />
        <el-table-column prop="username" label="使用者名稱" />
        <el-table-column prop="role" label="權限" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="openEditDialog(scope.row)">編輯</el-button>
            <el-button size="small" type="danger" @click="removeUser(scope.row.id)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 編輯使用者 -->
       <!--el-input輸入的是字串,下面要使用數據要注意-->
      <el-dialog v-model="dialogVisible" title="使用者資訊">
        <el-form :model="currentUser" :rules="rules" ref="userForm">
          <el-form-item label="使用者編號" prop="userId">
            <el-input v-model="currentUser.userId" /> 
          </el-form-item>
          <el-form-item label="名稱" prop="username">
            <el-input v-model="currentUser.username" />
          </el-form-item>
          <el-form-item label="密碼" prop="password">
            <el-input v-model="currentUser.password" />
          </el-form-item>
          <el-form-item label="權限" prop="role">
            <el-radio-group v-model="currentUser.role">
            <el-radio label="admin">管理員</el-radio>
            <el-radio label="user">一般使用者</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">儲存</el-button>
        </template>
      </el-dialog>
       <!-- 分頁 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
    </div>
</template>

<script setup>
import {ref,onMounted} from "vue"
import {getUser, addUser, updateUser, deleteUser} from "../api/userApi.js"
const users=ref([])
const currentUser=ref({id:null,userId:null,username:"",password:null,role:""})
const dialogVisible = ref(false)
const userForm = ref(null)//表單的實體
const total = ref(0)           // 總商品數量
const currentPage = ref(1)     // 當前頁數
const pageSize = ref(10)       // 每頁顯示的使用者數量
const keyword = ref('')        // 查詢關鍵字
const rules=ref({//驗證規則
    userId:[
        {required:true,message:"請輸入使用者編號",trigger:"blur"},
        {   
          validator:(rule,value,callback)=>{
             const num=Number(value)
             if(isNaN(num)){
               callback(new Error("請輸入數字"))
             }else{
               callback()
             }
          },
          trigger:"blur"
        }
    ],
    //名字規則 required=true 代表欄位為空
    username:[
        {required:true,message:"請輸入使用者名稱",trigger:"blur"}
    ],
    //密碼規則
    password:[
        {required:true,message:"請輸入密碼",trigger:"blur"},
        {
          validator:(rule,value,callback)=>{
            const num=Number(value)
            if(isNaN(num)){
              callback(new Error("請輸入數字"))
            }else{
              callback()
            }
          }   
        }     
    ],
    //權限規則，必須勾選
    role: [
        { required: true, message: '請選擇權限', trigger: 'change' }
    ]
})
 // 當頁數變動時，重新載入使用者
  function handleCurrentChange(page) {
    currentPage.value = page
    fetchUsers()
  }
  function openAddDialog() {
    currentUser.value = { id:null,userId: null, username: '',password:null, role:""}
    dialogVisible.value = true
  }
  
  function openEditDialog(user) {
    currentUser.value = { ...user }
    dialogVisible.value = true
  }
  //取得使用者資料
  async function fetchUsers() {
    try {
      const res=await getUser(currentPage.value,pageSize.value,keyword.value)
      users.value=res.data.data.records
      total.value=res.data.data.total
    } catch (error) {
      console.error("取得使用者失敗",error)
    }
  }

  async function saveUser() {
    //將el-input的字串轉為數字
    currentUser.value.userId=Number(currentUser.value.userId)
    currentUser.value.password=Number(currentUser.value.password)
    try{
      const valid=await userForm.value.validate()//valid代表validator回傳的promise是否成功
      if(!valid){
        console.log('表單驗證失敗')
        return
      }
      if(currentUser.value.id){//更新
        await updateUser(currentUser.value)//PUT請求
      }else{
        await addUser(currentUser.value)
      }
      await fetchUsers()
      dialogVisible.value=false
      
    }catch(error){
      dialogVisible.value=false
      const isUpdate=!!currentUser.value.id //!!代表轉化成布林值
      const action=isUpdate?"更新":"新增"
      console.error(`${action}使用者失敗或表單驗證錯誤:`,error)
      alert(`${action}使用者失敗或表單驗證錯誤,請稍後再試!`)
    }
  }
  
  async function removeUser(id){
    try {
      const res = await deleteUser(id)
      if (res.data.success) {
      // 刪除成功
      await fetchUsers()
      }else{
        // 刪除失敗
        alert(res.data.message)
      }
    } catch (error) {
      console.error('刪除時發生錯誤', error)
      alert('伺服器錯誤，請稍後再試')
    }
  }

  onMounted(() => {
    fetchUsers()
  })
</script>

