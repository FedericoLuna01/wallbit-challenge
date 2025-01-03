export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface ProductItem extends Product {
  quantity: number
}

export interface Discount {
  code: string
  discount: number
}