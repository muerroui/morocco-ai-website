import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity'
import { getAllArticles, getArticleBySlug } from '@/lib/queries'
import type { Article, PortableTextBlock } from '@/lib/types'
import { urlFor, formatDate } from '@/lib/image'
import ArticleCard from '@/components/ArticleCard'

export const revalidate = 3600

export async function generateStaticParams() {
  const articles = await client.fetch<Article[]>(getAllArticles)
  return articles.map((a) => ({ slug: a.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await client.fetch<Article>(getArticleBySlug, { slug })
  if (!article) return { title: 'Article Not Found' }
  return {
    title: article.title,
    description: `By ${article.author ?? 'Morocco.AI'} — ${article.publishedAt ? formatDate(article.publishedAt) : ''}`,
  }
}

function BlockContent({ blocks }: { blocks: PortableTextBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        if (block._type === 'image' && block.asset) {
          return (
            <div key={block._key} className="relative h-64 sm:h-96 w-full rounded-xl overflow-hidden my-6">
              <Image
                src={urlFor({ _type: 'image', asset: block.asset }).width(900).url()}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )
        }

        if (block._type !== 'block') return null

        const children = block.children?.map((child, i) => {
          let node: React.ReactNode = child.text
          if (child.marks?.includes('strong')) node = <strong key={i}>{node}</strong>
          if (child.marks?.includes('em')) node = <em key={i}>{node}</em>
          if (child.marks?.includes('code')) node = <code key={i} className="bg-gray-100 text-red px-1 py-0.5 rounded text-sm font-mono">{node}</code>
          return <span key={child._key}>{node}</span>
        }) ?? []

        switch (block.style) {
          case 'h1': return <h1 key={block._key} className="text-3xl font-extrabold text-navy mt-8 mb-3">{children}</h1>
          case 'h2': return <h2 key={block._key} className="text-2xl font-bold text-navy mt-8 mb-3">{children}</h2>
          case 'h3': return <h3 key={block._key} className="text-xl font-bold text-navy mt-6 mb-2">{children}</h3>
          case 'h4': return <h4 key={block._key} className="text-lg font-semibold text-navy mt-4 mb-2">{children}</h4>
          case 'blockquote':
            return (
              <blockquote key={block._key} className="border-l-4 border-navy pl-5 italic text-gray-500 my-4">
                {children}
              </blockquote>
            )
          case 'normal':
          default:
            if (!block.children?.some((c) => c.text)) return null
            return (
              <p key={block._key} className="text-gray-700 leading-relaxed">
                {children}
              </p>
            )
        }
      })}
    </div>
  )
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [article, allArticles] = await Promise.all([
    client.fetch<Article>(getArticleBySlug, { slug }),
    client.fetch<Article[]>(getAllArticles),
  ])
  if (!article) notFound()

  const related = allArticles
    .filter((a) => a._id !== article._id && a.tags?.some((t) => article.tags?.includes(t)))
    .slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <Link href="/ai-insights" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        AI Insights
      </Link>

      <div className="max-w-3xl">
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs bg-red-tint text-red px-3 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight mb-4">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-400 mb-8">
          {article.author && <span className="font-medium text-gray-600">{article.author}</span>}
          {article.author && article.publishedAt && <span>·</span>}
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
        </div>

        {article.mainImage && (
          <div className="relative h-64 sm:h-[420px] w-full rounded-2xl overflow-hidden mb-10">
            <Image
              src={urlFor(article.mainImage).width(900).height(500).url()}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {article.body && article.body.length > 0 ? (
          <BlockContent blocks={article.body} />
        ) : (
          <p className="text-gray-500 italic">Article content coming soon.</p>
        )}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="mt-20 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-navy mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
