import { getLatestCityStats, getPriceTrend, getTotalTransactions } from '@/lib/supabase'
import CityCard from '@/components/CityCard'
import PriceTrendChart from '@/components/PriceTrendChart'

export const revalidate = 3600 // Re-fetch every hour

const SIX_CITIES = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市']

export default async function HomePage() {
  const [cityStats, trendData, totalTx] = await Promise.all([
    getLatestCityStats(),
    getPriceTrend(SIX_CITIES, 24),
    getTotalTransactions(),
  ])

  const latestDate = cityStats?.[0]?.stat_date ?? '—'

  // Group city stats by city
  const byCity = {}
  for (const row of cityStats ?? []) {
    if (!byCity[row.district]) byCity[row.district] = {}
    byCity[row.district][row.is_presale === 1 ? 'presale' : 'existing'] = row
  }

  // National totals from latest stats
  const totalExisting = cityStats
    ?.filter(r => r.is_presale === 0)
    .reduce((s, r) => s + (r.total_transactions ?? 0), 0) ?? 0
  const totalPresale = cityStats
    ?.filter(r => r.is_presale === 1)
    .reduce((s, r) => s + (r.total_transactions ?? 0), 0) ?? 0

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
            資料更新至 {latestDate}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            台灣房市<span className="text-brand-400">即時行情</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            整合內政部實價登錄，{(totalTx ?? 0).toLocaleString()} 筆真實成交資料，每日自動更新。
          </p>

          {/* Hero stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: '累積成交筆數', value: (totalTx ?? 0).toLocaleString(), unit: '筆' },
              { label: '涵擋縣市', value: '22', unit: '個' },
              { label: '本期六都成屋', value: totalExisting.toLocaleString(), unit: '筆' },
              { label: '本期六都預售', value: totalPresale.toLocaleString(), unit: '筆' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <div className="text-2xl font-extrabold">{s.value}<span className="text-sm font-normal ml-1 text-slate-300">{s.unit}</span></div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Six Cities ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">六都最新行情</h2>
            <p className="text-sm text-slate-500 mt-1">資料週期：{latestDate}</p>
          </div>
          <a href="/market" className="text-sm text-brand-600 font-semibold hover:underline">
            查看全台 →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIX_CITIES.map(city => (
            <CityCard
              key={city}
              city={city}
              existing={byCity[city]?.existing}
              presale={byCity[city]?.presale}
            />
          ))}
        </div>
      </section>

      {/* ── Price Trend ─────────────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">六都成屋均價走勢（近 24 個月）</h2>
            <p className="text-sm text-slate-500 mt-1">單位：萬元/坪，資料來源：內政部實價登錄</p>
          </div>
          <PriceTrendChart data={trendData ?? []} type={0} />
        </div>
      </section>

      {/* ── Presale Trend ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">六都預售均價走勢（近 24 個月）</h2>
          <p className="text-sm text-slate-500 mt-1">單位：萬元/坪，資料來源：內政部實價登錄</p>
        </div>
        <PriceTrendChart data={trendData ?? []} type={1} />
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-600 py-14 px-4 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-3">想深入了解特定縣市？</h2>
        <p className="text-brand-100 mb-6">查看全台 22 縣市詳細成交數據與年增率分析</p>
        <a
          href="/market"
          className="inline-block bg-white text-brand-700 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition"
        >
          前往各縣市行情 →
        </a>
      </section>
    </>
  )
}
