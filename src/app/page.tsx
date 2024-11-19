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
import { Discount, Product, ProductItem } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { getColumns } from "@/components/column"
import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/utils"

const DISCOUNTS_CODES: Discount[] = [
  {
    code: 'RAZER',
    discount: 10,
  },
  {
    code: 'TUKI',
    discount: 100,
  },
  {
    code: 'GONCY',
    discount: 30,
  },
  {
    code: 'WALLBIT',
    discount: 50,
  }
]

const formSchema = z.object({
  quantity: z.coerce.number(),
  productId: z.coerce.number(),
})

const discountFormSchema = z.object({
  code: z.string(),
})

export default function Home() {
  const [cartDate, setCartDate] = useState<Date>()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [subtotal, setSubtotal] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [discount, setDiscount] = useState<Discount | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      productId: 1,
    },
  })

  const discountForm = useForm<z.infer<typeof discountFormSchema>>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      code: "",
    },
  })

  function onSubmitDiscount(values: z.infer<typeof discountFormSchema>) {
    const discount = DISCOUNTS_CODES.find((discount) => discount.code === values.code)

    if (!discount) {
      return discountForm.setError('code', {
        message: 'Código de descuento inválido',
      })
    }

    setDiscount(discount)

    toast({
      title: 'Descuento aplicado',
      description: `Descuento del ${discount.discount}% aplicado correctamente.`,
      variant: 'success'
    })
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
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
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalProducts = (products: ProductItem[]): number => {
    return products.reduce((acc, product) => acc + product.quantity, 0)
  }

  const getSubtotal = (products: ProductItem[]): number => {
    return products.reduce((acc, product) => acc + product.price * product.quantity, 0)
  }

  const getTotalPrice = (subtotal: number, discount: Discount | undefined): number => {
    if (discount) {
      return subtotal - (subtotal * discount.discount / 100)
    }
    return subtotal
  }

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

  useEffect(() => {
    setSubtotal(getSubtotal(products))
    setTotalProducts(getTotalProducts(products))
    setTotalPrice(getTotalPrice(subtotal, discount))

    if (products.length === 0 && cartDate) {
      setCartDate(undefined)
      localStorage.removeItem("cartDate")
    }

  }, [products, discount, subtotal, cartDate])

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

  const removeProduct = (productId: number) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    toast({
      title: 'Producto eliminado',
      description: 'El producto ha sido eliminado del carrito.',
      variant: 'success'
    });
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity >= 100) {
      return toast({
        title: "Cantidad máxima",
        description: "La cantidad máxima de productos es 100.",
        variant: "alert",
      })
    }
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity }
      }
      return product
    })
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  const columns = getColumns(removeProduct, updateQuantity)

  return (
    <main>
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Agregar producto</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center"
              >
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Agregando..." : "Agregar"}
                </Button>
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
            <DataTable
              columns={columns}
              data={products}
              onRemove={removeProduct}
              onUpdateQuantity={updateQuantity}
              isLoading={isLoading}
            />
            <div className="flex flex-col md:flex-row justify-between mt-4">
              <div>
                <p className="text-xl">Cantidad de productos: {totalProducts}</p>
              </div>
              <div
                className="flex flex-col gap-y-4 max-w-sm"
              >
                <p className="text-xl mt-4 md:mt-0">Subtotal: {formatPrice(subtotal)}</p>
                <Form {...discountForm}>
                  <form
                    onSubmit={discountForm.handleSubmit(onSubmitDiscount)}
                    className="flex flex-col gap-y-2">
                    <FormField
                      control={discountForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de descuento</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu código" {...field} />
                          </FormControl>
                          <FormDescription>
                            Podes obtener un descuento con un código válido.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Aplicar</Button>
                  </form>
                </Form>
                {
                  discount && (
                    <div
                      className="border border-green-500 text-green-500 rounded-md p-2 text-sm"
                    >
                      Descuento aplicado: {discount.discount}% - {discount.code} ({formatPrice(subtotal * discount.discount / 100)})
                    </div>
                  )
                }
                <p className="text-2xl font-semibold">Total: {formatPrice(totalPrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
