import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border-[3px] border-[var(--accent-strong)] bg-background text-foreground hover:bg-[color-mix(in_oklch,var(--accent-strong)_8%,transparent)] hover:shadow-[0_0_10px_var(--accent-glow)]",
        destructive:
          "border-[3px] border-destructive bg-background text-destructive hover:bg-[color-mix(in_oklch,var(--destructive)_8%,transparent)] hover:shadow-[0_0_10px_color-mix(in_oklch,var(--destructive)_30%,transparent)]",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-[var(--accent-strong)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        preset:
          "border-2 border-border bg-secondary text-secondary-foreground hover:border-[var(--accent-strong)] hover:bg-accent hover:shadow-[0_0_8px_var(--accent-glow)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-14 px-6 text-base",
        xl: "h-20 px-6 text-lg font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
