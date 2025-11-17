"use client";

import WishlistPage from '@/components/wishlist/WishlistPage';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function DashboardWishlist() {
  useScrollToTop();
  return <WishlistPage />;
}
