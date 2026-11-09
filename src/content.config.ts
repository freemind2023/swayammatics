import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const commonFields = {
  title: z.string(),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  date: z.coerce.date().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
};

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    ...commonFields,
    author: z.string().default("Admin"),
    author_image: z.string().optional(),
    categories: z.array(z.string()).default(() => ["others"]),
    tags: z.array(z.string()).default(() => ["others"]),
    tag: z.string().optional(),
    read_time: z.string().optional(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({ ...commonFields }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    ...commonFields,
    page_header: z.object({
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
    }),
    stats: z.object({
      enable: z.boolean(),
      items: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
    our_team: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      members: z.array(
        z.object({ image: z.string(), name: z.string(), role: z.string() }),
      ),
    }),
    core_values: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      subtitle: z.string(),
      items: z.array(
        z.object({
          logo: z.string(),
          title: z.string(),
          is_starred: z.boolean(),
        }),
      ),
    }),
  }),
});

const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    ...commonFields,
    page_header: z
      .object({ title: z.string(), subtitle: z.string() })
      .optional(),
    contact_info: z
      .object({
        enable: z.boolean(),
        items: z.array(
          z.object({
            type: z.string(),
            title: z.string(),
            detail: z.string(),
            link: z.string().optional(),
            icon: z.string().optional(),
          }),
        ),
      })
      .optional(),
  }),
});

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      badge: z.string().optional(),
      title: z.string(),
      content: z.string(),
      image: z.string().optional(),
      button_primary: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
      button_secondary: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    main_features: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      content: z.string(),
      items: z.array(z.string()),
    }),
    value_props: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      content: z.string(),
      items: z.array(
        z.object({
          logo: z.string(),
          title: z.string(),
          list: z.array(z.string()).optional(),
        }),
      ),
    }),
    partners: z
      .object({ badge: z.string().optional(), title: z.string() })
      .optional(),
    smart_platform: z
      .object({
        badge: z.string().optional(),
        title: z.string(),
        content: z.string(),
        cards: z.array(z.object({ title: z.string(), logo: z.string() })),
      })
      .optional(),
    our_features: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      content: z.string(),
      items: z.array(
        z.object({
          logo: z.string(),
          title: z.string(),
          is_starred: z.boolean(),
        }),
      ),
    }),
    testimonial_quote: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      quote: z.string(),
    }),
    single_testimonial: z.object({
      enable: z.boolean(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })),
      testimonial: z.object({
        quote: z.string(),
        avatar: z.string(),
        name: z.string(),
        company: z.string(),
      }),
    }),
    growth_process: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      items: z.array(
        z.object({
          logo: z.string(),
          title: z.string(),
          content: z.string(),
        }),
      ),
      button: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    integrations: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      items: z.array(z.object({ image: z.string(), alt: z.string() })),
    }),
  }),
});

const featuresCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/features" }),
  schema: z.object({
    ...commonFields,
    banner: z.object({
      title: z.string(),
      content: z.string(),
      button_primary: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
      button_secondary: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
      image: z.string(),
    }),
    partners: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
    }),
    smart_platform: z.object({
      enable: z.boolean(),
      badge: z.string().optional(),
      title: z.string(),
      content: z.string().optional(),
      cards: z.array(
        z.object({
          title: z.string(),
          subtitle: z.string().optional(),
          logo: z.string().optional(),
          image: z.string().optional(),
          classNames: z.string().optional(),
        }),
      ),
    }),
    service_features: z.object({
      enable: z.boolean(),
      items: z.array(
        z.object({
          title: z.string(),
          image: z.string(),
          items: z.array(
            z.object({
              icon: z.string(),
              title: z.string(),
              content: z.string(),
            }),
          ),
          reverse: z.boolean(),
        }),
      ),
    }),
  }),
});

const blogIndexCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    ...commonFields,
    page_header: z
      .object({ title: z.string(), featured_post: z.string().optional() })
      .optional(),
    featured_post: z.object({ enable: z.boolean() }).optional(),
    latest_posts: z
      .object({ enable: z.boolean(), title: z.string() })
      .optional(),
  }),
});

const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    badge: z.string().optional(),
    title: z.string(),
    description: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

const faqSectionCollection = defineCollection({
  loader: glob({ pattern: "faq.{md,mdx}", base: "src/content/sections" }),
  schema: z.object({
    enable: z.boolean(),
    badge: z.string().optional(),
    title: z.string(),
    description: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
});

const businessNeedsSectionCollection = defineCollection({
  loader: glob({
    pattern: "business-needs.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    badge: z.string().optional(),
    title: z.string(),
    items: z.array(
      z.object({
        image: z.string(),
        number: z.string(),
        title: z.string(),
        content: z.string(),
      }),
    ),
  }),
});

export const collections = {
  blog: blogCollection,
  blogIndex: blogIndexCollection,
  pages: pagesCollection,
  about: aboutCollection,
  contact: contactCollection,
  homepage: homepageCollection,
  features: featuresCollection,
  ctaSection: ctaSectionCollection,
  faqSection: faqSectionCollection,
  businessNeedsSection: businessNeedsSectionCollection,
};
