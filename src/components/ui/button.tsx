// src/components/ui/button.tsx
import React from "react";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-coral text-white rounded hover:bg-coral-dark"
    />
  );
}
