import instance from "./apiConfig"

export function login(loginForm){
  return instance.post(`login`,{
    username:loginForm.username,
    password:loginForm.password
  })
}

export function getUser(page,size,keyword){
  return instance.get(`admin`,{
    params:{
      page,
      size,
      keyword
    }
  })
}

export function addUser(data){
    return instance.post(`admin`,data)
}

export function updateUser(data){
    return instance.put(`admin`,data)
}

export function deleteUser(id){
    return instance.delete(`admin/${id}`)
}