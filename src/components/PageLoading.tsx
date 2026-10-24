import Header from "./Header";
import Footer from "./Footer";
import "@/public-site.css";

export default function PageLoading({ message = "Loading…" }: { message?: string }) {
  return <div className="public-site">
    <Header />
    <main className="site-main" aria-busy="true">
      <p role="status" aria-live="polite">{message}</p>
    </main>
    <Footer />
  </div>;
}
