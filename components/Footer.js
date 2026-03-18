export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-extrabold mb-2">
              <span className="text-brand-400">Prop</span>
              <span className="text-white">IQ</span>
            </div>
            <p className="text-sm leading-relaxed">
              整合內政部實價登錄資料，<br/>
              每日自動更新，讓你掌握最即時的台灣房市行情。
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">功能</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">市場總覽</a></li>
              <li><a href="/market" className="hover:text-white transition-colors">各縣市行情</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">房市分析</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">資料來源</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://plvr.land.moi.gov.tw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">內政部實價登錄</a></li>
            </ul>
            <p className="text-xs mt-4">資料僅供參考，不構成投資建議。</p>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-6 text-xs text-center">
          © {new Date().getFullYear()} PropIQ. 資料來源：內政部不動產交易實際資訊資料庫。
        </div>
      </div>
    </footer>
  )
}
