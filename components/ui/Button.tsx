import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "ghost" | "outline" | "ink";
export type ButtonSize = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap cursor-pointer";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-border-glow text-white hover:opacity-90 shadow-[0_4px_14px_-4px_rgba(99,102,241,0.55)] hover:shadow-[0_10px_24px_-6px_rgba(99,102,241,0.55)]",
  accent:
    "bg-gradient-to-r from-accent to-accent-hover text-bg hover:opacity-90 font-semibold",
  ink: "bg-text-primary text-bg hover:opacity-90 shadow-[0_4px_14px_-4px_rgba(7,9,26,0.4)]",
  ghost: "text-text-primary/90 hover:text-text-primary hover:bg-text-primary/5",
  outline:
    "border border-border-strong text-text-primary bg-bg-card hover:bg-bg-card-hover",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  external = false,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  if (external || href.startsWith("http") || href.startsWith("mailto")) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
