import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Folder, BarChart2, Settings, Crown, ChevronLeft, Building2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface DashboardSidebarProps {
  userTier: "free" | "paid";
  onUpgrade: () => void;
  guestMode?: boolean;
  onGuestAction?: () => void;
  subscriptionLoading?: boolean;
}

export function DashboardSidebar({ 
  userTier, 
  onUpgrade,
  guestMode = false,
  onGuestAction,
  subscriptionLoading: _subscriptionLoading,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const dashboardPath = user ? "/dashboard" : "/icp-results";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, locked: false, path: dashboardPath },
    { id: "icps", label: "My ICPs", icon: Users, locked: false, path: "/icps" },
    { id: "brands", label: "My Brands", icon: Building2, locked: false, path: "/my-brands" },
    { id: "collections", label: "Collections", icon: Folder, locked: false, path: "/collections" },
    { id: "insights", label: "Insights", icon: BarChart2, locked: true, path: "/insights" },
    { id: "settings", label: "Settings", icon: Settings, locked: false, path: "/settings" },
  ];

  const mobileNavItems = navItems.filter((item) =>
    ["dashboard", "icps", "brands", "collections"].includes(item.id)
  );

  // Determine active state based on current route
  const getIsActive = (item: typeof navItems[0]) => {
    return item.path ? location.pathname.startsWith(item.path) : false;
  };

  const isGuestAllowedPath = (path?: string) => {
    if (!path) return false;
    if (path === "/icp-results") return true;
    if (path.startsWith("/icp-preview")) return true;
    return false;
  };

  return (
    <>
      <aside 
        className={`
          bg-accent-grey/20 border-r border-warm-grey transition-all duration-300 flex-shrink-0 flex-col
          hidden lg:flex
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Collapse Toggle - Desktop Only */}
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-background rounded-design transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = getIsActive(item);
            
            const buttonContent = (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-foreground' : 'text-foreground/70'}`} />
                {!isCollapsed && (
                  <>
                    <span className={`font-['Inter'] text-sm ${isActive ? '' : 'text-foreground/70'}`}>
                      {item.label}
                    </span>
                    {item.locked && userTier === "free" && (
                      <Crown className="w-3 h-3 ml-auto text-[#FFD336]" />
                    )}
                  </>
                )}
              </>
            );

            const buttonClasses = `w-full flex items-center gap-3 px-4 py-3 rounded-design transition-all group relative ${
              isActive 
                ? 'bg-background border border-black shadow-sm' 
                : item.locked
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-background/50'
            }`;

            return (
              <Link
                key={item.id}
                to={item.path || "#"}
                className={buttonClasses}
                onClick={(e) => {
                  if (guestMode && !isGuestAllowedPath(item.path)) {
                    e.preventDefault();
                    onGuestAction?.();
                    return;
                  }
                  if (item.locked) {
                    e.preventDefault();
                    onUpgrade();
                  }
                }}
              >
                {buttonContent}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile workspace navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-warm-grey bg-background/95 backdrop-blur-md">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = getIsActive(item);
            return (
              <Link
                key={`mobile-${item.id}`}
                to={item.path || "#"}
                className={`flex flex-col items-center justify-center gap-1 rounded-design px-2 py-2 text-xs ${
                  isActive ? "bg-accent-grey/40 text-foreground" : "text-foreground/70"
                }`}
                onClick={(e) => {
                  if (guestMode && !isGuestAllowedPath(item.path)) {
                    e.preventDefault();
                    onGuestAction?.();
                    return;
                  }
                  if (item.locked) {
                    e.preventDefault();
                    onUpgrade();
                  }
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="font-['Inter'] leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
