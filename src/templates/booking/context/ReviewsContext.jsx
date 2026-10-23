import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ReviewsContext = createContext(null);

function storageKey(slug) {
  return `business-reviews:${slug}`;
}

function readReviews(slug) {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeReviews(slug, reviews) {
  localStorage.setItem(storageKey(slug), JSON.stringify(reviews));
}

export function ReviewsProvider({ slug, children }) {
  const [reviews, setReviews] = useState(() => readReviews(slug));

  useEffect(() => {
    setReviews(readReviews(slug));
  }, [slug]);

  useEffect(() => {
    writeReviews(slug, reviews);
  }, [slug, reviews]);

  const api = useMemo(
    () => ({
      reviews,
      addReview: (review) => {
        const newReview = {
          id: "rev_" + Date.now(),
          createdAt: new Date().toISOString(),
          ...review,
        };
        setReviews((prev) => [newReview, ...prev]);
        return newReview;
      },
    }),
    [reviews],
  );

  return (
    <ReviewsContext.Provider value={api}>{children}</ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews debe usarse dentro de ReviewsProvider");
  return ctx;
}
