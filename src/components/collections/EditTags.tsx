import { useEffect, useState } from "react";

type EditTagsProps = {
  tags: string[];
  onChange: (next: string[]) => void;
};

const MAX_TAGS = 3;
const MAX_LENGTH = 20;

export default function EditTags({ tags, onChange }: EditTagsProps) {
  const [value, setValue] = useState("");
  const [localTags, setLocalTags] = useState<string[]>([]);

  useEffect(() => {
    setLocalTags(tags || []);
  }, [tags]);

  const addTag = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_LENGTH) return;
    if (localTags.includes(trimmed)) return;
    if (localTags.length >= MAX_TAGS) return;
    const next = [...localTags, trimmed];
    setLocalTags(next);
    onChange(next);
    setValue("");
  };

  const removeTag = (tag: string) => {
    const next = localTags.filter((t) => t !== tag);
    setLocalTags(next);
    onChange(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {localTags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs border border-black rounded-design bg-foreground/5 flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              className="text-foreground/60 hover:text-foreground text-xs"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
        {localTags.length < MAX_TAGS && (
          <button
            type="button"
            className="px-3 py-1 text-xs border border-dashed border-black rounded-design bg-transparent hover:bg-foreground/5"
            onClick={() => {
              const input = document.getElementById("tag-input");
              input?.focus();
            }}
          >
            + Add Tag
          </button>
        )}
      </div>
      {localTags.length < MAX_TAGS && (
        <input
          id="tag-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_LENGTH}
          className="w-full border border-black rounded-design px-3 py-2 text-sm"
          placeholder="Press Enter to add tag (max 3)"
        />
      )}
    </div>
  );
}
