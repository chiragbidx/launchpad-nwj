import { homeContent } from "@/content/home";

export function LayoutPricingSection() {
  const { pricing } = homeContent;

  return (
    <section className="py-16" id="pricing">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {pricing.plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-card p-8 rounded-xl border shadow-sm flex flex-col items-center"
            >
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-muted-foreground">
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold transition hover:bg-primary/90">
                Get started
              </button>
            </div>
          ))}
        </div>
        {pricing.note && (
          <div className="mt-8 text-center text-muted-foreground text-sm">
            {pricing.note}
          </div>
        )}
      </div>
    </section>
  );
}