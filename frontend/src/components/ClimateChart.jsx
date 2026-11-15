import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export default function ClimateChart({ chartData }) {
  if (!chartData || chartData.length === 0) return null;

  return (
    <div style={{
      background: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      border: "1px solid #e5e7eb"
    }}>
      <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#111827" }}>
        NASA POWER Zaman Serisi: Yıllık Yağış & Kök Bölgesi Nemi
      </h3>
      <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#6b7280" }}>
        2023–2026 döneminde kök bölgesi nemindeki düşüş ve yağış oynaklığı
      </p>

      <div style={{ width: "100%", height: 270 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} unit=" mm" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 1]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="rainfall_mm"
              name="Yıllık Yağış (mm)"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="root_moisture"
              name="Kök Bölgesi Nemi (0-1)"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}