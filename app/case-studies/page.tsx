import { client } from '../../lib/sanity.client';
import { caseStudiesGroupedBySeriesQuery } from '../../lib/queries';
import Link from 'next/link';

interface CaseStudy {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: { asset?: { url?: string } };
  summary: string;
}

interface GroupedCaseStudies {
  dfm: CaseStudy[];
  qc: CaseStudy[];
  'design-packaging': CaseStudy[];
}

const seriesInfo = {
  dfm: {
    title: 'DFM Solutions',
    description: 'Design for Manufacturing optimization case studies'
  },
  qc: {
    title: 'Quality Control Systems',
    description: 'Advanced quality assurance and control implementations'
  },
  'design-packaging': {
    title: 'Design & Packaging Solutions',
    description: 'Innovative design and packaging engineering solutions'
  }
};

export default async function CaseStudiesPage() {
  const caseStudies: GroupedCaseStudies = await client.fetch(caseStudiesGroupedBySeriesQuery);

  // Get available series for navigation
  const availableSeries = Object.entries(seriesInfo).filter(([key]) => {
    const studies = caseStudies[key as keyof GroupedCaseStudies];
    return studies && studies.length > 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Navigation Bar */}
      {availableSeries.length > 1 && (
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-4">
              <nav className="flex space-x-8">
                <span className="text-sm font-medium text-gray-500 mr-4">Quick Jump:</span>
                {availableSeries.map(([seriesKey, info]) => (
                  <a
                    key={seriesKey}
                    href={`#${seriesKey}-section`}
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    {seriesKey === 'dfm' ? (
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    ) : seriesKey === 'qc' ? (
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    )}
                    {info.title}
                  </a>
                ))}
                <a
                  href="#top"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 ml-8"
                >
                  ↑ Top
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="top" className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive portfolio of engineering solutions across three key areas: 
            Design for Manufacturing, Quality Control Systems, and Design & Packaging Solutions.
          </p>
        </div>

        {Object.entries(seriesInfo).map(([seriesKey, info]) => {
          const studies = caseStudies[seriesKey as keyof GroupedCaseStudies];
          
          if (!studies || studies.length === 0) return null;

          return (
            <div key={seriesKey} id={`${seriesKey}-section`} className="mb-16 scroll-mt-20">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {seriesKey === 'dfm' ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : seriesKey === 'qc' ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <h2 className="text-3xl font-bold text-gray-900">{info.title}</h2>
                </div>
                <p className="text-lg text-gray-600">{info.description}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {studies.map((study) => (
                  <Link
                    key={study._id}
                    href={`/case-studies/${study.slug.current}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="relative h-48 w-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        {seriesKey === 'dfm' ? (
                          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : seriesKey === 'qc' ? (
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 font-medium">{info.title}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {study.title}
                      </h3>
                      <p className="text-gray-600">
                        {study.summary}
                      </p>
                      <div className="mt-4">
                        <span className="text-blue-600 font-medium hover:text-blue-700">
                          Read Case Study →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {(!caseStudies.dfm?.length && !caseStudies.qc?.length && !caseStudies['design-packaging']?.length) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No case studies available at the moment.</p>
          </div>
        )}
      </div>

      {/* Floating Back to Top Button */}
      <a
        href="#top"
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        aria-label="Back to top"
      >
        <svg 
          className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </a>
    </div>
  );
}