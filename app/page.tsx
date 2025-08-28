import Link from "next/link";
import { client, urlFor } from "../lib/sanity.client";
import { featuredKnowledgeBaseArticlesQuery, topKnowledgeBaseArticlesQuery, featuredCaseStudiesGroupedBySeriesQuery, caseStudiesGroupedBySeriesQuery, knowledgeBaseArticlesQuery } from "../lib/queries";
import type { Image } from 'sanity';

interface CaseStudy {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  coverImage: Image;
  summary: string;
}

interface CaseStudyGroups {
  dfm: CaseStudy[];
  qc: CaseStudy[];
  'design-packaging': CaseStudy[];
}

interface KnowledgeBaseArticle {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  summary: string;
  readCount?: number;
}

const seriesConfig = {
  dfm: {
    title: 'DFM Solutions',
    description: 'Design for Manufacturing excellence through our global manufacturing network',
    icon: '⚙️',
    color: 'blue'
  },
  qc: {
    title: 'Quality Control Systems', 
    description: 'World-class quality frameworks implemented across our vetted supply chain',
    icon: '🔬',
    color: 'green'
  },
  'design-packaging': {
    title: 'Design & Packaging Solutions',
    description: 'Innovative design and packaging strategies from world-class manufacturing facilities',
    icon: '📦',
    color: 'purple'
  }
};

async function getCaseStudiesByGroup() {
  // First try to get featured case studies, if none exist, get all case studies
  const featuredCaseStudyGroups = await client.fetch(featuredCaseStudiesGroupedBySeriesQuery);
  
  // Check if we have any featured case studies
  const hasFeatured = Object.values(featuredCaseStudyGroups).some((series: CaseStudy[]) => series.length > 0);
  
  if (hasFeatured) {
    return featuredCaseStudyGroups;
  }
  
  // Fallback to all case studies grouped by series
  return await client.fetch(caseStudiesGroupedBySeriesQuery);
}

async function getKnowledgeBaseArticles() {
  // First try to get featured articles, if none exist, get top read articles
  const featuredArticles = await client.fetch(featuredKnowledgeBaseArticlesQuery);
  if (featuredArticles.length > 0) {
    return featuredArticles;
  }
  return await client.fetch(topKnowledgeBaseArticlesQuery);
}

