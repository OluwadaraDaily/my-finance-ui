import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { Image } from "@/components/ui/image";
import { formatCurrency } from "@/utils/format";
import React from "react";
import { IBillsData } from "@/types/bills";
import { CheckCircle, XCircle } from "lucide-react";

interface BillsTableProps {
  data: IBillsData[];
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}

export default function BillsTable({ data, globalFilter, setGlobalFilter }: BillsTableProps) {
  const columnHelper = createColumnHelper<IBillsData>();

  const columns = [
    columnHelper.accessor(row => ({ name: row.name, imageUrl: row.imageUrl }), {
      id: 'billTitle',
      header: () => <span>Bill Title</span>,
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
              quality={85}
              sizes="40px"
            />
            <span className="font-bold text-sm">{name}</span>
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        const billTitle = row.getValue(columnId) as { name: string; imageUrl: string };
        return billTitle.name.toLowerCase().includes(value.toLowerCase());
      },
    }),
    columnHelper.accessor('date', {
      header: () => <span>Due Date</span>,
      cell: info => (
        <div className="flex items-center gap-2">
          <span className="text-app-green text-xs font-normal">{info.getValue()}</span>
          {info.row.getValue('status') === 'Paid' && (
            <CheckCircle className="w-4 h-4 text-app-green" />
          )}
          {info.row.getValue('status') === 'Unpaid' && (
            <XCircle className="w-4 h-4 text-app-red" />
          )}
        </div>
      ),
    }),
    columnHelper.accessor('amount', {
      header: () => 'Amount',
      cell: info => {
        const amount = info.getValue();
        const formattedAmount = formatCurrency(Math.abs(amount));
        return (
          <span className={`font-bold text-sm ${info.row.getValue('status') === 'Unpaid' ? 'text-app-red' : 'text-grey-900'}`}>
            {formattedAmount}
          </span>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: () => '',
      cell: () => null,
      enableHiding: true,
      size: 0
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const billTitle = row.getValue('billTitle') as { name: string; imageUrl: string };
      return billTitle.name.toLowerCase().includes(filterValue.toLowerCase());
    },
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="h-full overflow-y-auto">
      <table className="w-full mt-6">
        <colgroup>
          <col className="w-[60%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead className="hidden md:table-header-group">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`text-left py-4 text-grey-500 text-xs font-normal pl-2 ${header.id==='amount' ? 'text-right' : ''}`}
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
                  className={`py-4 ${cell.column.id === 'amount' ? 'text-right' : ''}`}
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