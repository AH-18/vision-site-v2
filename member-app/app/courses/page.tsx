import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";

// Placeholder data — matches the Courses list from the onboarding-flow sketch.
const COURSES = [
  { id: "how-to-use", title: "How To Use The App", desc: "Get set up and post your first piece of content." },
  { id: "identity-setup", title: "Identity Setup", desc: "Find your voice, edge, and identity." },
  { id: "instagram-course", title: "Instagram Growth Course", desc: "Learn how to grow your page step by step." },
  { id: "tools-needed", title: "Tools Needed", desc: "The apps and gear that make this easy." },
];

export default function CoursesPage() {
  return (
    <div>
      <PageHeader title="Courses" subtitle="Learn the system" />

      <div className="space-y-4 px-6">
        {COURSES.map((c) => (
          <Card key={c.id} className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#coursesGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl">{c.title}</h2>
              <p className="mt-1 text-sm text-grey-300">{c.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="coursesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#833AB4" />
            <stop offset="50%" stopColor="#E1306C" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
