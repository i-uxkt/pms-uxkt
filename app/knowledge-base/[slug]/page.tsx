import { client } from '../../../lib/sanity.client';
import { knowledgeBaseArticlePathsQuery, knowledgeBaseArticleBySlugQuery } from '../../../lib/queries';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { PortableTextBlock } from '@portabletext/types';

interface KnowledgeBaseArticle {
  _id: string;
  title: string;
  slug: { current: string };
  body: PortableTextBlock[];
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(knowledgeBaseArticlePathsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

const PortableTextComponents = {
  block: {
    h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-4xl font-bold my-4">{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-3xl font-bold my-3">{children}</h2>,
    h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-2xl font-bold my-2">{children}</h3>,
    normal: ({ children }: { children: React.ReactNode }) => <p className="my-2 text-gray-700 dark:text-gray-300">{children}</p>,
    blockquote: ({ children }: { children: React.ReactNode }) => <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => <ul className="list-disc list-inside my-2">{children}</ul>,
    number: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal list-inside my-2">{children}</ol>,
  },
  listItem: ({ children }: { children: React.ReactNode }) => <li className="ml-4">{children}</li>,
  marks: {
    link: ({ value, children }: { value?: { href?: string }; children: React.ReactNode }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
  },
};

export default async function KnowledgeBaseArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article: KnowledgeBaseArticle = await client.fetch(knowledgeBaseArticleBySlugQuery, { slug });

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <main className="flex-1">
      <article className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">{article.title}</h1>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
          <PortableText value={article.body} components={PortableTextComponents} />
        </div>
      </article>
    </main>
  );
}