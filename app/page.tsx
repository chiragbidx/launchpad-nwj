import { homeContent } from "@/content/home";
// ...other imports

export default function HomePage() {
  // Use homeContent directly, do not try to call getHomeContent()
  const { hero, features, services, testimonials, team, pricing, contact, faq, footer } = homeContent;
  // ...component logic and rendering
}