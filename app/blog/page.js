import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 3600

export const metadata = {
  title: '房市分析 | PropIQ',
  description: '專業房市分析文章，涵擋各縣市價格趨勢、建案評析與投資觀察。',
}

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(20)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800">房市分析</h1>
        <p className="text-slate-500 mt-2">深入解讀台灣房市數據，掌握趨勢先機</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold text-slate-800 hover:text-brand-600 transition-colors mb-2">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && (
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{post.excerpt}</p>
              )}
              <time className="text-xs text-slate-400">
                {new Date(post.published_at ?? post.created_at).toLocaleDateString('zh-TW', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </time>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-lg font-medium">文章即將上線</p>
          <p className="text-sm mt-2">我們正在準備第一批房市分析文章，敬請期待。</p>
        </div>
      )}
    </div>
  )
}
