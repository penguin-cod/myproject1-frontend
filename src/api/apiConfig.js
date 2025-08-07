    import axios from 'axios'

    const instance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 5000,//在 5 秒（5000 毫秒）內還沒有收到伺服器的回應，就會自動中止，並丟出錯誤。
    });

    // 請求攔截器，幫所有請求加上 Authorization
    instance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;//區分認證類型須加上Bearer，JWT 就屬於 Bearer Token 類型，表示「持票者（Bearer）令牌
    }
    return config;
    });

    export default instance;