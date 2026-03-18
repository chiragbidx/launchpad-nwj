import { homeContent } from "@/content/home";

export function LayoutTeamSection() {
  const { team } = homeContent;

  return (
    <section className="py-16" id="team">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{team.title}</h2>
        <p className="mb-8 text-muted-foreground">{team.description}</p>
        {/* ...could map real team members or avatars in future */}
      </div>
    </section>
  );
}