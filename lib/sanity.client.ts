import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';


const projectId = process.env.SANITY_PROJECT_ID as string;
const dataset = process.env.SANITY_DATASET as string;
const apiVersion = (process.env.SANITY_API_VERSION as string) || '2024-05-01';


export const client = createClient({
projectId,
dataset,
apiVersion,
useCdn: process.env.NODE_ENV === 'production',
perspective: 'published',
});


const builder = imageUrlBuilder({ projectId, dataset });


export function urlFor(source: Image | any) {
return builder.image(source);
}