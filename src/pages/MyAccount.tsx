import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  User, 
  CreditCard, 
  Shield, 
  AlertTriangle, 
  Download,
  CheckCircle2,
  Crown,
  Calendar,
  Mail,
  Lock,
  ChevronLeft
} from "lucide-react";

export default function MyAccount() {
  const navigate = useNavigate();
  const [name, setName] = useState("Sarah Mitchell");
  const [email, setEmail] = useState("sarah@example.com");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  
  // Mock subscription data
  const subscription = {
    plan: "annual", // "free" | "monthly" | "annual"
    price: "£29",
    frequency: "month",
    billingAmount: "£348/year",
    nextBillingDate: "December 18, 2025",
    status: "active" // "active" | "trial" | "past_due" | "canceled"
  };

  // Mock billing history
  const invoices = [
    { id: 1, date: "Nov 18, 2024", amount: "£348.00", status: "Paid", invoiceUrl: "#" },
    { id: 2, date: "Nov 18, 2023", amount: "£348.00", status: "Paid", invoiceUrl: "#" },
  ];

  const handleSaveProfile = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your ICPs and collections will be permanently deleted.")) {
      // Handle account deletion
      console.log("Account deletion confirmed");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-button-green border-black",
      trial: "bg-[#FFD336] border-black",
      past_due: "bg-[#FF6B6B] border-black text-white",
      canceled: "bg-accent-grey border-black"
    };
    
    const labels = {
      active: "Active",
      trial: "Trial",
      past_due: "Past Due",
      canceled: "Canceled"
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-['Inter'] uppercase tracking-wide ${styles[status as keyof typeof styles]}`}>
        {status === "active" && <CheckCircle2 className="w-3 h-3" />}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Back */}
      <div className="border-b border-warm-grey bg-background sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 font-['Inter'] text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* 1. PAGE HEADER */}
        <div className="mb-8">
          <h1 className="font-['Fraunces'] text-4xl mb-2">My Account</h1>
          <p className="font-['Inter'] text-foreground/70">
            Manage your profile, subscription, and settings.
          </p>
        </div>

        {/* 2. PROFILE INFORMATION BLOCK */}
        <div className="bg-[#E5E5E5]/30 border border-black rounded-[10px] p-8">
          <div className="flex items-start gap-6 mb-6">
            <User className="w-5 h-5 mt-1" />
            <div className="flex-1">
              <h2 className="font-['Fraunces'] text-2xl mb-1">Profile Information</h2>
              <p className="font-['Inter'] text-sm text-foreground/70">
                Update your personal details.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border border-black bg-accent-grey/20 flex items-center justify-center">
                <User className="w-10 h-10 text-foreground/40" />
              </div>
              <div>
                <p className="font-['Inter'] text-sm text-foreground/70 mb-1">Profile Picture</p>
                <button className="font-['Inter'] text-sm text-foreground hover:underline">
                  Change photo
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-['Inter'] text-sm">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-black rounded-[10px] font-['Inter']"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-['Inter'] text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-black rounded-[10px] font-['Inter']"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveProfile}
                disabled={saveStatus === "saving" || saveStatus === "saved"}
                className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] font-['Inter'] disabled:opacity-50"
              >
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Saved!"}
                {saveStatus === "idle" && "Save Changes"}
                {saveStatus === "error" && "Try Again"}
              </Button>
              {saveStatus === "saved" && (
                <span className="flex items-center gap-2 font-['Inter'] text-sm text-button-green">
                  <CheckCircle2 className="w-4 h-4" />
                  Changes saved successfully
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. SUBSCRIPTION STATUS BLOCK */}
        <div className="bg-gradient-to-br from-button-green/20 to-[#BBA0E5]/10 border border-black rounded-[10px] p-8">
          <div className="flex items-start gap-6 mb-6">
            <Crown className="w-5 h-5 mt-1" />
            <div className="flex-1">
              <h2 className="font-['Fraunces'] text-2xl mb-1">Subscription</h2>
              <p className="font-['Inter'] text-sm text-foreground/70">
                Manage your billing and plan.
              </p>
            </div>
            {getStatusBadge(subscription.status)}
          </div>

          <div className="space-y-4 mb-6">
            {/* Current Plan */}
            <div className="flex items-center justify-between py-3 border-b border-warm-grey">
              <span className="font-['Inter'] text-sm text-foreground/70">Current Plan</span>
              <span className="font-['Fraunces'] text-lg">
                {subscription.plan === "free" ? "Free" : subscription.plan === "monthly" ? "Monthly Pro" : "Annual Pro"}
              </span>
            </div>

            {/* Price */}
            {subscription.plan !== "free" && (
              <div className="flex items-center justify-between py-3 border-b border-warm-grey">
                <span className="font-['Inter'] text-sm text-foreground/70">Price</span>
                <span className="font-['Fraunces'] text-lg">{subscription.price}/{subscription.frequency}</span>
              </div>
            )}

            {/* Billing Amount */}
            {subscription.plan !== "free" && (
              <div className="flex items-center justify-between py-3 border-b border-warm-grey">
                <span className="font-['Inter'] text-sm text-foreground/70">Billing Amount</span>
                <span className="font-['Inter']">{subscription.billingAmount}</span>
              </div>
            )}

            {/* Next Billing Date */}
            {subscription.plan !== "free" && subscription.status === "active" && (
              <div className="flex items-center justify-between py-3">
                <span className="font-['Inter'] text-sm text-foreground/70">Next Billing Date</span>
                <span className="font-['Inter'] flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {subscription.nextBillingDate}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {subscription.plan !== "free" ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => window.open("https://polar.sh/billing", "_blank")}
                className="flex-1 bg-background hover:bg-background/90 text-foreground border border-black rounded-[10px] font-['Inter']"
              >
                Manage Subscription
              </Button>
              <Button
                onClick={() => navigate("/team")}
                className="flex-1 bg-button-green hover:bg-button-green/90 text-text-dark border border-black rounded-[10px] font-['Inter']"
              >
                Manage Team
              </Button>
            </div>
          ) : (
            // Upgrade Banner for Free Users
            <div className="bg-button-green/30 border border-black rounded-[10px] p-6">
              <p className="font-['Inter'] mb-4">
                Upgrade to unlock unlimited ICPs, content strategy, and Meta Ads data.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] font-['Inter']"
              >
                Upgrade Now
              </Button>
            </div>
          )}
        </div>

        {/* 4. BILLING HISTORY BLOCK */}
        <div className="bg-[#E5E5E5]/30 border border-black rounded-[10px] p-8">
          <div className="flex items-start gap-6 mb-6">
            <CreditCard className="w-5 h-5 mt-1" />
            <div className="flex-1">
              <h2 className="font-['Fraunces'] text-2xl mb-1">Billing History</h2>
              <p className="font-['Inter'] text-sm text-foreground/70">
                View and download your invoices.
              </p>
            </div>
          </div>

          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-left py-3 px-4 font-['Inter'] text-sm">Date</th>
                    <th className="text-left py-3 px-4 font-['Inter'] text-sm">Amount</th>
                    <th className="text-left py-3 px-4 font-['Inter'] text-sm">Status</th>
                    <th className="text-right py-3 px-4 font-['Inter'] text-sm">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr 
                      key={invoice.id}
                      className={`border-b border-warm-grey ${index % 2 === 0 ? "bg-accent-grey/10" : ""}`}
                    >
                      <td className="py-4 px-4 font-['Inter'] text-sm">{invoice.date}</td>
                      <td className="py-4 px-4 font-['Inter']">{invoice.amount}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-button-green rounded-full font-['Inter'] text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={invoice.invoiceUrl}
                          className="inline-flex items-center gap-2 font-['Inter'] text-sm text-foreground hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Empty State
            <div className="py-12 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-foreground/20" />
              <p className="font-['Inter'] text-foreground/70">
                Your invoices will appear here.
              </p>
            </div>
          )}
        </div>

        {/* 5. SECURITY SETTINGS BLOCK */}
        <div className="bg-[#E5E5E5]/30 border border-black rounded-[10px] p-8">
          <div className="flex items-start gap-6 mb-6">
            <Shield className="w-5 h-5 mt-1" />
            <div className="flex-1">
              <h2 className="font-['Fraunces'] text-2xl mb-1">Security</h2>
              <p className="font-['Inter'] text-sm text-foreground/70">
                Manage your account security settings.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Change Email */}
            <div>
              <Label htmlFor="new-email" className="font-['Inter'] text-sm mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Change Email Address
              </Label>
              <div className="flex gap-3">
                <Input
                  id="new-email"
                  type="email"
                  placeholder="new.email@example.com"
                  className="border-black rounded-[10px] font-['Inter']"
                />
                <Button className="bg-background hover:bg-background/90 text-foreground border border-black rounded-[10px] font-['Inter'] whitespace-nowrap">
                  Update Email
                </Button>
              </div>
            </div>

            {/* Change Password */}
            <div>
              <Label htmlFor="new-password" className="font-['Inter'] text-sm mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </Label>
              <div className="flex gap-3">
                <Input
                  id="new-password"
                  type="password"
                  placeholder="New password"
                  className="border-black rounded-[10px] font-['Inter']"
                />
                <Button className="bg-background hover:bg-background/90 text-foreground border border-black rounded-[10px] font-['Inter'] whitespace-nowrap">
                  Update Password
                </Button>
              </div>
            </div>

            {/* Two-Factor Authentication (Future) */}
            <div className="pt-6 border-t border-warm-grey">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Inter'] mb-1">Two-Factor Authentication</p>
                  <p className="font-['Inter'] text-sm text-foreground/70">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="bg-accent-grey/50 border border-black rounded-full px-3 py-1">
                  <span className="font-['Inter'] text-xs text-foreground/60">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. DANGER ZONE BLOCK */}
        <div className="bg-[#FFE5E5]/30 border-l-4 border-l-[#FF6B6B] border-t border-r border-b border-black rounded-[10px] p-8">
          <div className="flex items-start gap-6 mb-6">
            <AlertTriangle className="w-5 h-5 mt-1 text-[#FF6B6B]" />
            <div className="flex-1">
              <h2 className="font-['Fraunces'] text-2xl mb-1">Danger Zone</h2>
              <p className="font-['Inter'] text-sm text-foreground/70">
                Irreversible and destructive actions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-['Inter'] text-sm text-foreground/80">
              This action cannot be undone. All ICPs and collections will be permanently deleted.
            </p>
            <Button
              onClick={handleDeleteAccount}
              className="bg-background hover:bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B] rounded-[10px] font-['Inter']"
            >
              Delete Account
            </Button>
          </div>
        </div>

        {/* 7. LEGAL FOOTER */}
        <div className="pt-8 border-t border-warm-grey">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="#" className="font-['Inter'] text-sm text-foreground/60 hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <span className="text-foreground/30">•</span>
            <a href="#" className="font-['Inter'] text-sm text-foreground/60 hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span className="text-foreground/30">•</span>
            <a href="#" className="font-['Inter'] text-sm text-foreground/60 hover:text-foreground transition-colors">
              Cancellation Policy
            </a>
            <span className="text-foreground/30">•</span>
            <a href="#" className="font-['Inter'] text-sm text-foreground/60 hover:text-foreground transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

