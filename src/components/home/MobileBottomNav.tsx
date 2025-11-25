"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { 
  Home, 
  Layers, 
  ShoppingCart, 
  Menu, 
  X, 
  Grid3X3,
  LayoutDashboard,
  User,
  Package,
  Heart,
  Info,
  Phone,
  Shield,
  RotateCcw
} from "lucide-react";
import { ReactNode } from "react";
import { useGetAllCategoryQuery } from "@/redux/featured/category/categoryApi";

type NavKey = "home" | "categories" | "cart" | "menu";

type NavItem = {
  key: NavKey;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
};

export default function MobileBottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'categories' | 'menu'>('menu');
  const { data: remoteCats, isSuccess } = useGetAllCategoryQuery();

  const items: NavItem[] = useMemo(
    () => [
      { key: "home", label: "Home", icon: <Home size={18} />, href: "/" },
      { 
        key: "categories", 
        label: "Categories", 
        icon: <Layers size={18} />, 
        onClick: () => { setDrawerType('categories'); setDrawerOpen(true); }
      },
      { key: "cart", label: "Cart", icon: <ShoppingCart size={18} />, href: "/dashboard/checkout" },
      { 
        key: "menu", 
        label: "Menu", 
        icon: <Menu size={18} />, 
        onClick: () => { setDrawerType('menu'); setDrawerOpen(true); }
      },
    ],
    []
  );

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-accent border-t border-neutral shadow-sm lg:hidden">
        <ul className="grid grid-cols-4">
          {items.map((it) =>
            it.href ? (
              <li key={it.key}>
                <Link href={it.href} className={`flex font=bold flex-col items-center justify-center py-2 ${it.key === 'home' ? 'text-primary' : 'text-black'}`}>
                  {it.icon}
                  <span className="text-[11px] mt-1">{it.label}</span>
                </Link>
              </li>
            ) : (
              <li key={it.key}>
                <button
                  type="button"
                  onClick={it.onClick}
                  className="w-full flex flex-col items-center justify-center py-2 text-black"
                >
                  {it.icon}
                  <span className="text-[11px] mt-1">{it.label}</span>
                </button>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-secondary bg-opacity-50"
            onClick={closeDrawer}
          />
          
          {/* Drawer Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-accent rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{drawerType === 'categories' ? 'Categories' : 'Menu'}</h3>
              <button 
                onClick={closeDrawer}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-2">
              {drawerType === 'categories' ? (
                // Categories content
                <>
                  {isSuccess && Array.isArray(remoteCats) && remoteCats.length > 0 ? (
                    remoteCats.map((cat: Record<string, unknown>, index: number) => (
                      <Link 
                        key={String(cat._id || cat.id || index)}
                        href={`/category?slug=${encodeURIComponent(String(cat.slug || ''))}`} 
                        className="block p-3 hover:bg-gray-100 rounded" 
                        onClick={closeDrawer}
                      >
                        {String(cat.name || 'Category')}
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">No categories found</div>
                  )}
                </>
              ) : (
                // Menu content
                <>
                  <Link href="/" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <Home size={20} />
                    <span>Home</span>
                  </Link>
                  <Link href="/product-listing" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <Grid3X3 size={20} />
                    <span>All Products</span>
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <User size={20} />
                    <span>My Profile</span>
                  </Link>
                  <Link href="/tracking-order" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <Package size={20} />
                    <span>Track Order</span>
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </Link>
                  <Link href="/about" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <Info size={20} />
                    <span>About Us</span>
                  </Link>
                  <Link href="/contact-us" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <Phone size={20} />
                    <span>Contact Us</span>
                  </Link>
                  <Link href="/privacy-policy" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <Shield size={20} />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link href="/return-policy" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded" onClick={closeDrawer}>
                    <RotateCcw size={20} />
                    <span>Return & Refund</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}