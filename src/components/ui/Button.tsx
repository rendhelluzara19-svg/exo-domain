import { cn } from "@/lib/utils";
import React from "react";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: "bg-[#D4AF37] text-white hover:bg-[#C5A059] shadow-sm",
      secondary: "bg-[#15241C] text-white hover:bg-[#1A2D23] shadow-sm",
      outline: "border-2 border-[#E5E7EB] text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]",
      ghost: "hover:bg-gray-100 text-gray-700"
    };

    return (
      <button
        ref={ref}
        className={cn("px-4 py-2 rounded-2xl font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none", variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
