export function isTokenExpired(token) { //檢查token是否過期，不使用套件的底層原理解碼token
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))//JSON.parse() 把字串轉成 JavaScript 物件,
    // atob() 是瀏覽器內建的 Base64 解碼函式,token.split('.')[1] 取出中間的 payload 字串（Base64 編碼）
    const now = Math.floor(Date.now() / 1000) //Date.now()是毫秒 所以要/1000取秒 Math.floor是向下取整，Date.now()回傳的是「從 1970-01-01到現在的時間」
    return payload.exp < now //判斷過期時間是否小於現在時間
  } catch (e) {
    return true //如果有出錯也是回傳過期
  }
}

//jwt是 1:header(json格式，base64編碼)包含alg:使用的演算法 typ:token類型
//2:payload(json格式，base64編碼) 包含使用者資料,權限,exp過期時間
//3:signature:將上面兩點用alg提到的演算法加密，HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload),secret_key)，!無法逆推!
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphY2siLCJleHAiOjE3MjA0NjAwMDB9.IUtT2O9zY9yLfGdxrN4Bu6VzWmA-yu6M2SKXED1o0Mg
//也就說header.payload.signature
