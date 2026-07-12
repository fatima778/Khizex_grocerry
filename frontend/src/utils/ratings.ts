/**
 * Deterministic pseudo-rating derived from a product's id, so the same
 * product always shows the same rating/review count across renders.
 * (Real review data is out of scope for this build — see README.)
 */
export function getProductRating(id: string): { rating: number; reviews: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  const rating = 3.6 + (abs % 14) / 10;
  const reviews = 12 + (abs % 240);
  return { rating: Math.round(rating * 10) / 10, reviews };
}
