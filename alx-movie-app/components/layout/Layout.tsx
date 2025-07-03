import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ComponentProps } from "@/interfaces";

const Layout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
