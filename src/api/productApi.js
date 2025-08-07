import instance from "./apiConfig"

export function getProducts(page=1,size=10,keyword="") {
  return instance.get(`products`,{
    params:{
      page,
      size,
      keyword
    }
  })
}

export function addProduct(data) {
  return instance.post(`products`, data)
}

export function updateProduct(data) {
  return instance.put(`products`, data)
}

export function deleteProduct(id) {
  return instance.delete(`products/${id}`)
}

