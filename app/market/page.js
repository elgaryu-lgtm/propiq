import { getAllCityStats, getLatestStatDate, formatStatDate } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '各縣市行情 | PropIQ',
  description: '查看台灣全部22縣市最新房市行情，含成屋、預售均價與年增率。',
}

export default async function MarketPage() {
  const [allStats, latestDateRaw] = await Promise.all([
    getAllCityStats(24),
    getLatestStatDate(),
  ])
  const latestDate = formatStatDate(latestDateRaw)

  // Get latest snapshot for all cities
  const latest = allStats.filter(r => r.stat_date === latestDateRaw)

  // Get all distinct cities sorted by existing transaction count
  const cities = [...new Set(latest.map(r => r.district))]
    .sort((a, b) => {
      const aCount = latest.find(r => r.district === a && r.is_presale === 0)?.total_transactions ?? 0
      const bCount = latest.find(r => r.district === b && r.is_presale === 0)?.total_transactions ?? 0
      return bCount - aCount
    })

  function getStat(city, isPresale) {
    return latest.find(r => r.district === city && r.is_presale === isPresale)
  }

  function yoyBadge(pct) {
    if (pct == null) return <span className="text-slate-400">—</span>
    const up = pct >= 0
    return (
      <span className={`font-semibold ${up ? 'text-red-600' : 'text-green-600'}`}>
        {up ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
      </span>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800">各縣市房市行情</h1>
        <p className="text-slate-500 mt-2">
          資料週期：{latestDate}　｜　資料來源：內政部不動產交易實際資訊資料庫
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-5 text-left">縣市</th>
              <th className="py-4 px-5 text-right">成屋均價<br/><span className="text-slate-400 font-normal normal-case">(萬/坪)</span></th>
              <th className="py-4 px-5 text-right">成屋筆數</th>
              <th className="py-4 px-5 text-right">成屋年增</th>
              <th className="py-4 px-5 text-right">預售均價<br/><span className="text-slate-400 font-normal normal-case">(萬/坪)</span></th>
              <th className="py-4 px-5 text-right">預售筆數</th>
              <th className="py-4 px-5 text-right">預售年增</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cities.map((city, i) => {
              const ex = getStat(city, 0)
              const pre = getStat(city, 1)
              return (
                <tr key={city} className={`hover:bg-slate-50 transition-colors ${i < 6 ? 'font-medium' : ''}`}>
                  <td className="py-4 px-5 text-slate-800 font-semibold">
                    {i < 6 && <span className="inline-block w-2 h-2 rounded-full bg-brand-500 mr-2 mb-0.5"></span>}
                    {city}
                  </td>
                  <td className="py-4 px-5 text-right text-slate-700">
                    {ex?.avg_unit_price?.toFixed(1) ?? '—'}
                  </td>
                  <td className="py-4 px-5 text-right text-slate-500">
                    {ex?.total_transactions?.toLocaleString() ?? '—'}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {yoyBadge(ex?.yoy_change_pct)}
                  </td>
                  <td className="py-4 px-5 text-right text-brand-700 font-semibold">
                    {pre?.avg_unit_price?.toFixed(1) ?? '—'}
                  </td>
                  <td className="py-4 px-5 text-right text-slate-500">
                    {pre?.total_transactions?.toLocaleString() ?? '—'}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {yoyBadge(pre?.yoy_change_pct)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        * 藍點標示為六都。年增率以同比去年同期計算。數字四捨五入至小數點後一位。
      </p>
    </div>
  )
}
