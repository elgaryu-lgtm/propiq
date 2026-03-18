'use client'
import { useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const SIX_CITIES = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市']
const ALL_CITIES = [
  '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市',
  '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '臺東縣', '澎湖縣', '金門縣', '連江縣',
]

const PAGE_SIZE = 50

export default function SearchPage() {
  const [city, setCity] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isPresale, setIsPresale] = useState('')
  const [results, setResults] = useState(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (pageNum = 0) => {
    if (!city && !keyword) {
      setError('請至少輸入縣市或關鍵字')
      return
    }
    setLoading(true)
    setError(null)
    const offset = pageNum * PAGE_SIZE

    let query = supabase
      .from('transactions')
      .select('id, district, tx_date_iso, is_presale, building_type, floor_area_m2, unit_price_ping, total_price_wan, address, project_name, floor, total_floors', { count: 'exact' })
      .order('tx_date_iso', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (city) query = query.eq('district', city)
    if (keyword) query = query.or(`project_name.ilike.%${keyword}%,address.ilike.%${keyword}%`)
    if (isPresale !== '') query = query.eq('is_presale', parseInt(isPresale))

    const { data, count, error: qErr } = await query
    setLoading(false)
    if (qErr) { setError(qErr.message); return }
    setResults(data)
    setTotal(count ?? 0)
    setPage(pageNum)
    setSearched(true)
  }, [city, keyword, isPresale])

  const handleSubmit = (e) => {
    e.preventDefault()
    doSearch(0)
  }

  function formatDate(d) {
    if (!d) return '—'
    const s = String(d)
    if (s.length === 10) return `${s.slice(0, 4)}-${s.slice(5, 7)}`
    return s.slice(0, 7)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">🔍 個案搜尋</h1>
        <p className="text-slate-500 mt-2 text-sm">
          依縣市、案名或地址搜尋個別成交資料，資料來源：內政部實價登錄
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              縣市
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
            >
              <option value="">全部縣市</option>
              <optgroup label="六都">
                {SIX_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label="其他縣市">
                {ALL_CITIES.filter(c => !SIX_CITIES.includes(c)).map(c =>
                  <option key={c} value={c}>{c}</option>
                )}
              </optgroup>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              類型
            </label>
            <select
              value={isPresale}
              onChange={e => setIsPresale(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
            >
              <option value="">成屋＋預售</option>
              <option value="0">成屋</option>
              <option value="1">預售屋</option>
            </select>
          </div>

          {/* Keyword */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              案名 / 地址關鍵字
            </label>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="例：新莊 / 信義計畫 / 大直"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 placeholder-slate-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50 text-sm"
        >
          {loading ? '搜尋中…' : '搜尋'}
        </button>
      </form>

      {/* Results */}
      {searched && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">
              共找到 <span className="font-bold text-slate-800">{total.toLocaleString()}</span> 筆資料
              {total > PAGE_SIZE && `，目前顯示第 ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} 筆`}
            </p>
            {totalPages > 1 && (
              <div className="flex gap-2 text-sm">
                <button
                  disabled={page === 0}
                  onClick={() => doSearch(page - 1)}
                  className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                >← 上一頁</button>
                <span className="px-3 py-1 text-slate-500">{page + 1} / {totalPages}</span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => doSearch(page + 1)}
                  className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                >下一頁 →</button>
              </div>
            )}
          </div>

          {results?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-500">沒有找到符合條件的成交資料，請嘗試調整搜尋條件</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4 text-left">縣市</th>
                      <th className="py-3 px-4 text-left">成交日期</th>
                      <th className="py-3 px-4 text-left">類型</th>
                      <th className="py-3 px-4 text-left">案名 / 地址</th>
                      <th className="py-3 px-4 text-right">樓層</th>
                      <th className="py-3 px-4 text-right">面積(m²)</th>
                      <th className="py-3 px-4 text-right">單價(萬/坪)</th>
                      <th className="py-3 px-4 text-right">總價(萬)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((r, i) => (
                      <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${i < 6 ? 'font-medium' : ''}`}>
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.district}</td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{formatDate(r.tx_date_iso)}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {r.is_presale === 1
                            ? <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">預售</span>
                            : <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">成屋</span>
                          }
                        </td>
                        <td className="py-3 px-4 text-slate-800 max-w-xs">
                          {r.project_name
                            ? <><span className="font-semibold">{r.project_name}</span><br/><span className="text-xs text-slate-400">{r.address}</span></>
                            : <span className="text-slate-600">{r.address ?? '—'}</span>
                          }
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600 whitespace-nowrap">
                          {r.floor && r.total_floors ? `${r.floor}/${r.total_floors}F` : r.floor ?? '—'}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-700">
                          {r.floor_area_m2 != null ? r.floor_area_m2.toFixed(1) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-brand-700">
                          {r.unit_price_ping != null ? r.unit_price_ping.toFixed(1) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-700">
                          {r.total_price_wan != null ? r.total_price_wan.toFixed(0) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 text-sm">
              <button
                disabled={page === 0}
                onClick={() => doSearch(page - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >← 上一頁</button>
              <span className="px-4 py-2 text-slate-500">第 {page + 1} 頁 / 共 {totalPages} 頁</span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => doSearch(page + 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >下一頁 →</button>
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="bg-slate-50 rounded-2xl p-10 text-center border border-dashed border-slate-200">
          <div className="text-4xl mb-3">🏠</div>
          <p className="text-slate-500 text-sm">輸入縣市或案名關鍵字，搜尋個別成交資料</p>
          <p className="text-slate-400 text-xs mt-1">資料共 2,624,378 筆，涵蓋 2011 年至今</p>
        </div>
      )}
    </div>
  )
}
