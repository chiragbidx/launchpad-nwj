import { homeContent } from "@/content/home";

export function LayoutFaqSection() {
  const { faq } = homeContent;

  return (
    <section className="py-16 bg-muted" id="faq">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="divide-y">
          {faq.map((item, idx) => (
            <div key={idx} className="py-6">
              <h3 className="text-lg font-semibold mb-1">{item.q}</h3>
              <p className="text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}