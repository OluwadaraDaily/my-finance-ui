import { ITransaction } from "@/types/transactions";
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import React from "react";

interface TransactionsTableProps {
  data: ITransaction[];
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}

export default function TransactionsTable({ data, globalFilter, setGlobalFilter }: TransactionsTableProps) {
  const columnHelper = createColumnHelper<ITransaction>();

  const columns = [
    columnHelper.accessor(row => ({ name: row.name, imageUrl: row.imageUrl }), {
      id: 'recipient',
      header: () => <span>Recipient/Sender</span>,
      cell: info => {
        const { name, imageUrl } = info.getValue();
        return (
          <div className="flex items-center gap-4">
            <Image
              src={imageUrl}
              alt={`${name}'s picture`}
              width={40}
              height={40}
              className="rounded-[50%]"
            />
            <span className="font-bold text-sm">{name}</span>
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        const recipient = row.getValue(columnId) as { name: string; imageUrl: string };
        return recipient.name.toLowerCase().includes(value.toLowerCase());
      },
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => (
        <span className="text-grey-500 text-xs font-normal">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('date', {
      header: () => <span>Transaction Date</span>,
      cell: info => (
        <span className="text-grey-500 text-xs font-normal">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('amount', {
      header: () => 'Amount',
      cell: info => {
        const amount = info.getValue();
        const formattedAmount = formatCurrency(Math.abs(amount));
        return (
          <span className={`font-bold text-sm ${amount < 0 ? 'text-grey-900' : 'text-app-green'}`}>
            {amount < 0 ? '-' : '+'}{formattedAmount}
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
      const recipient = row.getValue('recipient') as { name: string; imageUrl: string };
      return recipient.name.toLowerCase().includes(filterValue.toLowerCase());
    },
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="h-full md:h-[600px] overflow-y-auto">
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
                    cell.column.id === 'category' || cell.column.id === 'date'
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