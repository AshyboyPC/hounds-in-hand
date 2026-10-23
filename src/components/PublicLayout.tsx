import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "@/public-site.css";
const pageNames: Record<string,string> = {
  "/": "Connecting Shelters & Communities", "/donate":"Donate", "/volunteer":"Volunteer",
  "/supply-wishlist":"Supply Wishlist", "/map":"Shelter Map", "/about":"About Us",
  "/contact":"Contact", "/partnerships":"Our Community", "/privacy-policy":"Privacy",
  "/adopt":"Adoption Updates", "/stories":"Shelter Stories",
};
export default function PublicLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    document.title = `${pageNames[pathname] || "Page Not Found"} | Connect 4 Paws`;
    main.current?.focus({preventScroll:true});
  }, [pathname]);
  return <div className="public-site"><a className="skip-main" href="#main-content">Skip to content</a><Header /><main ref={main} tabIndex={-1} id="main-content" className="site-main">{children}</main><Footer /></div>;
}
