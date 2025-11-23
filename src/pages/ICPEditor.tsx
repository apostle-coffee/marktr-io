"use client";

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  Download, 
  Lock,
  Plus,
  X,
  Sparkles,
  Pencil,
  Check,
  Trash2,
  Undo2
} from "lucide-react";
// Placeholder avatar - replace with actual image
const avatarSarah = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face";

export default function ICPEditor() {
  const { id } = useParams();
  const [userTier, setUserTier] = useState<"free" | "paid">("free");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock ICP data - would come from backend
  const [icpData, setICPData] = useState({
    persona_name: "Sarah the Startup Founder",
    age_range: "28-38",
    bio: "Early-stage tech founder seeking product-market fit",
    avatar: avatarSarah,
    circleColor: "#BBA0E5",
    goals: [
      "Validate product-market fit quickly",
      "Build a scalable customer acquisition strategy",
      "Understand target audience deeply"
    ],
    pain_points: [
      "Limited budget for market research",
      "Wasting time on wrong customer segments",
      "Struggling to articulate value proposition clearly"
    ],
    buying_triggers: [
      "Fast implementation and results",
      "Affordable pricing for early-stage companies",
      "Proven case studies from similar startups"
    ],
    behaviours: [
      "Active on LinkedIn and Twitter/X",
      "Consumes startup podcasts and newsletters",
      "Attends virtual networking events weekly"
    ],
    messaging: [
      "Speed and efficiency messaging",
      "ROI-focused language",
      "Founder-to-founder tone"
    ],
    content_pillars: [
      "Product-market fit frameworks",
      "Customer research best practices",
      "Startup growth strategies"
    ],
    meta_lookalike: "Tech founders, 25-40, interested in SaaS, entrepreneurship, product management. Engaged with Y Combinator, Product Hunt, TechCrunch."
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate AI regeneration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleExport = (format: "pdf" | "json") => {
    if (userTier === "free") {
      alert("Upgrade to unlock exports");
      return;
    }
    console.log(`Export as ${format}`);
  };

  const EditableListSection = ({ 
    title, 
    items, 
    field, 
    isLocked = false 
  }: { 
    title: string; 
    items: string[]; 
    field: string;
    isLocked?: boolean;
  }) => {
    const [localItems, setLocalItems] = useState(items);
    const [newItem, setNewItem] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [history, setHistory] = useState<string[][]>([items]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [showUndo, setShowUndo] = useState(false);

    const saveToHistory = (newItems: string[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newItems);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setLocalItems(newItems);
      
      // Show undo button briefly
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 3000);
    };

    const handleUndo = () => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setLocalItems(history[newIndex]);
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 3000);
      }
    };

    const addItem = () => {
      if (newItem.trim() && !isLocked) {
        const newItems = [...localItems, newItem.trim()];
        saveToHistory(newItems);
        setNewItem("");
      }
    };

    const removeItem = (index: number) => {
      if (!isLocked) {
        const newItems = localItems.filter((_, i) => i !== index);
        saveToHistory(newItems);
      }
    };

    const startEditing = (index: number, text: string) => {
      if (!isLocked) {
        setEditingIndex(index);
        setEditingText(text);
      }
    };

    const saveEdit = (index: number) => {
      if (editingText.trim()) {
        const updatedItems = [...localItems];
        updatedItems[index] = editingText.trim();
        saveToHistory(updatedItems);
      }
      setEditingIndex(null);
      setEditingText("");
    };

    const cancelEdit = () => {
      setEditingIndex(null);
      setEditingText("");
    };

    return (
      <div className={`relative ${isLocked ? 'opacity-60' : ''}`}>
        {isLocked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-[10px] z-10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-foreground/60" />
          </div>
        )}
        
        <h3 className="font-['Fraunces'] text-lg mb-3">{title}</h3>
        
        <ul className="space-y-2 mb-3">
          {localItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2 group">
              {editingIndex === index ? (
                <>
                  <Input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') saveEdit(index);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="flex-1 border-black rounded-[10px] font-['Inter'] text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                    title="Save"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </>
              ) : (
                <>
                  <span 
                    className="font-['Inter'] text-sm text-foreground/80 flex-1 cursor-pointer hover:text-foreground transition-colors py-1 px-2 -mx-2 rounded hover:bg-accent-grey/20"
                    onClick={() => !isLocked && startEditing(index, item)}
                    title={!isLocked ? "Click to edit" : ""}
                  >
                    • {item}
                  </span>
                  {!isLocked && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(index, item)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3 h-3 text-blue-600" />
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

        {!isLocked && (
          <div className="flex gap-2">
            <Input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder={`Add ${title.toLowerCase()}...`}
              className="flex-1 border-black rounded-[10px] font-['Inter'] text-sm"
            />
            <Button
              onClick={addItem}
              size="sm"
              variant="outline"
              className="border-black rounded-[10px] px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}

        {showUndo && (
          <div className="mt-2">
            <Button
              onClick={handleUndo}
              size="sm"
              variant="outline"
              className="border-black rounded-[10px] px-3"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-warm-grey bg-background sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-['Inter']">Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={isRefreshing}
                className="border-black rounded-[10px] px-4 py-2 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh with AI</span>
              </Button>

              <Button
                onClick={() => handleExport('pdf')}
                variant="outline"
                className="border-black rounded-[10px] px-4 py-2 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-6 py-2 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="bg-background border border-black rounded-[10px] p-8 shadow-md mb-8 animate-fade-in-up">
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar & Color Picker */}
            <div className="flex-shrink-0">
              <div className="relative mb-3">
                <div 
                  className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: icpData.circleColor }}
                >
                  <img 
                    src={icpData.avatar} 
                    alt={icpData.persona_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-background border border-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  title="Change avatar"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
              
              {/* Color Picker below avatar */}
              <div className="text-center">
                <label className="block font-['Inter'] text-xs text-foreground/70 mb-2">
                  Badge Color
                </label>
                <input
                  type="color"
                  value={icpData.circleColor}
                  onChange={(e) => setICPData({ ...icpData, circleColor: e.target.value })}
                  className="w-12 h-12 rounded-[10px] border border-black cursor-pointer mx-auto block"
                />
              </div>
            </div>

            {/* Name & Bio */}
            <div className="flex-1">
              <Input
                type="text"
                value={icpData.persona_name}
                onChange={(e) => setICPData({ ...icpData, persona_name: e.target.value })}
                className="font-['Fraunces'] text-2xl mb-3 border-black rounded-[10px]"
              />
              
              <Input
                type="text"
                value={icpData.age_range}
                onChange={(e) => setICPData({ ...icpData, age_range: e.target.value })}
                placeholder="Age range (e.g., 28-38)"
                className="font-['Inter'] text-sm mb-3 border-black rounded-[10px]"
              />

              <Textarea
                value={icpData.bio}
                onChange={(e) => setICPData({ ...icpData, bio: e.target.value })}
                className="font-['Inter'] text-sm italic border-black rounded-[10px] resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Free Sections */}
        <div className="space-y-8">
          {/* Goals */}
          <div className="bg-background border border-black rounded-[10px] p-6 shadow-md animate-fade-in-up delay-100">
            <EditableListSection
              title="Goals & Motivations"
              items={icpData.goals}
              field="goals"
            />
          </div>

          {/* Pain Points */}
          <div className="bg-background border border-black rounded-[10px] p-6 shadow-md animate-fade-in-up delay-150">
            <EditableListSection
              title="Pain Points"
              items={icpData.pain_points}
              field="pain_points"
            />
          </div>

          {/* Buying Triggers */}
          <div className="bg-background border border-black rounded-[10px] p-6 shadow-md animate-fade-in-up delay-200">
            <EditableListSection
              title="Buying Triggers"
              items={icpData.buying_triggers}
              field="buying_triggers"
            />
          </div>

          {/* Locked Sections for Free Users */}
          <div className="bg-background border border-black rounded-[10px] p-6 shadow-md animate-fade-in-up delay-250">
            <EditableListSection
              title="Behaviour & Online Habits"
              items={icpData.behaviours}
              field="behaviours"
              isLocked={userTier === "free"}
            />
          </div>

          <div className="bg-background border border-black rounded-[10px] p-6 shadow-md animate-fade-in-up delay-300">
            <EditableListSection
              title="Messaging That Resonates"
              items={icpData.messaging}
              field="messaging"
              isLocked={userTier === "free"}
            />
          </div>

          <div className="bg-background border border-black rounded-[10px] p-6 shadow-md animate-fade-in-up delay-350">
            <EditableListSection
              title="Content Pillars"
              items={icpData.content_pillars}
              field="content_pillars"
              isLocked={userTier === "free"}
            />
          </div>

          {/* Meta Lookalike */}
          <div className="bg-background border border-black rounded-[10px] p-6 shadow-md animate-fade-in-up delay-400">
            <div className={`relative ${userTier === "free" ? 'opacity-60' : ''}`}>
              {userTier === "free" && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-[10px] z-10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-foreground/60" />
                </div>
              )}
              
              <h3 className="font-['Fraunces'] text-lg mb-3">Meta Lookalike Audience</h3>
              <Textarea
                value={icpData.meta_lookalike}
                onChange={(e) => setICPData({ ...icpData, meta_lookalike: e.target.value })}
                className="font-['Inter'] text-sm border-black rounded-[10px]"
                rows={3}
                disabled={userTier === "free"}
              />
            </div>
          </div>
        </div>

        {/* Upgrade CTA for Free Users */}
        {userTier === "free" && (
          <div className="mt-12 text-center animate-fade-in-up">
            <div className="bg-gradient-to-br from-[#FFD336]/20 to-[#FF9922]/20 border border-black rounded-[10px] p-8">
              <Lock className="w-8 h-8 mx-auto mb-4 text-foreground/60" />
              <h3 className="font-['Fraunces'] text-xl mb-3">
                Unlock full editing & exports
              </h3>
              <p className="font-['Inter'] text-foreground/70 mb-6 max-w-md mx-auto">
                Upgrade to edit all sections, export to PDF/JSON, and unlock advanced features.
              </p>
              <Button
                className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-8 py-6 transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
