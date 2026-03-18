import { homeContent } from "@/content/home";

export function LayoutServicesSection() {
  const { services } = homeContent;

  return (
    <section className="py-16" id="services">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="bg-card rounded-xl shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}