"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { useGetAllCategoryQuery } from "@/redux/featured/category/categoryApi";

type RemoteCategory = {
  _id?: string; slug?: string; name?: string;
  subCategories?: string[];
};

type UICategory = {
  id: string;
  slug: string;
  label: string;
  subCategories: string[];
};

export default function CategorySidebar() {
  const { data: remoteCats, isSuccess } = useGetAllCategoryQuery();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cats: UICategory[] =
    isSuccess && Array.isArray(remoteCats) && remoteCats.length
      ? (remoteCats as RemoteCategory[]).map((c) => ({
          id: c._id ?? "",
          slug: c.slug ?? "",
          label: c.name ?? "Category",
          subCategories: c.subCategories ?? [],
        }))
      : [];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
    }
  };

  const scrollUp = () => {
    if (scrollContainerRef.current && canScrollUp) {
      scrollContainerRef.current.scrollBy({ top: -200, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current && canScrollDown) {
      scrollContainerRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden md:block md:col-span-3 lg:col-span-2">
      <div className="border rounded-lg overflow-hidden h-44 sm:h-56 md:h-64 lg:h-80 xl:h-96 relative">
        <div className="px-3 bg-[#2E2E2E] py-2 font-medium border-b text-white">Categories</div>
        
        {/* Up Arrow Button */}
        <div className="absolute top-10 left-0 right-0 h-8 bg-white flex items-center justify-center border-b">
          <button
            onClick={scrollUp}
            disabled={!canScrollUp}
            className={`rounded px-3 py-1 transition-all duration-200 ${
              canScrollUp 
                ? 'bg-primary hover:bg-primary-hover hover:scale-105 hover:shadow-lg cursor-pointer' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronUp size={14} className={canScrollUp ? 'text-white' : 'text-gray-500'} />
          </button>
        </div>
        
        {/* Down Arrow Button */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white flex items-center justify-center border-t">
          <button
            onClick={scrollDown}
            disabled={!canScrollDown}
            className={`rounded px-3 py-1 transition-all duration-200 ${
              canScrollDown 
                ? 'bg-primary hover:bg-primary-hover hover:scale-105 hover:shadow-lg cursor-pointer' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronDown size={14} className={canScrollDown ? 'text-white' : 'text-gray-500'} />
          </button>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="overflow-y-auto no-scrollbar px-4 py-8"
          style={{ height: 'calc(100% - 40px)' }}
          onScroll={checkScrollPosition}
        >
          <ul className="divide-y">
            {cats.map((c) => (
              <li key={c.id} className="text-sm">
                <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                  <Link href={`/category?slug=${encodeURIComponent(c.slug)}`} className="flex-1">
                    {c.label}
                  </Link>
                  {c.subCategories.length > 0 && (
                    <button
                      onClick={() => toggleCategory(c.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                      aria-label={`Toggle ${c.label} subcategories`}
                    >
                      {expandedCategories.has(c.id) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  )}
                </div>
                {c.subCategories.length > 0 && expandedCategories.has(c.id) && (
                  <ul className="ml-4 border-l bg-gray-50">
                    {c.subCategories.map((sc, index) => (
                      <li key={`${sc}-${index}`}>
                        <Link
                          href={`/category?slug=${encodeURIComponent(c.slug)}&sub=${encodeURIComponent(sc)}`}
                          className="block px-3 py-1.5 hover:bg-gray-100 text-[13px]"
                        >
                          {sc}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
