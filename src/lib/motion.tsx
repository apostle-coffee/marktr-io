import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

type MotionProps<T> = HTMLAttributes<T> & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
};

const MotionDiv = forwardRef<HTMLDivElement, MotionProps<HTMLDivElement>>(
  ({ initial, animate, exit, transition, ...rest }, ref) => (
    <div ref={ref} {...rest} />
  )
);
MotionDiv.displayName = "MotionDiv";

const MotionH1 = forwardRef<HTMLHeadingElement, MotionProps<HTMLHeadingElement>>(
  ({ initial, animate, exit, transition, ...rest }, ref) => (
    <h1 ref={ref} {...rest} />
  )
);
MotionH1.displayName = "MotionH1";

const MotionP = forwardRef<HTMLParagraphElement, MotionProps<HTMLParagraphElement>>(
  ({ initial, animate, exit, transition, ...rest }, ref) => (
    <p ref={ref} {...rest} />
  )
);
MotionP.displayName = "MotionP";

export const motion = {
  div: MotionDiv,
  h1: MotionH1,
  p: MotionP,
};

export function AnimatePresence({
  children,
  mode,
}: {
  children: ReactNode;
  mode?: string;
}) {
  void mode;
  return <>{children}</>;
}
