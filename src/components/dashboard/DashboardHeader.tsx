"use client";

import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Moon, Sun, Menu, X, Plus, Crown } from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  onCreateNew: () => void;
  userTier: "free" | "paid";
  onUpgrade: () => void;
}

export function DashboardHeader({ onCreateNew, userTier, onUpgrade }: DashboardHeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { 
      label: "How it Works", 
      type: "scroll" as const, 
      target: "how-it-works",
      color: "#BBA0E5" // Purple
    },
    { 
      label: "Features", 
      type: "scroll" as const, 
      target: "features",
      color: "#96CBB6" // Mint green
    },
    { 
      label: "Resources", 
      type: "scroll" as const, 
      target: "resources",
      color: "#FF9922" // Orange
    },
    { 
      label: "Pricing", 
      type: "link" as const, 
      target: "/pricing",
      color: "#F57BBE" // Pink
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-grey bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-['Fraunces'] text-xl font-bold">ICP Generator</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item, index) => (
              item.type === "scroll" ? (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.target)}
                  className="relative text-sm transition-colors hover:text-text-dark after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-button-green after:transition-all hover:after:w-full flex items-center gap-1.5"
                >
                  {item.label}
                  <svg
                    width="8"
                    height="7"
                    viewBox="0 0 8 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5"
                  >
                    <path
                      d="M4 7L0.535898 0.25L7.4641 0.25L4 7Z"
                      fill={item.color}
                      stroke="black"
                      strokeWidth="1"
                    />
                  </svg>
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.target}
                  className="relative text-sm transition-colors hover:text-text-dark after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-button-green after:transition-all hover:after:w-full flex items-center gap-1.5"
                >
                  {item.label}
                  <svg
                    width="8"
                    height="7"
                    viewBox="0 0 8 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5"
                  >
                    <path
                      d="M4 7L0.535898 0.25L7.4641 0.25L4 7Z"
                      fill={item.color}
                      stroke="black"
                      strokeWidth="1"
                    />
                  </svg>
                </Link>
              )
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Create New Button - Desktop */}
            <Button
              onClick={onCreateNew}
              className="hidden md:flex bg-button-green hover:bg-button-green/90 text-text-dark border border-black rounded-[10px] transition-all hover:scale-[1.02] items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Create New</span>
              <span className="lg:hidden">New</span>
            </Button>

            {/* Upgrade Badge - Free Users Only */}
            {userTier === "free" && (
              <Button
                onClick={onUpgrade}
                variant="outline"
                className="hidden sm:flex border-black rounded-[10px] transition-all hover:scale-[1.02] items-center gap-2 bg-gradient-to-r from-[#FFD336] to-[#FF9922] text-text-dark"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden lg:inline">Upgrade</span>
              </Button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="hidden rounded-full border border-warm-grey p-2 transition-all hover:scale-110 hover:border-black md:block"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Account Avatar - Desktop */}
            <Link 
              to="/account"
              className="hidden md:flex w-10 h-10 rounded-full bg-[#BBA0E5] border border-black items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="font-['Fraunces'] text-sm">JD</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-accent-grey/20 md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-warm-grey py-4 md:hidden">
            <nav className="mb-4 flex flex-col gap-4">
              {navItems.map((item, index) => (
                item.type === "scroll" ? (
                  <button
                    key={index}
                    onClick={() => {
                      scrollToSection(item.target);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left text-sm transition-colors hover:text-text-dark"
                  >
                    <svg
                      width="8"
                      height="7"
                      viewBox="0 0 8 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 7L0.535898 0.25L7.4641 0.25L4 7Z"
                        fill={item.color}
                        stroke="black"
                        strokeWidth="1"
                      />
                    </svg>
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={index}
                    to={item.target}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-text-dark"
                  >
                    <svg
                      width="8"
                      height="7"
                      viewBox="0 0 8 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 7L0.535898 0.25L7.4641 0.25L4 7Z"
                        fill={item.color}
                        stroke="black"
                        strokeWidth="1"
                      />
                    </svg>
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  onCreateNew();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-button-green hover:bg-button-green/90 text-text-dark border border-black rounded-[10px]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New ICP
              </Button>

              {userTier === "free" && (
                <Button
                  onClick={() => {
                    onUpgrade();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-black rounded-[10px] bg-gradient-to-r from-[#FFD336] to-[#FF9922] text-text-dark"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}

              {/* Account Link - Mobile */}
              <Link 
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-2 py-3 border-t border-warm-grey hover:bg-accent-grey/20 transition-colors rounded-[10px]"
              >
                <div className="w-10 h-10 rounded-full bg-[#BBA0E5] border border-black flex items-center justify-center">
                  <span className="font-['Fraunces'] text-sm">JD</span>
                </div>
                <span className="font-['Inter'] text-sm">My Account</span>
              </Link>

              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 px-2 py-3 border-t border-warm-grey hover:bg-accent-grey/20 transition-colors rounded-[10px]"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="font-['Inter'] text-sm">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

