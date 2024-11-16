import { formatPrice } from "@/lib/utils";
import { ProductItem } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Input } from "./ui/input";

export const columns: ColumnDef<ProductItem>[] = [
  {
    accessorKey: "quantity",
    header: () => <div className="text-center">Cantidad</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {/* <Input
          type='number'
          value={row.original.quantity}
          onChange={(e) => {
            console.log('e.target.value', e.target.value)
          }}
        > */}
        {row.original.quantity}
        {/* </Input> */}
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
        <button onClick={() => console.log('Eliminar producto', row.original.id)}>
          Eliminar
        </button>
      </div>
    )
  }
]