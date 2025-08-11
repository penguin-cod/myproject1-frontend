# project1 - 前端 (Frontend)

本倉庫為此專案的前端，使用 Vue 3、Element Plus 開發，搭配 Axios 與 JWT 驗證後端 API。

🔗 [後端程式碼倉庫（Spring Boot）](https://github.com/penguin-cod/myproject1-backend)

---

## 🛠 技術棧

- NodeJs 20
- Vue 3 + Vite
- Element Plus
- Pinia
- Axios
- Vue Router
- JWT
- Git

---

## 🧩 功能說明

- 頁面_首頁
- 頁面_登入頁：獲取JWT
- 頁面_商品管理：CRUD + 關鍵字查詢分頁
- 頁面_成員管理（僅限權限 admin 使用）：CRUD + 權限控管 + 關鍵字查詢分頁
- 前端路由守衛：判斷 JWT 有效性並限制頁面存取
- 全局 Axios 攔截器：自動在請求 Header 附加 Bearer Token
- pinia：管理使用者資料和JWT

---

## 🔗 與後端的串接

- Base URL 設定於 src/api/apiConfig.js，指向後端服務 http://localhost:8080
- 登入後由後端發回 JWT，存入 localStorage 及 Pinia store
- 請求時由 Axios 攔截器自動附加 Authorization: Bearer <token>
- 路由守衛中判斷 Token 是否過期，未授權導向登入頁
- 商品與使用者管理 API 按 RESTful 規範，包含分頁與模糊搜尋參數

## 🚀 快速啟動

bash：
npm install
npm run dev

---

## 流程架構

前端路由守衛判斷 JWT 是否過期，過期自動登出並導向登入。
        ↓         
使用者輸入帳密，前端呼叫後端登入 API。
        ↓
後端驗證成功後回傳 JWT。
        ↓
前端存儲 JWT 於 Pinia 與 localStorage。
        ↓
後續 Axios 請求自動帶入 Authorization Header。
        ↓
後端驗證 JWT 有效性與權限，回應 API 資料。
        ↓
前端路由守衛判斷 JWT 是否過期，過期自動登出並導向登入。