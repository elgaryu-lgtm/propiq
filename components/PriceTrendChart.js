'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const CITY_COLORS = {
  '臺北市': '#ef4444',
  '新北市': '#f97316',
  '桃園市': '#eab308',
  '臺中市': '#22c55e',
  '臺南市': '#06b6d4',
  '高雄市': '#8b5cf6',
}

export default function PriceTrendChart({ data, type = 0 }) {
  // data: array of { stat_date, district, is_presale, avg_unit_price }
  // type: 0=existing, 1=presale

  // Pivot by date
  const dates = [...new Set(data.map(d => d.stat_date))].sort()
  const cities = Object.keys(CITY_COLORS)

  const chartData = dates.map(date => {
    const row = { date: date.slice(0, 7) } // YYYY-MM
    for (const city of cities) {
      const match = data.find(d => d.stat_date === date && d.district === city && d.is_presale === type)
      row[city] = match ? +match.avg_unit_price.toFixed(1) : null
    }
    return row
  })

  // Deduplicate by month (take last entry per month)
  const byMonth = {}
  for (const row of chartData) {
    byMonth[row.date] = row
  }
  const finalData = Object.values(byMonth)

  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={finalData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}萬`}
          width={52}
        />
        <Tooltip
          formatter={(value, name) => [`${value} 萬/坪`, name]}
          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
        />
        {cities.map(city => (
          <Line
            key={city}
            type="monotone"
            dataKey={city}
            stroke={CITY_COLORS[city]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
