

import type { Metadata } from "next";
import ClientHome from "@/components/home/ClientHome";
import FacebookMessenger from "@/components/shared/FacebookMessenger";

export const metadata: Metadata = {
  title: " Royal Bag House - Best Deals | Home",
  description: "Premium Clothing & more in Bangladesh.",
};

export default function HomePage() {
  
  return (
    <>
      <ClientHome />
      <FacebookMessenger />
    </>
  );
}
