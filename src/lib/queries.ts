import {groq} from 'next-sanity'

export const getAllWebinars = groq`
  *[_type == "webinar"] | order(date desc) {
    _id,
    title,
    slug,
    date,
    speakerName,
    speakerBio,
    speakerImage,
    description,
    youtubeUrl,
    tags
  }
`

export const getWebinarBySlug = groq`
  *[_type == "webinar" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    speakerName,
    speakerBio,
    speakerImage,
    description,
    youtubeUrl,
    tags
  }
`

export const getEventBySlug = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    location,
    description,
    image,
    registrationUrl
  }
`

export const getAllEvents = groq`
  *[_type == "event"] | order(date desc) {
    _id,
    title,
    slug,
    date,
    location,
    description,
    image,
    registrationUrl
  }
`

export const getAllArticles = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    author,
    mainImage,
    tags
  }
`

export const getArticleBySlug = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    author,
    mainImage,
    body,
    tags
  }
`

export const getAllMembers = groq`
  *[_type == "member"] | order(name asc) {
    _id,
    name,
    slug,
    role,
    bio,
    image,
    linkedinUrl,
    researchAreas
  }
`
