import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BalancePoint } from "../buyOrWaitApi";
import { formatCurrency } from "../format";

type Props = {
  timeLine: BalancePoint[];
  minimumBalance?: number;
};

// Short axis labels: $5,000 → "$5K". Created once, outside the component.
const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const AXIS_TEXT = { fontSize: 12, fill: "#64748b" };

export default function BalanceChart({ timeLine, minimumBalance }: Props) {
  // Round to cents, and only redo it when timeLine changes.
  // Must be ABOVE the early return (Rules of Hooks).
  const data = useMemo(
    () =>
      timeLine.map((p) => ({
        day: p.day,
        balance: Math.round(p.balance * 100) / 100,
      })),
    [timeLine]
  );

  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-slate-900">Projected balance, next 90 days</h3>
      <p className="mt-1 text-sm text-slate-500">
        Hover the line to see your balance on any day.
      </p>

      {/* ResponsiveContainer fills its parent, so the parent MUST have a height */}
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            {/* Light horizontal gridlines only */}
            <CartesianGrid vertical={false} stroke="#e5e7eb" />

            <XAxis
              dataKey="day"
              tickFormatter={(d) => `Day ${d}`}
              tick={AXIS_TEXT}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={(v) => compactCurrency.format(v)}
              tick={AXIS_TEXT}
              axisLine={false}
              tickLine={false}
              width={64}
            />

            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), "Balance"]}
              labelFormatter={(d) => `Day ${d}`}
              cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
            itemStyle={{ color: "#0f172a" }}   // NEW: dark text instead of purple
            separator=": "    
            />

            {/* Dashed line = threshold. extendDomain keeps it visible
                even when the balance never gets near it. */}
            {minimumBalance !== undefined && (
              <ReferenceLine
                y={minimumBalance}
                stroke="#475569"
                strokeDasharray="6 4"
                ifOverflow="extendDomain"
                label={{
                  value: `Safety floor ${formatCurrency(minimumBalance)}`,
                  position: "insideBottomRight",
                  fill: "#475569",
                  fontSize: 12,
                }}
              />
            )}

            <Line
              type="stepAfter"
              dataKey="balance"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}