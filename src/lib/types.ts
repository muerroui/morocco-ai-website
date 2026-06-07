export interface SanitySlug {
  current: string
}

export interface SanityImageAsset {
  _ref: string
  _type: 'reference'
}

export interface SanityImage {
  _type: 'image'
  asset: SanityImageAsset
  hotspot?: { x: number; y: number; height: number; width: number }
  alt?: string
}

export interface Webinar {
  _id: string
  title: string
  slug: SanitySlug
  date: string
  speakerName: string
  speakerBio?: string
  speakerImage?: SanityImage
  description?: string
  youtubeUrl?: string
  tags?: string[]
}

export interface Event {
  _id: string
  title: string
  slug: SanitySlug
  date: string
  location?: string
  description?: string
  image?: SanityImage
  registrationUrl?: string
}

export interface PortableTextChild {
  _key: string
  _type: string
  text: string
  marks?: string[]
}

export interface PortableTextBlock {
  _key: string
  _type: string
  style?: string
  children?: PortableTextChild[]
  listItem?: string
  asset?: SanityImageAsset
}

export interface Article {
  _id: string
  title: string
  slug: SanitySlug
  publishedAt?: string
  author?: string
  mainImage?: SanityImage
  body?: PortableTextBlock[]
  tags?: string[]
}

export interface Member {
  _id: string
  name: string
  slug: SanitySlug
  role?: string
  bio?: string
  image?: SanityImage
  linkedinUrl?: string
  researchAreas?: string[]
}
