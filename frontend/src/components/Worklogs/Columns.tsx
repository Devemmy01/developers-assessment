"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Check, AlertCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
export type Worklog = {
  id: string
  freelancerId: string
  freelancerName: string
  project: string
  date: string
  hours: number
  description: string
  status: "pending" | "approved" | "paid" | "rejected"
  amount: number
}

export const columns: ColumnDef<Worklog>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "freelancerName",
    header: "Freelancer",
  },
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const dateValue = row.getValue("date") as string
        if (!dateValue) return <div className="text-muted-foreground">-</div>
        const date = new Date(dateValue)
        return <div className="font-medium">{isNaN(date.getTime()) ? dateValue : date.toLocaleDateString()}</div>
    }
  },
  {
    accessorKey: "hours",
    header: () => <div className="text-right">Hours</div>,
    cell: ({ row }) => {
      const val = row.getValue("hours")
      const amount = typeof val === 'number' ? val : parseFloat(val as string)
      return <div className="text-right font-medium">{isNaN(amount) ? '-' : amount.toFixed(1)}h</div>
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      let icon = <Clock className="mr-1 h-3 w-3" />

      if (status === 'approved') {
        variant = "secondary" // greenish usually handled by class overrides or theme
        icon = <Check className="mr-1 h-3 w-3" />
      } else if (status === 'paid') {
        variant = "default"
        icon = <Check className="mr-1 h-3 w-3" />
      } else if (status === 'rejected') {
        variant = "destructive"
        icon = <AlertCircle className="mr-1 h-3 w-3" />
      }

      return (
        <Badge variant={variant} className="capitalize flex w-fit items-center">
          {icon}
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>View freelancer profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]