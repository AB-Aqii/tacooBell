import type { ArticleSection, NewsArticle } from "@/types/news";

function sampleSections(topic: string): ArticleSection[] {
  return [
    {
      id: "about-this-article",
      heading: "About this article",
      paragraphs: [
        `This is a placeholder article about ${topic}. It shows how a news article is laid out on this website.`,
      ],
    },
    {
      id: "what-will-appear",
      heading: "What will appear here",
      paragraphs: [
        `Once verified, this article will report ${topic} with names, dates and sources.`,
        "Quotes, figures and links are added only when they can be confirmed.",
      ],
    },
    {
      id: "where-to-find-more",
      heading: "Where to find more",
      paragraphs: [
        "Related brand pages, company information and other news are linked from this page and from the related stories section.",
      ],
    },
  ];
}

const author = "Editorial team";

export const newsArticles: NewsArticle[] = [
  {
    slug: "a-new-home-for-company-and-brand-information",
    title: "A new home for company and brand information",
    excerpt:
      "This website gathers company information, brand profiles, news and investor resources in one place.",
    category: "Corporate updates",
    publishedAt: "2026-11-03",
    updatedAt: "2026-11-10",
    author,
    featured: true,
    isSample: true,
    sections: [
      {
        id: "what-the-website-offers",
        heading: "What the website offers",
        paragraphs: [
          "This website gathers company information, brand profiles, news and investor resources in one place.",
          "Visitors can browse the brand directory, read corporate updates, and find careers and investor information.",
        ],
      },
      {
        id: "how-information-is-published",
        heading: "How information is published",
        paragraphs: [
          "Company facts appear on this site only after they are verified. Until then, sections show placeholders, and sample entries are labeled as such.",
        ],
      },
      {
        id: "where-to-start",
        heading: "Where to start",
        paragraphs: [
          "Start with the brand directory to meet each brand, or open the About page to learn how the group is organized.",
        ],
      },
    ],
  },
  {
    slug: "sample-brand-announcement",
    title: "Sample brand announcement",
    excerpt:
      "A placeholder article that shows how brand announcements will appear, with a link to the brand page.",
    category: "Brand announcements",
    publishedAt: "2026-10-20",
    author,
    featured: false,
    brandSlug: "harbor-grill",
    isSample: true,
    sections: sampleSections("a brand announcement"),
  },
  {
    slug: "sample-community-update",
    title: "Sample community update",
    excerpt:
      "A placeholder article that shows how community initiatives will be reported once they are verified.",
    category: "Community initiatives",
    publishedAt: "2026-10-06",
    author,
    featured: false,
    isSample: true,
    sections: sampleSections("a community initiative"),
  },
  {
    slug: "sample-press-release",
    title: "Sample press release",
    excerpt:
      "A placeholder press release that shows how official statements from the group will be published.",
    category: "Press releases",
    publishedAt: "2026-09-15",
    author,
    featured: false,
    isSample: true,
    sections: sampleSections("an official statement"),
  },
  {
    slug: "sample-business-development",
    title: "Sample business development update",
    excerpt:
      "A placeholder article that shows how business developments will be summarized for readers and researchers.",
    category: "Business developments",
    publishedAt: "2026-08-27",
    author,
    featured: false,
    isSample: true,
    sections: sampleSections("a business development"),
  },
  {
    slug: "sample-menu-update",
    title: "Sample menu update from a brand",
    excerpt:
      "A placeholder article that shows how a brand's product or menu news will appear in the news section.",
    category: "Brand announcements",
    publishedAt: "2026-07-18",
    author,
    featured: false,
    brandSlug: "crumb-and-kettle",
    isSample: true,
    sections: sampleSections("a menu update"),
  },
  {
    slug: "sample-corporate-update",
    title: "Sample corporate update",
    excerpt:
      "A placeholder article that shows how general corporate updates will be presented on the website.",
    category: "Corporate updates",
    publishedAt: "2026-05-12",
    author,
    featured: false,
    isSample: true,
    sections: sampleSections("a corporate update"),
  },
  {
    slug: "sample-community-partnership",
    title: "Sample community partnership",
    excerpt:
      "A placeholder article that shows how partnerships with community organizations will be reported.",
    category: "Community initiatives",
    publishedAt: "2025-12-09",
    author,
    featured: false,
    isSample: true,
    sections: sampleSections("a community partnership"),
  },
  {
    slug: "sample-opening-announcement",
    title: "Sample opening announcement",
    excerpt:
      "A placeholder article that shows how a brand's expansion news will appear once it is verified.",
    category: "Brand announcements",
    publishedAt: "2025-10-21",
    author,
    featured: false,
    brandSlug: "corner-slice",
    isSample: true,
    sections: sampleSections("an opening announcement"),
  },
];
