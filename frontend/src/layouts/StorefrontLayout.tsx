import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-field-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default StorefrontLayout;
