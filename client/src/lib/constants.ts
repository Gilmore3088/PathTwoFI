export const BLOG_CATEGORIES = [
  "Wealth Progress",
  "FIRE Strategy", 
  "Investments",
  "Personal Reflections",
  "FIRE Update"
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];

export const FIRE_TARGET = 1000000; // $1M target
