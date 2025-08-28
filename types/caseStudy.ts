export interface Slug { current: string }


export interface SanityImage {
_type: 'image'
asset?: {
_ref?: string
_type?: 'reference'
url?: string
_id?: string
metadata?: {
lqip?: string
dimensions?: { width: number; height: number; aspectRatio: number }
palette?: any
}
}
alt?: string
caption?: string
}


export interface SanityFile {
_type: 'file'
asset?: {
_ref?: string
_type?: 'reference'
url?: string
originalFilename?: string
_id?: string
}
}


export interface ReferenceLite {
_id: string
title: string
slug?: { current: string } | string
}


export interface Metric {
label: string
value: string | number
}


export interface ProcessStep {
_key?: string
title: string
description?: string
}


export interface Timeline {
start?: string
end?: string
}


export interface SEO {
title?: string
description?: string
image?: SanityImage
}


export interface CaseStudy {
_id: string
_type: 'caseStudy'
title: string
slug: Slug
excerpt?: string
overview?: string
heroImage?: SanityImage
gallery?: SanityImage[]
metrics?: Metric[]
processSteps?: ProcessStep[]
client?: string
industry?: string
services?: string[]
timeline?: Timeline
outcome?: string
content?: any[]
relatedProcesses?: ReferenceLite[]
relatedCaseStudies?: ReferenceLite[]
file?: SanityFile
seo?: SEO
publishedAt?: string
}