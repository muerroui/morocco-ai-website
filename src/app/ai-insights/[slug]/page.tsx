import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity'
import { getAllArticles, getArticleBySlug } from '@/lib/queries'
import type { Article, PortableTextBlock } from '@/lib/types'
import { urlFor, formatDate } from '@/lib/image'

export const revalidate = 3600

export async function generateStaticParams() {
  const articles = await client.fetch<Article[]>(getAllArticles)
  return articles.map((a) => ({ slug: a.slug.current }))
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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
    <div className="space-y-5">
      {blocks.map((block) => {
        if (block._type === 'image' && block.asset) {
          return (
            <div key={block._key} className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden my-8 border border-bone/[0.06]">
              <Image src={urlFor({ _type: 'image', asset: block.asset }).url()} alt="" fill className="object-cover" unoptimized />
            </div>
          )
        }
        if (block._type !== 'block') return null
        const children = block.children?.map((child, i) => {
          let node: React.ReactNode = child.text
          if (child.marks?.includes('strong')) node = <strong key={i} className="text-bone/90 font-semibold">{node}</strong>
          if (child.marks?.includes('em'))     node = <em     key={i} className="italic">{node}</em>
          if (child.marks?.includes('code'))   node = <code   key={i} className="bg-navy/15 text-bone/80 px-1.5 py-0.5 rounded text-sm font-mono">{node}</code>
          return <span key={child._key}>{node}</span>
        }) ?? []

        switch (block.style) {
          case 'h1': return <h2 key={block._key} className="text-display-md text-bone mt-12 mb-4">{children}</h2>
          case 'h2': return <h3 key={block._key} className="font-display font-light text-bone text-3xl mt-10 mb-4" style={{ letterSpacing: '-0.02em' }}>{children}</h3>
          case 'h3': return <h4 key={block._key} className="font-semibold text-bone text-xl mt-8 mb-3">{children}</h4>
          case 'h4': return <h5 key={block._key} className="font-semibold text-bone/80 text-lg mt-6 mb-2">{children}</h5>
          case 'blockquote':
            return (
              <blockquote key={block._key} className="border-s-2 border-red/40 ps-6 my-6 text-bone/52 italic">
                {children}
              </blockquote>
            )
          default:
            if (!block.children?.some((c) => c.text)) return null
            return <p key={block._key} className="text-bone/52 leading-relaxed">{children}</p>
        }
      })}
    </div>
  )
}

export default async function ArticleDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
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
    <div className="bg-ink min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-40">
        <Link href="/ai-insights"
          className="inline-flex items-center gap-2 text-bone/32 hover:text-bone/65 transition-colors text-xs font-semibold tracking-[0.15em] uppercase mb-12">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          AI Insights
        </Link>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span key={tag} className="text-label text-[0.58rem] px-2.5 py-1 rounded-full border border-red/25 text-red/75">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-display-md text-bone mb-5 leading-tight">{article.title}</h1>

        <div className="flex items-center gap-4 text-bone/28 text-sm mb-12">
          {article.author && <span className="font-medium text-bone/45">{article.author}</span>}
          {article.author && article.publishedAt && <span className="w-0.5 h-0.5 rounded-full bg-bone/20" />}
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
        </div>

        {article.mainImage && (
          <div className="relative h-64 sm:h-[420px] w-full rounded-2xl overflow-hidden mb-12 border border-bone/[0.06]">
            <Image src={urlFor(article.mainImage).url()} alt={article.title}
              fill sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover" unoptimized priority />
          </div>
        )}

        {article.body && article.body.length > 0 ? (
          <BlockContent blocks={article.body} />
        ) : (
          <p className="text-bone/28 italic">Article content coming soon.</p>
        )}
      </div>

      {related.length > 0 && (
        <div className="border-t border-bone/[0.05] py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <p className="text-label text-bone/35 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-red inline-block" />Related
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((a) => (
                <Link key={a._id} href={`/ai-insights/${a.slug.current}`}
                  className="group bg-[#111114] border border-bone/[0.06] hover:border-bone/14 rounded-2xl p-6 transition-all duration-300">
                  <h3 className="text-bone/72 text-sm font-semibold leading-snug group-hover:text-bone/90 transition-colors mb-2">
                    {a.title}
                  </h3>
                  <p className="text-bone/22 text-xs">{a.author}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}