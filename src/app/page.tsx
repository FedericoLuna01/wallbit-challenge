"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Product, ProductItem } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/column"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  quantity: z.coerce.number(),
  productId: z.coerce.number(),
})

export default function Home() {
  const [cartDate, setCartDate] = useState<Date>()
  const [products, setProducts] = useState<ProductItem[]>([
    // {
    //   "id": 1,
    //   "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    //   "price": 109.95,
    //   "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    //   "category": "men's clothing",
    //   "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    //   "rating": {
    //     "rate": 3.9,
    //     "count": 120
    //   },
    //   quantity: 3
    // }
  ])

  const { toast } = useToast()

  const getTotalProducts = (products: ProductItem[]): number => {
    return products.reduce((acc, product) => acc + product.quantity, 0)
  }

  const total = getTotalProducts(products)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      productId: 1,
    },
  })

  const getProduct = async (product: number): Promise<Product | undefined> => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${product}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Chequeo si el producto ya está en el carrito
    const productExits = products.some((product) => product.id === values.productId)
    if (productExits) {
      toast({
        title: 'El producto ya está en el carrito',
        description: 'Puedes cambiar la cantidad desde el carrito.',
        variant: 'alert',
      })
      return
    }

    const product = await getProduct(values.productId)
    if (!product) {
      return toast({
        title: 'Producto no encontrado',
        description: 'El producto no ha sido encontrado.',
        variant: 'destructive',
      })
    }

    if (!cartDate) {
      setCartDate(new Date())
      localStorage.setItem('cartDate', new Date().toISOString());
    }

    const updatedProducts = [...products, { ...product, quantity: values.quantity }];
    setProducts(updatedProducts);
    toast({
      title: 'Producto agregado',
      description: 'El producto ha sido agregado correctamente.',
      variant: 'success'
    })
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  }

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const cartDate = localStorage.getItem('cartDate');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    if (cartDate) {
      setCartDate(new Date(cartDate));
    }
  }, []);

  return (
    <main>
      <div className="max-w-5xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Agregar producto</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-x-4 items-center">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number" {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Cantidad del producto a comprar.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Id del producto</FormLabel>
                      <FormControl>
                        <Input
                          type="number" {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Id del producto a comprar.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Agregar</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="my-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <p className="text-2xl">
                Carrito de compras
              </p>
              {
                products.length > 0 && (
                  <Button
                    onClick={() => {
                      localStorage.removeItem('products');
                      localStorage.removeItem('cartDate');
                      setCartDate(undefined);
                      setProducts([]);
                      toast({
                        title: 'Carrito vaciado',
                        description: 'El carrito ha sido vaciado correctamente.',
                        variant: 'success',
                      })
                    }}
                    variant="destructive"
                  >
                    Vaciar carrito
                  </Button>
                )
              }
            </CardTitle>
            <CardDescription>
              Iniciado: {cartDate ? cartDate.toLocaleString() : 'No hay productos en el carrito'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={products} />
            <div className="flex justify-between mt-4">
              <div>
                <p>Cantidad de productos: {total}</p>
              </div>
              <div>
                <p>Subtotal: 2</p>
                <div>
                  <Label>Código de descuento</Label>
                  <Input
                    type="number"
                  />
                  <Button>
                    Aplicar
                  </Button>
                </div>
                <p>Total: 2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
