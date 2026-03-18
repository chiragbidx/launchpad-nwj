import { homeContent } from "@/content/home";

export function LayoutSponsorsSection() {
  const { sponsors } = homeContent;

  return (
    <section className="py-10 bg-muted" id="sponsors">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">Our Partners</h2>
        <div className="flex justify-center items-center gap-6 flex-wrap">
          {sponsors?.map((sponsor, idx) => (
            <div key={idx}>
              <img src={sponsor.logo} alt={sponsor.name} className="h-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}