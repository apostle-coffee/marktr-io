"use client";

import { Home, Folder, BarChart3, Settings, Crown, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface DashboardSidebarProps {
  currentView: "icps" | "collections";
  onViewChange: (view: "icps" | "collections") => void;
  userTier: "free" | "paid";
  onUpgrade: () => void;
}

export function DashboardSidebar({ 
  currentView, 
  onViewChange, 
  userTier, 
  onUpgrade

}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: "icps", label: "My ICPs", icon: Home, locked: false, path: "/dashboard" },
    { id: "collections", label: "Collections", icon: Folder, locked: false, path: "/collections" },
    { id: "insights", label: "Insights", icon: BarChart3, locked: true, path: null },
    { id: "settings", label: "Settings", icon: Settings, locked: false, path: null },
  ];

  // Determine active state based on current route
  const getIsActive = (item: typeof navItems[0]) => {
    if (item.path) {
      return location.pathname.startsWith(item.path);
    }
    return currentView === item.id;
  };

  const handleNavClick = (id: string) => {
    if (id === "icps" || id === "collections") {
      onViewChange(id as "icps" | "collections");
    }
  };

  return (
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
          className="p-2 hover:bg-background rounded-[10px] transition-colors"
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

          const buttonClasses = `w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all group relative ${
            isActive 
              ? 'bg-background border border-black shadow-sm' 
              : item.locked
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-background/50'
          }`;

          if (item.path && !item.locked) {
            return (
              <Link
                key={item.id}
                to={item.path}
                className={buttonClasses}
              >
                {buttonContent}
              </Link>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              disabled={item.locked}
              className={buttonClasses}
            >
              {buttonContent}
            </button>
          );
        })}
      </nav>

      {/* Upgrade CTA - Free Tier */}
      {userTier === "free" && !isCollapsed && (
        <div className="p-4 m-3 bg-gradient-to-br from-[#FFD336]/20 to-[#FF9922]/20 border border-black rounded-[10px]">
          <div className="mb-3">
            <Crown className="w-6 h-6 text-[#FF9922] mb-2" />
            <h3 className="font-['Fraunces'] text-sm mb-1">Upgrade to Pro</h3>
            <p className="font-['Inter'] text-xs text-foreground/70">
              Unlock unlimited ICPs and advanced features
            </p>
          </div>
          <Button
            onClick={onUpgrade}
            className="w-full bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] py-2 text-sm transition-all hover:scale-[1.02]"
          >
            Upgrade Now
          </Button>
        </div>
      )}

      {/* Collapsed Upgrade Icon */}
      {userTier === "free" && isCollapsed && (
        <div className="p-3 flex justify-center">
          <button
            onClick={onUpgrade}
            className="w-12 h-12 bg-gradient-to-br from-[#FFD336] to-[#FF9922] rounded-full border border-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Crown className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}
    </aside>
  );
}

