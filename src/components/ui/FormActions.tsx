"use client";

import Button from "./Button";

export default function FormActions({
  primaryLabel,
  cancelLabel,
  onPrimary,
  onCancel,
  disabled = false,
}: {
  primaryLabel: string;
  cancelLabel: string;
  onPrimary: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <Button
        variant="primary"
        size="lg"
        disabled={disabled}
        onClick={onPrimary}
      >
        {primaryLabel}
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
    </div>
  );
}
