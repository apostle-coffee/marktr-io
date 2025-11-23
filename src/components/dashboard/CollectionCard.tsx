"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Folder, MoreVertical, Edit, Trash2, ExternalLink, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    icpCount: number;
    lastUpdated: string;
    color: string;
    isLocked?: boolean;
  };
  userTier?: "free" | "paid";
  onUpgrade?: () => void;
}

export function CollectionCard({ collection, userTier = "free", onUpgrade }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isLocked = collection.isLocked && userTier === "free";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleAction = (action: string) => {
    if (isLocked && onUpgrade) {
      onUpgrade();
      return;
    }
    console.log(`Action: ${action} on collection ${collection.id}`);
  };

  return (
    <div
      className="relative group animate-fade-in-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-background border border-black rounded-[10px] overflow-hidden shadow-md transition-all duration-300 ${
        isLocked ? 'opacity-60' : 'hover:shadow-lg hover:scale-[1.02] cursor-pointer'
      }`}>
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] rounded-[10px] z-10 flex items-center justify-center">
            <div className="text-center px-4">
              <Lock className="w-8 h-8 mx-auto mb-3 text-foreground/60" />
              <p className="font-['Fraunces'] mb-2 text-sm">Upgrade to unlock</p>
              <Button
                onClick={onUpgrade}
                size="sm"
                className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-4 py-2 text-sm"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

        {/* Color Header Block */}
        <div 
          className="h-24 border-b border-black relative"
          style={{ backgroundColor: collection.color }}
        >
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 bg-background rounded-full border border-black hover:scale-105 transition-transform">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-black rounded-[10px]">
                <DropdownMenuItem 
                  onClick={() => handleAction('open')}
                  className="font-['Inter'] text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Collection
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleAction('rename')}
                  className="font-['Inter'] text-sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleAction('delete')}
                  className="font-['Inter'] text-sm text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Folder Icon */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="w-16 h-16 bg-background rounded-full border-2 border-black flex items-center justify-center shadow-md">
              <Folder className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-10 text-center">
          <h3 className="font-['Fraunces'] text-lg mb-2">
            {collection.name}
          </h3>
          
          <p className="font-['Inter'] text-sm text-foreground/70 mb-1">
            {collection.icpCount} {collection.icpCount === 1 ? 'ICP' : 'ICPs'}
          </p>
          
          <p className="font-['Inter'] text-xs text-foreground/50">
            Updated {formatDate(collection.lastUpdated)}
          </p>

          {/* Open Button - Show on Hover */}
          <div className={`mt-4 transition-opacity duration-200 ${
            isHovered && !isLocked ? 'opacity-100' : 'opacity-0'
          }`}>
            <Link to={`/collections/${collection.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-black rounded-[10px] hover:bg-accent-grey/20 transition-all"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

