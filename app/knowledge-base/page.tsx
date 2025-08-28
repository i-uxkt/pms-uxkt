import { client } from '../../lib/sanity.client';
import { knowledgeBaseArticlesQuery } from '../../lib/queries';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
}

export default async function KnowledgeBasePage() {
  const articles: Article[] = await client.fetch(knowledgeBaseArticlesQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Knowledge Base</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive engineering guides and technical insights to help you make informed decisions 
            in precision manufacturing and CNC machining projects.
          </p>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/knowledge-base/${article.slug.current}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {article.summary}
                </p>
                <div className="flex items-center text-blue-600 font-medium hover:text-blue-700">
                  <span>Read Article</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-500">Knowledge base articles are being updated. Please check back soon.</p>
            </div>
          </div>
        )}

        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Custom Engineering Support?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find the information you're looking for? Our engineering team is ready to provide 
              personalized technical guidance for your specific manufacturing challenges.
            </p>
            <Link 
              href="/submit-project"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Get Engineering Support
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}