import { homeContent } from "@/content/home";

export function LayoutHeroSection() {
  const { hero } = homeContent;
  return (
    <section className="...">
      <h1>{hero.heading}</h1>
      <p>{hero.subheading}</p>
      {/* ... */}
    </section>
  );
}
// Apply similar fixes to other sections that used getHomeContent()