import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
        danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
        success: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
