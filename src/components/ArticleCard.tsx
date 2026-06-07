import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/types'
import { urlFor, formatDate } from '@/lib/image'

export default function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex ${
        featured ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      <div className={`relative bg-navy-tint overflow-hidden shrink-0 ${featured ? 'h-56 md:h-auto md:w-96' : 'h-48'}`}>
        {article.mainImage ? (
          <Image
            src={urlFor(article.mainImage).url()}
            alt={article.title}
            fill
            sizes={featured ? '(max-width: 768px) 100vw, 384px' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-10 h-10 text-navy opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>

      <div className={`p-5 flex flex-col flex-1 ${featured ? 'md:p-8' : ''}`}>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-red-tint text-red px-2 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className={`font-bold text-navy leading-snug mb-2 line-clamp-2 ${featured ? 'text-xl md:text-2xl' : 'text-base'}`}>
          {article.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          {article.author && <span className="font-medium text-gray-500">{article.author}</span>}
          {article.author && article.publishedAt && <span>·</span>}
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
        </div>

        <Link
          href={`/ai-insights/${article.slug.current}`}
          className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-navy-light transition-colors"
        >
          Read more
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
