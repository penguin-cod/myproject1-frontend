<template>
    <div>
      <!-- 查詢框 -->
      <el-input v-model="keyword" placeholder="輸入商品名稱搜尋" @input="fetchProducts"></el-input>
      <!-- 新增商品 -->
      <el-button type="primary" @click="openAddDialog">新增商品</el-button>
      <!-- 商品列表 -->
      <el-table :data="products" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="productId" label="商品編號" />
        <el-table-column prop="name" label="商品名稱" :min-width="100" />
        <el-table-column prop="price" label="價格" />
        <el-table-column prop="stock" label="庫存" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="openEditDialog(scope.row)">編輯</el-button>
            <el-button size="small" type="danger" @click="removeProduct(scope.row.id)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 編輯商品 -->
       <!--el-input輸入的是字串,下面要使用數據要注意-->
      <el-dialog v-model="dialogVisible" title="商品資訊">
        <el-form :model="currentProduct" :rules="rules" ref="productForm">
          <el-form-item label="商品編號" prop="productId">
            <el-input v-model="currentProduct.productId" /> 
          </el-form-item>
          <el-form-item label="名稱" prop="name">
            <el-input v-model="currentProduct.name" />
          </el-form-item>
          <el-form-item label="價格" prop="price">
            <el-input v-model="currentProduct.price" />
          </el-form-item>
          <el-form-item label="庫存" prop="stock">
            <el-input v-model="currentProduct.stock" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">儲存</el-button>
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
  import { ref, onMounted } from 'vue'
  import { getProducts, addProduct, updateProduct, deleteProduct } from '../api/productApi.js'
  
  const products = ref([])//商品列表資料
  const dialogVisible = ref(false)//是否顯示新增與編輯框
  const currentProduct = ref({id:null, productId:null, name: '', price: 0, stock:0})//新增與編輯框的資料，用來put和post
  const productForm = ref(null)//表單的實體
  const rules=ref({ //驗證規則
    //商品編號規則
    productId:[
      {required:true,message:"請輸入商品編號",trigger:"blur"},
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
    //名字規則 required=true 代表欄位必填
    name:[
      {required:true,message:"請輸入商品名稱",trigger:"blur"}
    ],
    //價格規則
    price:[
      {required:true,message:"請輸入商品價格",trigger:"blur"},
      //自訂義驗證器
      // rule: 當前欄位的規則物件（包含 message、trigger 等）
      // value: 當前欄位的輸入值
      // callback: 必須呼叫 callback() 才算驗證完成
      { validator: (rule, value, callback) => { 
        const num = Number(value)
        if (isNaN(num)) {
          callback(new Error("價格必須是數字"))
        } else if (num < 1 || num > 99999) {
          callback(new Error("價格必須在 1 到 99999 之間"))
        } else {
          callback()
        }
        },
        trigger: "blur"
      }
    ],
    //庫存規則
    stock:[
      { required: true, message: '請輸入庫存數量', trigger: 'blur' },
      {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (isNaN(num)) {
          callback(new Error("庫存數量必須是數字"))
        } else if (num < 1 || num > 9999) {
          callback(new Error("庫存數量必須在 1 到 9999 之間"))
        } else {
          callback()
        }
      },
      trigger: "blur"
      }
    ]
  })
  const total = ref(0)           // 總商品數量
  const currentPage = ref(1)     // 當前頁數
  const pageSize = ref(10)       // 每頁顯示的商品數量
  const keyword = ref('')        // 查詢關鍵字


  // 當頁數變動時，重新載入商品
  function handleCurrentChange(page) {//page是分頁元件內建
    currentPage.value = page
    fetchProducts()
  }
  
  function openAddDialog() {
    currentProduct.value = { id:null,productId: null, name: '', price: 0 , stock:0}
    dialogVisible.value = true
  }
  
  function openEditDialog(product) {
    currentProduct.value = { ...product }
    dialogVisible.value = true
  }

  //取得商品資料
  async function fetchProducts() {
    try {
      const res=await getProducts(currentPage.value,pageSize.value,keyword.value)
      products.value=res.data.data.records
      total.value=res.data.data.total
    } catch (error) {
      console.error("取得商品失敗",error)
    }
  }

  async function saveProduct() {
    //將el-input的字串轉為數字
    currentProduct.value.productId=Number(currentProduct.value.productId)
    currentProduct.value.price=Number(currentProduct.value.price)
    currentProduct.value.stock=Number(currentProduct.value.stock)
    try{
      const valid=await productForm.value.validate()//valid代表validator回傳的promise是否成功
      if(!valid){
        console.log('表單驗證失敗')
        return
      }
      if(currentProduct.value.id){//更新
        await updateProduct(currentProduct.value)//PUT請求
      }else{
        await addProduct(currentProduct.value)//POST清求
      }
      await fetchProducts()
      dialogVisible.value=false
      
    }catch(error){
      dialogVisible.value=false
      const isUpdate=!!currentProduct.value.id //!!代表轉化成布林值
      const action=isUpdate?"更新":"新增"
      console.error(`${action}商品失敗或表單驗證錯誤:`,error)
      alert(`${action}商品失敗或表單驗證錯誤,請稍後再試!`)
    }
  }
  
  async function removeProduct(id){
    try {
      const res = await deleteProduct(id)
      if (res.data.success) {
      // 刪除成功
      await fetchProducts()
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
    fetchProducts()
  })


  window.saveProduct = saveProduct
  window.currentProduct=currentProduct
  window.saveProduct = saveProduct
  window.removeProduct=removeProduct
  </script>