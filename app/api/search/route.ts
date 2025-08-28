import { NextResponse } from 'next/server';
import { client } from '../../../lib/sanity.client';
import { groq } from 'next-sanity';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  // Validate and sanitize search term
  const sanitizedTerm = term.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  if (sanitizedTerm.length < 2 || sanitizedTerm.length > 100) {
    return NextResponse.json({ error: 'Invalid search term' }, { status: 400 });
  }

  // This query searches for the term in the title and summary of both document types
  // and orders the results by a relevance score.
  const query = groq`
    *[_type in ["caseStudy", "knowledgebaseArticle"] && 
      (title match $term + "*" || summary match $term + "*")
    ] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      "type": _type
    }[0...10]`; // Limit to 10 results for performance

  try {
    const results = await client.fetch(query, { term: sanitizedTerm });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
