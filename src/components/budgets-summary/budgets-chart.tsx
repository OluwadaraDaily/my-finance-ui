"use client"
import { PieChart, Pie, Cell, Label } from 'recharts';
import { formatCurrency } from '@/utils/format';
import { BudgetChartData } from '@/types/budgets';
import { AlertCircle } from 'lucide-react';

interface BudgetsChartProps {
  data?: BudgetChartData;
  isLoading?: boolean;
  error?: Error | null;
}

export function BudgetsChart({ data, isLoading, error }: BudgetsChartProps) {
  console.log("budgets chart data =>", data);
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="text-gray-500">Loading budget data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-app-red w-full mb-3 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">Error</p>
          </div>
          <p className="text-sm text-app-red">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  if (!data?.budgets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="text-gray-500">No budget data available.</div>
      </div>
    );
  }

  const chartData = data.budgets;

  return (
    <div className="flex flex-col items-center justify-center">
      <PieChart width={300} height={300} id="budgets-summary-chart">
        <Pie
          data={chartData}
          dataKey="amount"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={105}
          startAngle={90}
          endAngle={-270}
          stroke="none"
        >
          {chartData.map((entry) => (
            <Cell key={`inner-${entry.label}`} fill={entry.color} opacity={0.75} />
          ))}
        </Pie>
        <Pie
          data={chartData}
          dataKey="amount"
          cx="50%"
          cy="50%"
          innerRadius={105}
          outerRadius={140}
          startAngle={90}
          endAngle={-270}
          stroke="none"
        >
          {chartData.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
          <Label
            value={`${formatCurrency(data.spent, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}`}
            id="main-text"
            position="center"
            dx={0}
            dy={-15}
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              fill: '#201F24',
              textAnchor: 'middle',
              dominantBaseline: 'middle',
            }}
          />
          <Label
            value={`of ${formatCurrency(data.total, { maximumFractionDigits: 0, minimumFractionDigits: 0 })} limit`}
            id="sub-text"
            position="center"
            dx={0} 
            dy={23}
            style={{
              fontSize: 16,
              fill: '#696868',
              textAnchor: 'middle',
              dominantBaseline: 'middle',
            }}
          />
        </Pie>
      </PieChart>
    </div>
  );
}