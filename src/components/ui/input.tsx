import * as React from "react";
import { cn } from "@/lib/utils";
/** Native, accessible input following the existing shadcn component convention. */
export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input data-slot="input" className={cn("ad-input", className)} {...props} />
  );
}
