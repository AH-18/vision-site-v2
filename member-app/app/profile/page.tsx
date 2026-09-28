import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="Your Profile" />

      <div className="px-6">
        <Card className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full border-2 border-gold/50 bg-grey-800" />
          <div>
            <h2 className="font-display text-2xl">Creator Name</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-400">
              Level 2 · Rising Creator
            </span>
          </div>
        </Card>

        <div className="mt-6 space-y-3">
          {["Name", "Instagram Username", "Email", "About You"].map((field) => (
            <Card key={field} className="py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                {field}
              </span>
              <p className="mt-1 text-sm text-grey-200">—</p>
            </Card>
          ))}
        </div>

        <button className="mt-6 w-full insta-gradient-bg py-3 font-mono text-xs uppercase tracking-[0.2em] text-white">
          Save Changes
        </button>
      </div>
    </div>
  );
}
