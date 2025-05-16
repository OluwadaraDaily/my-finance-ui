"use client"
import { PieChart, Pie, Cell, Label } from 'recharts';
import { BUDGET_SUMMARY_DATA } from './data';
import { formatCurrency } from '@/utils/format';
import { useEffect, useState } from 'react';

const total = 975;
const spent = 338;

export function BudgetsChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <PieChart width={300} height={300} id="budgets-summary-chart">
        <Pie
          data={BUDGET_SUMMARY_DATA}
          dataKey="amount"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={105}
          startAngle={90}
          endAngle={-270}
          stroke="none"
        >
          {BUDGET_SUMMARY_DATA.map((entry) => (
            <Cell key={`inner-${entry.label}`} fill={entry.color} opacity={0.75} />
          ))}
        </Pie>
        <Pie
          data={BUDGET_SUMMARY_DATA}
          dataKey="amount"
          cx="50%"
          cy="50%"
          innerRadius={105}
          outerRadius={140}
          startAngle={90}
          endAngle={-270}
          stroke="none"
        >
          {BUDGET_SUMMARY_DATA.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
          <Label
            value={`${formatCurrency(spent, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}`}
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
            value={`of ${formatCurrency(total, { maximumFractionDigits: 0, minimumFractionDigits: 0 })} limit`}
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