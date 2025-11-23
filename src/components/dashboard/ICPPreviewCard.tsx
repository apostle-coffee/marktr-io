"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  MoreVertical, 
  Lock,
  Download,
  Share2,
  FolderPlus,
  Palette,
  FileText,
  FolderMinus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ICPPreviewCardProps {
  icp: {
    id: string;
    persona_name: string;
    age_range?: string;
    bio: string;
    avatar: string;
    circleColor: string;
    tags: string[];
    created_date: string;
    isLocked?: boolean;
  };
  userTier: "free" | "paid";
  onUpgrade: () => void;
  isInCollection?: boolean;
}

export function ICPPreviewCard({ icp, userTier, onUpgrade, isInCollection }: ICPPreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isLocked = icp.isLocked && userTier === "free";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleAction = (action: string) => {
    if (isLocked) {
      onUpgrade();
      return;
    }
    console.log(`Action: ${action} on ICP ${icp.id}`);
  };

  return (
    <div
      className="relative group animate-fade-in-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div 
        className={`bg-background border border-black rounded-[10px] p-6 shadow-md transition-all duration-300 ${
          isLocked 
            ? 'opacity-60' 
            : 'hover:shadow-lg hover:scale-[1.02]'
        }`}
      >
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] rounded-[10px] z-10 flex items-center justify-center">
            <div className="text-center px-4">
              <Lock className="w-8 h-8 mx-auto mb-3 text-foreground/60" />
              <p className="font-['Fraunces'] mb-2">Upgrade to unlock</p>
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

        {/* Avatar & Color Badge */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div 
              className="w-16 h-16 rounded-full border border-black flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: icp.circleColor }}
            >
              <img 
                src={icp.avatar} 
                alt={icp.persona_name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-['Fraunces'] text-lg mb-1 truncate">
              {icp.persona_name}
            </h3>
            {icp.age_range && (
              <p className="font-['Inter'] text-xs text-foreground/60 mb-1">
                {icp.age_range}
              </p>
            )}
          </div>

          {/* Overflow Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-accent-grey/30 rounded transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-black rounded-[10px]">
              <DropdownMenuItem 
                onClick={() => handleAction('change-color')}
                className="font-['Inter'] text-sm"
              >
                <Palette className="w-4 h-4 mr-2" />
                Change Color
              </DropdownMenuItem>
              {!isInCollection ? (
                <DropdownMenuItem 
                  onClick={() => handleAction('add-to-collection')}
                  className="font-['Inter'] text-sm"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Add to Collection
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleAction('remove-from-collection')}
                  className="font-['Inter'] text-sm text-orange-600"
                >
                  <FolderMinus className="w-4 h-4 mr-2" />
                  Remove from Collection
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleAction('export-pdf')}
                className="font-['Inter'] text-sm"
                disabled={isLocked}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF {isLocked && <Lock className="w-3 h-3 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAction('export-meta')}
                className="font-['Inter'] text-sm"
                disabled={isLocked}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Meta Data {isLocked && <Lock className="w-3 h-3 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAction('share')}
                className="font-['Inter'] text-sm"
                disabled={isLocked}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Link {isLocked && <Lock className="w-3 h-3 ml-auto" />}
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

        {/* Bio */}
        <p className="font-['Inter'] text-sm text-foreground/70 mb-4 line-clamp-2">
          {icp.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {icp.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-accent-grey/30 border border-black rounded-full font-['Inter'] text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Date */}
        <p className="font-['Inter'] text-xs text-foreground/50 mb-4">
          Created {formatDate(icp.created_date)}
        </p>

        {/* Action Buttons - Show on Hover */}
        <TooltipProvider>
          <div className={`grid grid-cols-4 gap-2 transition-opacity duration-200 ${
            isHovered && !isLocked ? 'opacity-100' : 'opacity-0'
          }`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Link to={`/dashboard/icp/${icp.id}`} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-black rounded-[10px] hover:bg-accent-grey/20 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent className="border-black rounded-[10px] font-['Inter']">
                <p>View full ICP profile</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Link to={`/pages/ICPEditor/${icp.id}`} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-black rounded-[10px] hover:bg-accent-grey/20 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent className="border-black rounded-[10px] font-['Inter']">
                <p>Edit ICP details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction('duplicate')}
                    className="w-full border-black rounded-[10px] hover:bg-button-green/20 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="border-black rounded-[10px] font-['Inter']">
                <p>Duplicate this ICP</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction('export')}
                    className="w-full border-black rounded-[10px] hover:bg-accent-grey/20 transition-all"
                    disabled={isLocked}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="border-black rounded-[10px] font-['Inter']">
                <p>{isLocked ? 'Upgrade to export' : 'Export ICP data'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

