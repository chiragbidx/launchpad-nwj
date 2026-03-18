import { homeContent } from "@/content/home";

export function LayoutBenefitsSection() {
  const { features } = homeContent;

  return (
    <section className="py-16" id="benefits">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">CRM Benefits</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-muted border flex gap-4 items-start">
              {/* Optionally render Lucide icon here if `icon` property */}
              <div>
                <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  {/* If icon exists, render it */}
                  {/* Could later add icon mapping: https://lucide.dev/icons */}
                </div>
                <div className="text-lg font-semibold mb-1">{feature.title}</div>
                <div className="text-muted-foreground">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}