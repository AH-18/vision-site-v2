import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";

const SETTINGS_ITEMS = [
  "Account Info",
  "Subscription & Billing",
  "Notification Preferences",
  "Change Password",
  "Help & Support",
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" />

      <div className="space-y-3 px-6">
        {SETTINGS_ITEMS.map((item) => (
          <Card key={item} className="flex items-center justify-between py-4">
            <span className="text-sm text-grey-100">{item}</span>
            <span className="text-grey-500">&gt;</span>
          </Card>
        ))}

        <button className="mt-6 w-full border border-grey-700 py-3 font-mono text-xs uppercase tracking-[0.2em] text-grey-300 transition-colors hover:border-gold hover:text-white">
          Log Out
        </button>
      </div>
    </div>
  );
}
