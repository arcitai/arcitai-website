import { lazy, Suspense } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Inquiry } from "../components/Inquiry";
import { NewsletterContent } from "../family/Family";
import { Scope } from "../components/Scope";
import { useTheme } from "../theme";
import { usePageMotion } from "../page-motion";
import { OrganizationProjects } from "../projects/OrganizationProjects";
import { localReview } from "../family/preview";

const BrandReview =
  import.meta.env.VITE_REVIEW_PREVIEW === "true"
    ? lazy(() => import("../components/BrandReview"))
    : null;

export function App() {
  const { theme, toggleTheme } = useTheme();
  usePageMotion();
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const newsletter = path.startsWith("/newsletter");
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header theme={theme} onThemeChange={toggleTheme} />
      <main id="main-content" tabIndex={-1}>
        {newsletter ? (
          <NewsletterContent brand="arcitai" />
        ) : path === "/project" ? (
          <Inquiry />
        ) : (
          <>
            <Hero />
            <Scope />
            <OrganizationProjects
              owner="arcitai"
              title="Open-source work"
              description="Tools and methods you can use and build on."
              productLinks={
                import.meta.env.VITE_REVIEW_PREVIEW === "true" && localReview
                  ? { "arcitai/openpaperdesign": "http://127.0.0.1:4184/" }
                  : undefined
              }
            />
          </>
        )}
      </main>
      {localReview && BrandReview && new URLSearchParams(window.location.search).has("brand") && (
        <Suspense fallback={null}>
          <BrandReview />
        </Suspense>
      )}
      <Footer />
    </>
  );
}
