import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "ink";
type Size = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-ember text-white hover:bg-ember-soft shadow-[0_4px_14px_-4px_rgba(99,102,241,0.55)] hover:shadow-[0_10px_24px_-6px_rgba(99,102,241,0.55)]",
  ink:
    "bg-ink text-paper hover:bg-ink-soft shadow-[0_4px_14px_-4px_rgba(26,26,25,0.4)]",
  ghost:
    "text-ink/90 hover:text-ink hover:bg-ink/5",
  outline:
    "border border-line-strong text-ink bg-card hover:bg-paper-soft",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...rest}>
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
      <a href={href} className={classes} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} {...rest}>
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