export default async function Home() {
  const caseStudyGroups: CaseStudyGroups = await getCaseStudiesByGroup();
  const articles: KnowledgeBaseArticle[] = await getKnowledgeBaseArticles();

  return (
    <main className="flex-1">
      <section id="hero-section" className="relative w-full py-16 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-200/60 dark:bg-grid-slate-800/40 bg-[size:20px_20px] [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 dark:bg-blue-800/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200/30 dark:bg-indigo-800/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_600px] items-center">
            <div className="flex flex-col justify-center space-y-8">
              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Trusted by Global Hardware Engineering Teams</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-gray-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent leading-tight">
                  Precision Manufacturing
                  <span className="block text-blue-600 dark:text-blue-400 text-3xl sm:text-5xl xl:text-6xl mt-2">
                    Engineered to Perfection
                  </span>
                </h1>
                <p className="max-w-[600px] text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Transform complex design challenges into flawless reality through our global manufacturing network. We orchestrate world-class manufacturing facilities to deliver precision-engineered components with guaranteed quality.
                </p>
              </div>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>±0.005mm Tolerance</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>ISO 9001 Certified</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>7-14 Day Delivery</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link
                  href="/submit-project"
                  className="group relative inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <span className="relative z-10">Get Custom Quote</span>
                  <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#case-studies-section"
                  className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-8 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:border-gray-600"
                >
                  View Case Studies
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur-2xl scale-110"></div>
                
                <img
                  src="/Hero.png"
                  width="600"
                  height="400"
                  alt="Precision Manufacturing Components"
                  className="relative z-10 w-full h-auto rounded-2xl shadow-2xl object-cover border border-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="case-studies-section" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Case Studies
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-gray-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent leading-relaxed pb-2">
              Engineering Excellence in Action
            </h2>
            <p className="max-w-3xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mx-auto text-center mt-6 leading-relaxed">
              Discover how our vetted supply chain and world-class manufacturing facilities transform complex engineering challenges into precision solutions that exceed expectations.
            </p>
          </div>
          
          {/* Check if we have any case studies at all */}
          {Object.values(caseStudyGroups).every((series: CaseStudy[]) => series.length === 0) ? (
            <div className="text-center py-16">
              <div className="max-w-lg mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Case Studies Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  We're preparing comprehensive case studies showcasing our manufacturing excellence. Please check back soon or contact us directly for project examples.
                </p>
                <Link
                  href="/submit-project"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Start Your Project
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(seriesConfig).map(([seriesKey, config]) => {
                const series = caseStudyGroups[seriesKey as keyof CaseStudyGroups] || [];
                if (series.length === 0) return null;
                
                return (
                  <div key={seriesKey} className="space-y-8">
                    {/* Series Header */}
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${
                        config.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                        config.color === 'green' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                        'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      } text-lg font-semibold mb-4`}>
                        <span className="text-2xl">{config.icon}</span>
                        <span>{config.title}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {config.description}
                      </p>
                    </div>
                    
                    {/* Series Cases Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {series.slice(0, 3).map((caseStudy, index) => (
                        <Link key={caseStudy._id} href={`/case-studies/${caseStudy.slug.current}`}>
                          <div className={`group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 ${
                            config.color === 'blue' ? 'hover:border-blue-200 dark:hover:border-blue-800' :
                            config.color === 'green' ? 'hover:border-green-200 dark:hover:border-green-800' :
                            'hover:border-purple-200 dark:hover:border-purple-800'
                          }`}>
                            {/* Image Container */}
                            <div className="relative overflow-hidden">
                              <div className="aspect-[16/10] overflow-hidden">
                                {caseStudy.coverImage && caseStudy.coverImage.asset ? (
                                  <img 
                                    src={urlFor(caseStudy.coverImage).width(600).height(400).url()} 
                                    alt={caseStudy.title} 
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                      <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                      </svg>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Case Study</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {/* Overlay Gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              
                              {/* Series Badge */}
                              <div className={`absolute top-4 left-4 ${
                                config.color === 'blue' ? 'bg-blue-600/90' :
                                config.color === 'green' ? 'bg-green-600/90' :
                                'bg-purple-600/90'
                              } backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full`}>
                                #{String(index + 1).padStart(2, '0')}
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 space-y-4">
                              <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors line-clamp-2 ${
                                config.color === 'blue' ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400' :
                                config.color === 'green' ? 'group-hover:text-green-600 dark:group-hover:text-green-400' :
                                'group-hover:text-purple-600 dark:group-hover:text-purple-400'
                              }`}>
                                {caseStudy.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                                {caseStudy.summary}
                              </p>
                              
                              {/* Read More Link */}
                              <div className={`flex items-center gap-2 font-medium text-sm pt-2 ${
                                config.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                config.color === 'green' ? 'text-green-600 dark:text-green-400' :
                                'text-purple-600 dark:text-purple-400'
                              }`}>
                                <span className="group-hover:translate-x-1 transition-transform">View Details</span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Hover Border Glow */}
                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                              config.color === 'blue' ? 'bg-gradient-to-r from-blue-400/10 to-indigo-400/10' :
                              config.color === 'green' ? 'bg-gradient-to-r from-green-400/10 to-emerald-400/10' :
                              'bg-gradient-to-r from-purple-400/10 to-pink-400/10'
                            }`}></div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {/* View All Series Link */}
                    {series.length > 3 && (
                      <div className="text-center">
                        <Link
                          href={`/case-studies?series=${seriesKey}`}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold hover:bg-opacity-10 transition-all duration-200 ${
                            config.color === 'blue' ? 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600' :
                            config.color === 'green' ? 'border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-600' :
                            'border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-600'
                          }`}
                        >
                          View All {config.title}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            
              {/* View All CTA */}
              <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Explore All Case Studies
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="knowledge-base-section" className="w-full py-16 md:py-24 lg:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Technical Resources
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent leading-relaxed pb-2">
              Expert Knowledge Hub
            </h2>
            <p className="max-w-3xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mx-auto text-center mt-6 leading-relaxed">
              Deep technical insights from our global manufacturing network to accelerate your product development across world-class facilities.
            </p>
          </div>
          
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-lg mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Knowledge Articles Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  We're preparing comprehensive technical resources and manufacturing insights. Please check back soon or contact us for specific technical questions.
                </p>
                <a 
                  href="mailto:dshimiga@hotmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Contact Our Experts
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <Link key={article._id} href={`/knowledge-base/${article.slug.current}`}>
                    <article className="group relative bg-gradient-to-br from-white via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 h-full">
                      {/* Content */}
                      <div className="p-8 space-y-6 h-full flex flex-col">
                        {/* Article Type Badge */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Article #{String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="flex-grow space-y-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                            {article.summary}
                          </p>
                        </div>
                        
                        {/* Read More Link */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                            <span className="group-hover:translate-x-1 transition-transform">Read Article</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                          
                          {/* Reading Time Estimate */}
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            5 min read
                          </span>
                        </div>
                      </div>
                      
                      {/* Hover Gradient Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                      
                      {/* Corner Accent */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-200/20 dark:from-indigo-800/20 to-transparent rounded-2xl"></div>
                    </article>
                  </Link>
                ))}
              </div>
              
              {/* View All CTA */}
              <div className="text-center mt-16">
                <Link
                  href="/knowledge-base"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <span>Explore All Resources</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}