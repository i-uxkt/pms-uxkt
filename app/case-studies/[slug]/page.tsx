import { client, urlFor } from '../../../lib/sanity.client';
import { caseStudyPathsQuery, caseStudyBySlugQuery } from '../../../lib/queries';
import { PortableText } from '@portabletext/react';
import type { Image as SanityImage } from 'sanity';
import Link from 'next/link';
import { PortableTextBlock } from '@portabletext/types';

// More specific types for our Case Study
interface CaseStudy {
  _id: string;
  title: string;
  coverImage: SanityImage & { alt?: string };
  summary: string; // Plain text
  challenge: {
    initialNeed: PortableTextBlock[];
    painPoints: PortableTextBlock[];
    initialDrawing?: SanityImage & { alt?: string };
  };
  solution: {
    approach: PortableTextBlock[];
    methodology: PortableTextBlock[];
    finalSummary: PortableTextBlock[];
  };
  execution: {
    processVisuals: Array<(SanityImage & { alt?: string; _type: 'image' }) | { _type: 'file'; asset: { url: string; originalFilename: string } }>;
    deliverables?: Array<{ asset: { url: string; originalFilename: string } }>;
    processDescription: PortableTextBlock[];
  };
  outcome: {
    productImages: Array<SanityImage & { alt?: string }>;
    valueComparison: PortableTextBlock[]; // Changed from Array of objects to PortableTextBlock[]
    testimonial?: {
      quote: string;
      author: string;
      screenshot?: SanityImage & { alt?: string };
    };
  };
  relatedProcesses: Array<{ _id: string; title: string; slug: { current: string } }>;
  relatedMaterials: Array<{ _id: string; title: string; slug: { current: string } }>;
  relatedFinishes: Array<{ _id: string; title: string; slug: { current: string } }>;
  relatedIndustries: Array<{ _id: string; title: string; slug: { current: string } }>;
}

// This function generates the static paths for each case study
export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(caseStudyPathsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

// Custom components for rendering Portable Text
const PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage & { alt?: string } }) => (
      value.asset ? (
        <img src={urlFor(value).url()} alt={value.alt || ''} className="my-4 rounded-lg shadow-md" />
      ) : null
    ),
    file: ({ value }: { value: { asset: { url: string, originalFilename: string } } }) => (
      value.asset ? (
        <a
          href={value.asset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Download {value.asset.originalFilename}
        </a>
      ) : null
    ),
  },
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


