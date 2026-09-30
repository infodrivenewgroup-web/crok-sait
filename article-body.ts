import type { Article, ArticleSection } from "./articles";
import { BATCH_A } from "./batch-a";
import { BATCH_B } from "./batch-b";
import { BATCH_C } from "./batch-c";
import { BATCH_D } from "./batch-d";

const FULL: Record<string, ArticleSection[]> = {
  ...BATCH_A,
  ...BATCH_B,
  ...BATCH_C,
  ...BATCH_D,
};

export function fullSections(article: Article): ArticleSection[] {
  return FULL[article.slug] ?? [];
}
