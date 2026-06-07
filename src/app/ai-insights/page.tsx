import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { getAllArticles } from '@/lib/queries'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'AI Insights',
  description: 'Articles, research summaries, and perspectives on AI from the Morocco.AI community.',
}

export default async function AIInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const articles = await client.fetch<Article[]>(getAllArticles)

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags ?? [])))

  const filtered = tag ? articles.filter((a) => a.tags?.includes(tag)) : articles
  const [featured, ...rest] = filtered

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <p className="text-sm font-semibold text-red uppercase tracking-widest mb-2">Knowledge Hub</p>
        <h1 className="text-4xl font-extrabold text-navy mb-3">AI Insights</h1>
        <p className="text-gray-500 max-w-xl">
          Research summaries, tutorials, opinion pieces, and perspectives from Morocco.AI contributors.
        </p>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <a
            href="/ai-insights"
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              !tag
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy'
            }`}
          >
            All
          </a>
          {allTags.map((t) => (
            <a
              key={t}
              href={`/ai-insights?tag=${encodeURIComponent(t)}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                tag === t
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy'
              }`}
            >
              {t}
            </a>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No articles found{tag ? ` for "${tag}"` : ''}.</p>
          {tag && (
            <a href="/ai-insights" className="mt-4 inline-block text-navy font-semibold hover:underline">
              View all articles
            </a>
          )}
        </div>
      ) : (
        <>
          {/* Featured article */}
          {featured && !tag && (
            <div className="mb-10">
              <ArticleCard article={featured} featured />
            </div>
          )}

          {/* Grid */}
          {rest.length > 0 || tag ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(tag ? filtered : rest).map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
