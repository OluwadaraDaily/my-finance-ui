import { Transaction } from "@/lib/api/services/transactions/types";
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import React from "react";

interface TransactionsTableProps {
  data: Transaction[];
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}

export default function TransactionsTable({ data, globalFilter, setGlobalFilter }: TransactionsTableProps) {
  const columnHelper = createColumnHelper<Transaction>();

  const columns = [
    columnHelper.accessor(row => ({ recipient: row.recipient, sender: row.sender, type: row.type }), {
      id: 'recipient',
      header: () => <span>Recipient/Sender</span>,
      cell: info => {
        const { recipient, sender, type } = info.getValue();
        return (
          <div className="flex items-center gap-4">
            <Image
              src={'/icons/transactions.svg'}
              alt={`${type === "DEBIT" ? recipient : sender}'s picture`}
              width={40}
              height={40}
              className="rounded-[50%]"
            />
            <span className="font-bold text-sm">{type === "DEBIT" ? recipient : sender}</span>
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        const recipient = row.getValue(columnId) as { recipient: string, sender: string };
        return recipient.recipient.toLowerCase().includes(value.toLowerCase()) || recipient.sender.toLowerCase().includes(value.toLowerCase());
      },
    }),
    columnHelper.accessor(row => ({ budget: row.budget, pot: row.pot }), {
      id: 'category',
      header: 'Category',
      cell: info => {
        const { budget, pot } = info.getValue();
        const categoryName = budget?.name || pot?.name || '-';
        return (
          <span className="text-grey-500 text-xs font-normal">{categoryName}</span>
        );
      },
    }),
    columnHelper.accessor('transaction_date', {
      header: () => <span>Transaction Date</span>,
      cell: info => (
        <span className="text-grey-500 text-xs font-normal">
          {new Date(info.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    }),
    columnHelper.accessor('amount', {
      header: () => 'Amount',
      cell: info => {
        const amount = info.getValue();
        const formattedAmount = formatCurrency(Math.abs(amount));
        return (
          <span className={`font-bold text-sm ${info.row.original.type === "DEBIT" ? 'text-grey-900' : 'text-app-green'}`}>
            {info.row.original.type === "DEBIT" ? '-' : '+'}{formattedAmount}
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const name = row.getValue('recipient') as { recipient: string, sender: string };
      return name[row.original.type === "DEBIT" ? "recipient" : "sender"].toLowerCase().includes(filterValue.toLowerCase());
    },
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="h-full overflow-y-auto">
      <table className="w-full mt-6">
        <colgroup>
          <col className="w-[45%]" />
          <col className="w-[18.33%]" />
          <col className="w-[18.33%]" />
          <col className="w-[18.33%]" />
        </colgroup>
        <thead className="hidden md:table-header-group">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`text-left py-4 text-grey-500 text-xs font-normal ${
                    header.id === 'recipient' ? 'pl-2' : 'pl-8'
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-t border-grey-100">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className={`py-4 ${
                    cell.column.id === 'description' || cell.column.id === 'transaction_date'
                      ? 'hidden md:table-cell'
                      : ''
                  } ${cell.column.id === 'recipient' ? 'pl-2' : 'pl-8'}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 