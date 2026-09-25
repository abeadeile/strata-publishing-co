// GROQ query shapes. Build model must pair these with typed runtime mapping,
// Sanity client, parameter validation, pagination bounds, and cache tags.

export const SETTINGS_QUERY = `*[_type == "houseSiteSettings"][0]{
  "featuredItemId": featuredItem._ref,
  nav[]{label, href}, social[]{label, href}, newsletterHref, contactEmail
}`;

export const FEATURE_QUERY = `*[_type in ["houseWork", "housePublication", "houseInsight"]
  && _id == $id && defined(publishedAt) && publishedAt <= now()][0]{
  _id, _type, "slug": slug.current, title, dek, category,
  publishedAt, audience, hero, gallery, cta, relatedItems, seo
}`;

export const ITEM_QUERY = `*[_type == $type && slug.current == $slug
  && defined(publishedAt) && publishedAt <= now()][0]{
  _id, _type, "slug": slug.current, title, dek, category,
  publishedAt, audience, hero, gallery, cta, relatedItems, seo, body
}`;

export const INDEX_QUERY = `{
  "total": count(*[_type == $type && defined(publishedAt)
    && publishedAt <= now() && ($category == "" || category == $category)
    && ($audience == "" || $audience in audience)]),
  "items": *[_type == $type && defined(publishedAt)
    && publishedAt <= now() && ($category == "" || category == $category)
    && ($audience == "" || $audience in audience)]
    | order(publishedAt desc)[$start...$end]{
      _id, _type, "slug": slug.current, title, dek, category,
      publishedAt, audience, hero, cta, seo
    }
}`;
