// ADMIN_TABS/WEBSITE_TAB/WebPageRegistry.js
import { lazy } from "react";

const SEOAnalytics = lazy(() => import("../SEO_ANALYSIS_TAB/SEOAnalytics"));
const BlogPostsTab = lazy(() => import("./Blog/BlogPostsTab"));


export const WebPageRegistry = [
 {
    id: "seoanalysis",
    label: "SEO Analysis",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    component: SEOAnalytics,
    badge: null,
  },
  {
    id:        "blogs",
    label:     "Blogs",
    icon: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z",
    component: BlogPostsTab,
  },

  // ── Drop new website sub-tabs here only ──────────────────────────────
  // {
  //   id:        "orders",
  //   label:     "Orders",
  //   icon:      "...svg path...",
  //   component: lazy(() => import("./OrdersTab")),
  // },
];