export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy: CaseStudy = await client.fetch(caseStudyBySlugQuery, { slug });

  if (!caseStudy) {
    return <div>Case study not found.</div>;
  }

  return (
    <main className="flex-1">
      <article className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">{caseStudy.title}</h1>
        </header>

        {caseStudy.coverImage && caseStudy.coverImage.asset && (
          <div className="mb-12">
            <img
              src={urlFor(caseStudy.coverImage).width(1200).height(600).url()}
              alt={caseStudy.coverImage.alt || caseStudy.title}
              className="w-full h-auto rounded-lg object-cover shadow-lg"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
          <section className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 border-b pb-2">Summary</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">{caseStudy.summary}</p>
          </section>

          {caseStudy.challenge && (
            <section className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-4 border-b pb-2">The Challenge</h2>
              <h3 className="text-2xl font-semibold mb-2">Initial Need:</h3>
              <PortableText value={caseStudy.challenge.initialNeed} components={PortableTextComponents} />
              <h3 className="text-2xl font-semibold mb-2 mt-4">Pain Points:</h3>
              <PortableText value={caseStudy.challenge.painPoints} components={PortableTextComponents} />
              {caseStudy.challenge.initialDrawing && caseStudy.challenge.initialDrawing.asset && (
                <div className="mt-4">
                  <h3 className="text-2xl font-semibold mb-2">Initial Drawing:</h3>
                  <img
                    src={urlFor(caseStudy.challenge.initialDrawing).url()}
                    alt={caseStudy.challenge.initialDrawing.alt || 'Initial Drawing'}
                    className="w-full h-auto object-contain rounded-lg border"
                  />
                </div>
              )}
            </section>
          )}

          {caseStudy.solution && (
            <section className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-4 border-b pb-2">Our Solution</h2>
              {caseStudy.solution.approach && (
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold mb-2">Our Approach:</h3>
                  <PortableText value={caseStudy.solution.approach} components={PortableTextComponents} />
                </div>
              )}
              {caseStudy.solution.methodology && (
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold mb-2">Methodology:</h3>
                  <PortableText value={caseStudy.solution.methodology} components={PortableTextComponents} />
                </div>
              )}
              <h3 className="text-2xl font-semibold mb-2 mt-4">Final Summary:</h3>
              <PortableText value={caseStudy.solution.finalSummary} components={PortableTextComponents} />
            </section>
          )}

          {caseStudy.execution && (
            <section className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-4 border-b pb-2">Execution</h2>
              
              {caseStudy.execution.processDescription && (
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Process Description:</h3>
                  <PortableText value={caseStudy.execution.processDescription} components={PortableTextComponents} />
                </div>
              )}
              
              {caseStudy.execution.processVisuals && caseStudy.execution.processVisuals.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold mb-2">Process Visuals:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
                    {caseStudy.execution.processVisuals.filter(visual => visual && visual.asset).map((visual, index) => (
                      visual._type === 'image' ? (
                        <img
                          key={index}
                          src={urlFor(visual).url()}
                          alt={visual.alt || `Process Visual ${index + 1}`}
                          className="w-full h-auto rounded-lg object-cover border"
                        />
                      ) : (
                        <a key={index} href={visual.asset.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Download {visual.asset.originalFilename}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              {caseStudy.execution.deliverables && caseStudy.execution.deliverables.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Key Deliverables:</h3>
                  <div className="space-y-2">
                    {caseStudy.execution.deliverables.filter(deliverable => deliverable && deliverable.asset).map((deliverable, index) => (
                      <a key={index} href={deliverable.asset.url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                        Download {deliverable.asset.originalFilename}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {caseStudy.outcome && (
            <section className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-4 border-b pb-2">Outcome</h2>
              {caseStudy.outcome.productImages && caseStudy.outcome.productImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold mb-2">Product Images:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
                    {caseStudy.outcome.productImages.filter(image => image && image.asset).map((image, index) => (
                      <img
                        key={index}
                        src={urlFor(image).url()}
                        alt={image.alt || `Product Image ${index + 1}`}
                        className="w-full h-auto rounded-lg object-cover border"
                      />
                    ))}
                  </div>
                </div>
              )}
              {caseStudy.outcome.valueComparison && (
                 <div className="mb-4">
                  <h3 className="text-2xl font-semibold mb-2">Value Comparison:</h3>
                  <PortableText value={caseStudy.outcome.valueComparison} components={PortableTextComponents} />
                </div>
              )}
              {caseStudy.outcome.testimonial && caseStudy.outcome.testimonial.quote && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-2xl font-semibold mb-2">Client Testimonial:</h3>
                  <blockquote className="my-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg italic">
                    <p>"{caseStudy.outcome.testimonial.quote}"</p>
                    <cite className="block text-right not-italic mt-2">- {caseStudy.outcome.testimonial.author}</cite>
                  </blockquote>
                  {caseStudy.outcome.testimonial.screenshot && caseStudy.outcome.testimonial.screenshot.asset && (
                     <img
                       src={urlFor(caseStudy.outcome.testimonial.screenshot).url()}
                       alt={caseStudy.outcome.testimonial.screenshot.alt || 'Testimonial Screenshot'}
                       className="w-full h-auto rounded-lg object-cover border mt-4"
                     />
                  )}
                </div>
              )}
            </section>
          )}

          <section className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 border-b pb-2">Project Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {caseStudy.relatedProcesses?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Processes:</h3>
                  <ul className="list-none p-0">
                    {caseStudy.relatedProcesses.map((item) => (
                      <li key={item._id} className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 mb-1">{item.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              {caseStudy.relatedMaterials?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Materials:</h3>
                  <ul className="list-none p-0">
                    {caseStudy.relatedMaterials.map((item) => (
                      <li key={item._id} className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 mb-1">{item.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              {caseStudy.relatedFinishes?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Surface Finishes:</h3>
                  <ul className="list-none p-0">
                    {caseStudy.relatedFinishes.map((item) => (
                      <li key={item._id} className="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 mb-1">{item.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              {caseStudy.relatedIndustries?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Industries:</h3>
                  <ul className="list-none p-0">
                    {caseStudy.relatedIndustries.map((item) => (
                      <li key={item._id} className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300 mb-1">{item.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

        </div>
      </article>
    </main>
  );
}