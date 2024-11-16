"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { Product } from "@/types"
import { Card, CardContent, CardHeader } from "./ui/card"

const formSchema = z.object({
  quantity: z.coerce.number(),
  productId: z.coerce.number(),
})

const ProductForm = () => {
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
    const product = await getProduct(values.productId)
    console.log(values)
    console.log(product)
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Comprar producto</h2>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProductForm