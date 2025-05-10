export default function BudgetsChartFallback() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[300px] h-[300px]">
        <div className="absolute inset-0 rounded-full border-[35px] border-grey-100 animate-pulse" />
        <div className="absolute inset-[15px] rounded-full border-[15px] border-grey-100 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-24 h-7 bg-grey-100 rounded animate-pulse" />
          <div className="w-32 h-5 bg-grey-100 rounded mt-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
