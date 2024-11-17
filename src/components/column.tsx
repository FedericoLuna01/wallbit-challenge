import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { TrashIcon } from "lucide-react";

import { ProductItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const getColumns = (
  onRemove?: (productId: number) => void,
  onUpdateQuantity?: (productId: number, quantity: number) => void
): ColumnDef<ProductItem>[] => [
    {
      accessorKey: "quantity",
      header: () => <div className="text-center">Cantidad</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Input
            type="number"
            min={1}
            value={row.original.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value)
              if (newQuantity > 0) {
                onUpdateQuantity?.(row.original.id, newQuantity)
              }
            }}
            className="w-20 text-center mx-auto"
          />
        </div>
      )
    },
    {
      accessorKey: "title",
      header: "Titulo",
      cell: ({ row }) => <div className="max-w-[20em]">{row.original.title}</div>,
    },
    {
      accessorKey: "price",
      header: "Precio unitario",
      cell: ({ row }) => <span>{formatPrice(row.original.price)}</span>,
    },
    {
      accessorKey: "totalPrice",
      header: "Precio total",
      cell: ({ row }) => <span>{formatPrice(row.original.price * row.original.quantity)}</span>,
    },
    {
      accessorKey: "image",
      header: "Imagen",
      cell: ({ row }) => <Image src={row.original.image} alt={row.original.title} width={80} height={80} />,
    },
    {
      accessorKey: "remove",
      header: () => <div className="text-center">Eliminar</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove?.(row.original.id)}
          >
            <TrashIcon />
          </Button>
        </div>
      )
    }
  ]