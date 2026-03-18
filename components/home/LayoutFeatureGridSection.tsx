import { homeContent } from "@/content/home";

export function LayoutFeatureGridSection() {
  const { features } = homeContent;

  return (
    <section className="py-16" id="features">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">LeadFlow Features</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div key={i} className="bg-card rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">{/* Icon here */}</div>
              <div className="font-semibold text-lg mb-1">{feature.title}</div>
              <div className="text-muted-foreground">{feature.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}