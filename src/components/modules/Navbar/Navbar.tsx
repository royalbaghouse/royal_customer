"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  Search,
  Headphones,
  ShoppingCart,
  LogOut,
  User as UserIcon,
  Heart,
  X,
} from "lucide-react";


import { useGetSettingsQuery } from "@/redux/featured/settings/settingsApi";
import Image from "next/image";

// 🔐 auth + cart selectors & logout
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { signOut } from "next-auth/react";

import { selectCurrentUser, logoutUser } from "@/redux/featured/auth/authSlice";
import { useLogoutMutation } from "@/redux/featured/auth/authApi";
import SmartSearch from "@/components/search/SmartSearch";
import { selectCartItems } from "@/redux/featured/cart/cartSlice";
import { useWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";



export default function Navbar() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { data: settings } = useGetSettingsQuery();

  const router = useRouter();

  const currentUser = useAppSelector(selectCurrentUser);
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const isLoggedIn = Boolean(currentUser?.id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cartItems = useAppSelector(selectCartItems);
  const { wishlist } = useWishlist();

  const handleLogout = async () => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        await logoutMutation(userId).unwrap();
      }
    } catch {
      // Handle error silently
    } finally {
      // Redux state clear
      dispatch(logoutUser());

      // NextAuth session clear + redirect
      await signOut({ callbackUrl: "/auth/login", redirect: false });

      // Show success toast
      toast.success("Successfully signed out!");
    }
  };

  return (
    <>


      {/* ===== Desktop/Large Screen ===== */}
      <div className="hidden lg:block w-full bg-accent border-b border-neutral shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 w-full md:px-6 lg:px-36">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3 ml-3 flex-shrink-0">
              <Link
                href="/"
                className="flex items-center"
                aria-label="Go to homepage"
              >
                {settings?.logo ? (
                  <Image
                    src={settings.logo}
                    alt=" Royal Bag House Logo"
                    width={120}
                    height={40}
                    className="h-16"
                    style={{ width: "auto" }}
                  />
                ) : (
                  <span className="font-extrabold text-3xl text-primary">
                     Royal Bag House 
                  </span>
                )}
              </Link>
            </div>

            {/* Search Area */}
            <div className="flex-1 flex justify-center mx-8">
              <div className="w-full max-w-2xl">
                <SmartSearch />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/contact-us"
                className="inline-flex items-center text-primary gap-2 px-3 py-3 rounded-md border border-neutral hover:bg-gray-100 "
                aria-label="contact"
              >
                <Headphones size={18} />
              </Link>

              <Link
                href="/wishlist"
                className="relative inline-flex items-center text-primary justify-center h-10 w-10 rounded-md border border-neutral hover:bg-gray-100"
                aria-label="wishlist"
              >
                <Heart size={18} />
                {isClient && wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full text-xs bg-secondary text-accent flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard/checkout"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-md border border-neutral hover:bg-gray-100"
                aria-label="cart"
              >
                <ShoppingCart size={18} />
                {isClient && cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full text-xs bg-secondary text-accent flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile/Small Screen ===== */}
      <div className="lg:hidden sticky top-0 z-30 bg-primary text-accent w-full">
        <div className="container mx-auto px-4 py-3">
          {/* Normal State */}
          {!isSearchActive && (
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="font-bold text-xl text-accent"> Royal Bag House </span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg bg-accent text-black hover:bg-gray-200 transition-colors"
                  aria-label="Search"
                  onClick={() => setIsSearchActive(true)}
                >
                  <Search size={18} />
                </button>

                <Link
                  href="/contact-us"
                  className="hidden sm:block p-2 rounded-lg bg-accent text-black hover:bg-gray-200 transition-colors"
                  aria-label="Contact"
                >
                  <Phone size={18} />
                </Link>

                <Link
                  href="/dashboard/checkout"
                  className="hidden sm:block relative p-2 rounded-lg bg-accent text-black hover:bg-gray-200 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} />
                  {isClient && cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-xs bg-secondary text-accent flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                {!isLoggedIn ? (
                  <Link
                    href="/auth/login"
                    className="p-2 rounded-lg bg-accent text-black hover:bg-gray-200 transition-colors"
                    aria-label="Login/Register"
                  >
                    <UserIcon size={18} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Logout"
                    disabled={isLogoutLoading}
                    className="p-2 rounded-lg bg-accent text-orange-700 hover:bg-accent/90 transition-colors disabled:opacity-60"
                  >
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Search Active State */}
          {isSearchActive && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchActive(false)}
                className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors flex-shrink-0"
                aria-label="Close search"
              >
                <X size={20} />
              </button>

              <div className="flex-1">
                <SmartSearch
                  placeholder="Search Product..."
                  className="w-full"
                  onSearch={(q) => {
                    // ডিফল্ট রাউটিং
                    router.push(
                      `/product-listing?search=${encodeURIComponent(q)}`
                    );
                    setIsSearchActive(false);
                  }}
                />
              </div>

              {/* ডানপাশে আলাদা বোতাম লাগবে না—SmartSearch নিজেই সার্চ করতে পারে */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
