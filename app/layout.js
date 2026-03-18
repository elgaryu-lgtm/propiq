import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'PropIQ — 台灣房市即時行情',
  description: '整合內政部實價登錄資料，提供台灣各縣市最新房價走勢、成交量分析與建案資訊。',
  keywords: ['台灣房價', '實價登錄', '房市分析', '房價走勢', 'PropIQ'],
  openGraph: {
    title: 'PropIQ — 台灣房市即時行情',
    description: '260萬筆真實成交資料，每日自動更新',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
