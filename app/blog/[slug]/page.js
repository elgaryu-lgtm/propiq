import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('reports')
    .select('title, summary')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle()

  if (!data) return { title: '找不到文章 | PropIQ' }
  return {
    title: `${data.title} | PropIQ`,
    description: data.summary ?? '',
  }
}

export default async function BlogPostPage({ params }) {
  const { data: post } = await supabase
    .from('reports')
    .select('id, title, slug, content, summary, city, published_at, created_at')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle()

  if (!post) notFound()

  const date = new Date(post.published_at ?? post.created_at).toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blog" className="text-sm text-sky-600 hover:underline mb-6 inline-block">
        ← 返回房市分析
      </Link>

      <article>
        <header className="mb-8">
          {post.city && (
            <span className="inline-block text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full mb-3">
              {post.city}
            </span>
          )}
          <h1 className="text-3xl font-extrabold text-slate-800 mb-3">{post.title}</h1>
          {post.summary && (
            <p className="text-slate-500 text-lg leading-relaxed mb-4">{post.summary}</p>
          )}
          <time className="text-sm text-slate-400">{date}</time>
        </header>

        <div className="space-y-4 text-slate-700 leading-relaxed">
          {post.content
            ? post.content.split('\n').map((line, i) => (
                line.trim() === ''
                  ? <br key={i} />
                  : <p key={i} className="mb-4 text-slate-700 leading-relaxed">{line}</p>
              ))
            : <p className="text-slate-400">（本文內容暫未提供）</p>
          }
        </div>
      </article>
    </div>
  )
}
