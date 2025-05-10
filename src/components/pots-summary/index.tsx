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
      color: "#277C78"
    },
    {
      label: "Gift",
      amount: 40,
      color: "#82C9D7"
    },
    {
      label: "Concert Ticket",
      amount: 110,
      color: "#626070"
    },
    {
      label: "New Laptop",
      amount: 10,
      color: "#F2CDAC"
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
      <div className="flex flex-col md:flex-row md:gap-5">
        <div className="p-4 flex items-center gap-4 bg-beige-100 rounded-xl mb-5 md:mb-0 md:flex-[45%]">
          <Image
            src="/icons/pots-jar.svg"
            alt=""
            width={40}
            height={40}
          />
          <div>
            <p className="text-sm text-grey-500 mb-2">Total Saved</p>
            <p className="text-xl font-bold">₦850</p>
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 md:flex-[55%]">
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