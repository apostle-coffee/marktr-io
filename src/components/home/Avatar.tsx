interface AvatarProps {
  color: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ color, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${color} rounded-full border-2 border-background transition-transform hover:scale-110 hover:z-10 animate-float`}
      style={{
        animationDelay: `${Math.random() * 2}s`,
      }}
    />
  );
}

