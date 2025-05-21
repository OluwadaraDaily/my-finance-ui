import Image from "next/image";
import { IBillsData } from "@/types/bills";
import { formatCurrency, getOrdinalSuffix } from "@/utils/format";
import { CheckCircle, XCircle } from "lucide-react";

export default function BillsListMobile({ data }: { data: IBillsData[] }) {
  return (
    <ul className="divide-y divide-grey-100">
      {data.map((bill: IBillsData, index: number) => (
        <li key={bill.name + bill.date + index} className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <Image
              src={bill.imageUrl}
              alt={bill.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-bold text-base text-grey-900">{bill.name}</div>
              <div className="text-xs text-app-green font-normal mt-1 flex items-center gap-2">
                Monthly - {bill.date.split(" ")[0]}{getOrdinalSuffix(Number(bill.date.split(" ")[0]))}
                {bill.status === "Paid" && (
                  <CheckCircle className="w-4 h-4 text-app-green" />
                )}
                {bill.status === "Unpaid" && (
                  <XCircle className="w-4 h-4 text-app-red" />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end min-w-[100px]">
            <span className={`font-bold text-base ${bill.status === "Unpaid" ? "text-app-red" : "text-grey-900"}`}>{formatCurrency(bill.amount)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}