'use client';

import { ReactNode } from "react";

interface StepContentProps {
  description: ReactNode;
}

export default function StepContent({ description }: StepContentProps) {
  return (
    <div className="p-4 bg-white border rounded-b shadow-sm text-sm text-gray-700 mt-2">
      {description}
    </div>
  );
}
