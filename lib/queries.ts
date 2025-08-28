import { groq } from 'next-sanity';


export const caseStudyPathsQuery = groq`
*[_type == "caseStudy" && defined(slug.current)][]{
"slug": slug.current
}
`;


export const caseStudyBySlugQuery = groq`
*[_type == "caseStudy" && slug.current == $slug][0]{
  _id,
  title,
  series,
  seriesOrder,
  coverImage {
    ...,
    asset->{
      _id,
      url,
      metadata
    }
  },
  summary,
  challenge {
    initialNeed,
    painPoints,
    initialDrawing {
      ...,
      asset->{
        _id,
        url,
        metadata
      }
    }
  },
  solution {
    approach,
    methodology,
    finalSummary
  },
  execution {
    processVisuals[] {
      _type,
      _key,
      asset-> {
        _id,
        url,
        originalFilename
      }
    },
    deliverables[] {
      asset-> {
        _id,
        url,
        originalFilename
      }
    },
    processDescription
  },
  outcome {
    productImages[] {
      ...,
      asset->{
        _id,
        url,
        metadata
      }
    },
    valueComparison,
    testimonial {
      quote,
      author,
      screenshot {
        ...,
        asset->{
          _id,
          url,
          metadata
        }
      }
    }
  },
  relatedProcesses[]->{ _id, title, slug },
  relatedMaterials[]->{ _id, title, slug },
  relatedFinishes[]->{ _id, title, slug },
  relatedIndustries[]->{ _id, title, slug }
}
`;

export const knowledgeBaseArticlePathsQuery = groq`
*[_type == "knowledgebaseArticle" && defined(slug.current)][] {
  "slug": slug.current
}
`;

export const knowledgeBaseArticlesQuery = groq`
*[_type == "knowledgebaseArticle"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  summary
}
`;

export const featuredKnowledgeBaseArticlesQuery = groq`
*[_type == "knowledgebaseArticle" && featuredOnHomepage == true] | order(homepageOrder asc, readCount desc, _createdAt desc) [0...12] {
  _id,
  title,
  slug,
  summary,
  readCount
}
`;

export const topKnowledgeBaseArticlesQuery = groq`
*[_type == "knowledgebaseArticle"] | order(readCount desc, _createdAt desc) [0...12] {
  _id,
  title,
  slug,
  summary,
  readCount
}
`;

export const knowledgeBaseArticleBySlugQuery = groq`
*[_type == "knowledgebaseArticle" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  body
}
`;

export const caseStudiesBySeriesQuery = groq`
*[_type == "caseStudy"] | order(series asc, seriesOrder asc, _createdAt desc) {
  _id,
  title,
  series,
  seriesOrder,
  slug,
  coverImage,
  summary
}
`;

export const caseStudiesGroupedBySeriesQuery = groq`
{
  "dfm": *[_type == "caseStudy" && series == "dfm"] | order(seriesOrder asc, _createdAt desc) {
    _id,
    title,
    slug,
    coverImage,
    summary
  },
  "qc": *[_type == "caseStudy" && series == "qc"] | order(seriesOrder asc, _createdAt desc) {
    _id,
    title,
    slug,
    coverImage,
    summary
  },
  "design-packaging": *[_type == "caseStudy" && series == "design-packaging"] | order(seriesOrder asc, _createdAt desc) {
    _id,
    title,
    slug,
    coverImage,
    summary
  }
}
`;

export const featuredCaseStudiesGroupedBySeriesQuery = groq`
{
  "dfm": *[_type == "caseStudy" && series == "dfm" && featuredOnHomepage == true] | order(homepageOrder asc, seriesOrder asc, _createdAt desc) {
    _id,
    title,
    slug,
    coverImage,
    summary
  },
  "qc": *[_type == "caseStudy" && series == "qc" && featuredOnHomepage == true] | order(homepageOrder asc, seriesOrder asc, _createdAt desc) {
    _id,
    title,
    slug,
    coverImage,
    summary
  },
  "design-packaging": *[_type == "caseStudy" && series == "design-packaging" && featuredOnHomepage == true] | order(homepageOrder asc, seriesOrder asc, _createdAt desc) {
    _id,
    title,
    slug,
    coverImage,
    summary
  }
}
`;