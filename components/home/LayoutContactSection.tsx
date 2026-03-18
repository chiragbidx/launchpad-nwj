import { homeContent } from "@/content/home";

export function LayoutContactSection() {
  const { contact } = homeContent;

  return (
    <section className="py-16 bg-muted" id="contact">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{contact.heading}</h2>
        <p className="mb-8 text-muted-foreground">{contact.text}</p>
        <a
          href={`mailto:${contact.email}`}
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold transition hover:bg-primary/90"
        >
          {contact.email}
        </a>
      </div>
    </section>
  );
}