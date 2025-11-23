"use client";

interface SelectChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectChip({ label, selected, onClick }: SelectChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-3 rounded-[10px] border-[1px] border-black
        transition-all duration-200
        ${selected 
          ? 'bg-button-green text-text-dark shadow-md scale-105' 
          : 'bg-white text-foreground hover:bg-accent-grey/30 hover:scale-102'
        }
      `}
    >
      {label}
    </button>
  );
}

