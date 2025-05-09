export default function OverviewSummary() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-5 rounded-xl bg-grey-900 text-white w-full mb-3">
        <p className="text-sm mb-3">Current Balance</p>
        <p className="text-xl font-bold">₦4,836.00</p>
      </div>
      <div className="p-5 rounded-xl bg-white w-full mb-3">
        <p className="text-sm mb-3 text-grey-500">Income</p>
        <p className="text-xl font-bold text-grey-900">₦3,814.25</p>
      </div>
      <div className="p-5 rounded-xl bg-white w-full">
        <p className="text-sm mb-3 text-grey-500">Expenses</p>
        <p className="text-xl font-bold text-grey-900">₦1,700.50</p>
      </div>
    </div>
  )
}