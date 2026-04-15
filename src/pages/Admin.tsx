import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { supabase } from "../config/supabase";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  subscription_tier: string | null;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  trial_converted_at: string | null;
  role: string | null;
};

type AdminSubscription = {
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  price_id: string | null;
  status: string | null;
  cancel_at_period_end: boolean | null;
  current_period_end: string | null;
  trial_start: string | null;
  trial_end: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type UsageSummary = {
  days: number;
  event_count: number;
  error_count: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
};

type UsageByFeature = {
  feature: string;
  events: number;
  input: number;
  output: number;
  total: number;
};

type UsageEvent = {
  id: string;
  feature: string;
  model: string;
  status: string;
  user_id: string;
  total_tokens: number | null;
  error_message: string | null;
  created_at: string;
};

export default function Admin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUser, setResultUser] = useState<AdminUser | null>(null);
  const [resultSubscription, setResultSubscription] =
    useState<AdminSubscription | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [usageDays, setUsageDays] = useState(30);
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
  const [usageByFeature, setUsageByFeature] = useState<UsageByFeature[]>([]);
  const [recentUsageEvents, setRecentUsageEvents] = useState<UsageEvent[]>([]);

  const loadUsage = async (days = usageDays) => {
    setUsageLoading(true);
    setUsageError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "admin-openai-usage",
        { body: { days, limit: 50 } }
      );
      if (invokeError) throw invokeError;
      setUsageSummary((data as any)?.summary ?? null);
      setUsageByFeature(((data as any)?.by_feature as UsageByFeature[]) ?? []);
      setRecentUsageEvents(((data as any)?.events as UsageEvent[]) ?? []);
    } catch (err: any) {
      setUsageError(err?.message ?? "Failed to load usage data.");
      setUsageSummary(null);
      setUsageByFeature([]);
      setRecentUsageEvents([]);
    } finally {
      setUsageLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter an email to search.");
      return;
    }

    setLoading(true);
    setError(null);
    setResultUser(null);
    setResultSubscription(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "admin-get-user",
        { body: { email: trimmed } }
      );

      if (invokeError) {
        throw invokeError;
      }

      setResultUser((data as any)?.user ?? null);
      setResultSubscription((data as any)?.subscription ?? null);
    } catch (err: any) {
      setError(err?.message ?? "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="font-['Fraunces'] text-4xl mb-2">Admin</h1>
          <p className="font-['Inter'] text-foreground/70">
            Lookup a user by email.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="font-['Inter'] text-sm">
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-black rounded-design font-['Inter']"
              placeholder="user@example.com"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-design font-['Inter']"
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        <div className="bg-[#E5E5E5]/30 border border-black rounded-design p-6 space-y-6">
          <h2 className="font-['Fraunces'] text-2xl">Result</h2>

          {!loading && !resultUser && (
            <p className="font-['Inter'] text-sm text-foreground/70">
              No user found.
            </p>
          )}

          {resultUser && (
            <div className="space-y-2">
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">ID:</span> {resultUser.id}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Email:</span> {resultUser.email}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Name:</span>{" "}
                {resultUser.name ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Tier:</span>{" "}
                {resultUser.subscription_tier ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Trial Started:</span>{" "}
                {resultUser.trial_started_at ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Trial Ends:</span>{" "}
                {resultUser.trial_ends_at ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Trial Converted:</span>{" "}
                {resultUser.trial_converted_at ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Role:</span>{" "}
                {resultUser.role ?? "user"}
              </p>
            </div>
          )}

          {resultUser && (
            <div className="space-y-2">
              <h3 className="font-['Fraunces'] text-xl">Subscription</h3>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Status:</span>{" "}
                {resultSubscription?.status ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Price ID:</span>{" "}
                {resultSubscription?.price_id ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Trial End:</span>{" "}
                {resultSubscription?.trial_end ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Current Period End:</span>{" "}
                {resultSubscription?.current_period_end ?? "-"}
              </p>
              <p className="font-['Inter'] text-sm">
                <span className="font-medium">Updated At:</span>{" "}
                {resultSubscription?.updated_at ?? "-"}
              </p>
            </div>
          )}
        </div>

        <div className="bg-[#E5E5E5]/30 border border-black rounded-design p-6 space-y-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="usage-days" className="font-['Inter'] text-sm">
                OpenAI usage window (days)
              </Label>
              <Input
                id="usage-days"
                type="number"
                min={1}
                max={90}
                value={usageDays}
                onChange={(e) => setUsageDays(Number(e.target.value || 30))}
                className="w-32 border-black rounded-design font-['Inter']"
              />
            </div>
            <Button
              type="button"
              onClick={() => void loadUsage(usageDays)}
              disabled={usageLoading}
              className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-design font-['Inter']"
            >
              {usageLoading ? "Loading usage..." : "Load usage"}
            </Button>
          </div>

          {usageError && <p className="text-sm text-red-600">{usageError}</p>}

          {usageSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <UsageStat label="Events" value={String(usageSummary.event_count)} />
              <UsageStat label="Total tokens" value={String(usageSummary.total_tokens)} />
              <UsageStat label="Input tokens" value={String(usageSummary.input_tokens)} />
              <UsageStat label="Output tokens" value={String(usageSummary.output_tokens)} />
            </div>
          )}

          {usageByFeature.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-['Fraunces'] text-xl">By feature</h3>
              <div className="space-y-2">
                {usageByFeature.map((row) => (
                  <div
                    key={row.feature}
                    className="flex items-center justify-between border border-black/20 rounded-design px-3 py-2 bg-white"
                  >
                    <p className="font-['Inter'] text-sm">{row.feature}</p>
                    <p className="font-['Inter'] text-xs text-foreground/70">
                      events: {row.events} | total tokens: {row.total}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentUsageEvents.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-['Fraunces'] text-xl">Recent events</h3>
              <div className="space-y-2 max-h-72 overflow-auto pr-1">
                {recentUsageEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="border border-black/20 rounded-design px-3 py-2 bg-white"
                  >
                    <p className="font-['Inter'] text-sm">
                      <span className="font-medium">{ev.feature}</span> · {ev.model} ·{" "}
                      {ev.status === "error" ? "Error" : "Success"}
                    </p>
                    <p className="font-['Inter'] text-xs text-foreground/70">
                      tokens: {ev.total_tokens ?? 0} · user: {ev.user_id}
                    </p>
                    <p className="font-['Inter'] text-xs text-foreground/70">
                      {new Date(ev.created_at).toLocaleString("en-GB")}
                    </p>
                    {ev.error_message && (
                      <p className="font-['Inter'] text-xs text-red-600 mt-1">
                        {ev.error_message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black rounded-design p-3 bg-white">
      <p className="font-['Inter'] text-xs text-foreground/60">{label}</p>
      <p className="font-['Fraunces'] text-xl">{value}</p>
    </div>
  );
}
