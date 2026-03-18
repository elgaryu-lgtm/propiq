export default function CityCard({ city, existing, presale }) {
  const yoy = existing ?.yoy_change_pct
  const isUp = yoy >= 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-slate-800 text-lg">{city}</h3>
        {yoy != null && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isUp ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(yoy).toFixed(1)}% YoY
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {existing && (
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">成屋均價</div>
            <div className="text-xl font-extrabold text-slate-800">
              {existing.avg_unit_price?.toFixed(1)}
              <span className="text-sm font-normal text-slate-500 ml-1">萬/坪</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {existing.total_transactions?.toLocaleString()} 筆
            </div>
          </div>
        )}
        {presale && (
          <div className="bg-brand-50 rounded-xl p-3">
            <div className="text-xs text-brand-600 mb-1">預售均價</div>
            <div className="text-xl font-extrabold text-brand-700">
              {presale.avg_unit_price?.toFixed(1)}
              <span className="text-sm font-normal text-brand-500 ml-1">萬/坪</span>
            </div>
            <div className="text-xs text-brand-400 mt-1">
              {presale.total_transactions?.toLocaleString()} 筆
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
