"use client"
import { useRouter } from "next/navigation";
import { TertiaryButton } from "../button";
import Image from "next/image";
import { IPotItem } from "@/types/pots";
import PotItem from "./pot-item";

export default function PotsSummary() {
  const router = useRouter();
  const POT_ITEMS: IPotItem[] = [
    {
      label: "Savings",
      amount: 159,
      color: "app-green"
    },
    {
      label: "Gift",
      amount: 40,
      color: "app-cyan"
    },
    {
      label: "Concert Ticket",
      amount: 110,
      color: "app-navy"
    },
    {
      label: "New Laptop",
      amount: 10,
      color: "app-yellow"
    },
  ]

  return (
    <div className="py-6 px-5 bg-white rounded-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Pots</h2>
        <div>
          <TertiaryButton
            label="See Details"
            onClick={() => router.push("/dashboard/pots")}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="p-4 flex items-center gap-4 bg-beige-100 rounded-xl mb-5">
          <Image
            src="/icons/pots-jar.svg"
            alt=""
            width={40}
            height={40}
          />
          <div>
            <p className="text-sm text-grey-500 mb-2">Total Saved</p>
            <p className="text-xl text-grey-900 font-bold">₦850</p>
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {
            POT_ITEMS.map((item: IPotItem) => (
              <PotItem
                key={item.label}
                label={item.label}
                amount={item.amount}
                color={item.color}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}