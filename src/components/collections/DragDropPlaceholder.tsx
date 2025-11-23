"use client";

import { MoveVertical } from "lucide-react";

interface DragDropPlaceholderProps {
  isDragging?: boolean;
  text?: string;
}

export function DragDropPlaceholder({ 
  isDragging = false, 
  text = "Drop ICPs here to add to collection" 
}: DragDropPlaceholderProps) {
  return (
    <div
      className={`
        border-2 border-dashed rounded-[10px] p-8 transition-all duration-300
        ${isDragging 
          ? 'border-button-green bg-button-green/10 scale-[1.02]' 
          : 'border-accent-grey bg-accent-grey/10'
        }
      `}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className={`
          w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-all
          ${isDragging ? 'border-button-green bg-button-green/20' : 'border-foreground/30 bg-background'}
        `}>
          <MoveVertical className={`w-8 h-8 ${isDragging ? 'text-foreground' : 'text-foreground/40'}`} />
        </div>
        <p className={`font-['Inter'] ${isDragging ? 'text-foreground' : 'text-foreground/60'}`}>
          {text}
        </p>
      </div>
    </div>
  );
}

// Visual lifted state for ICP cards during drag
export function ICPCardDragState() {
  return (
    <div className="bg-background border-2 border-button-green rounded-[10px] p-6 shadow-2xl opacity-80 rotate-2 scale-105 transition-all">
      {/* This is a visual representation only - actual drag implementation will come later */}
      <div className="h-48 flex items-center justify-center">
        <MoveVertical className="w-8 h-8 text-foreground/40" />
      </div>
    </div>
  );
}
