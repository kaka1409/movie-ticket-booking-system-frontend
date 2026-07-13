import { CheckCircle2, Circle } from "lucide-react";

type Requirement = {
  label: string;
  test: (value: string) => boolean;
};

const REQUIREMENTS: Requirement[] = [
  { label: "At least 8 characters long", test: (v) => v.length >= 8 },
  {
    label: "Contains at least one uppercase letter",
    test: (v) => /[A-Z]/.test(v),
  },
  { label: "Contains at least one number", test: (v) => /[0-9]/.test(v) },
  {
    label: "Contains a special character (!@#$%^&*)",
    test: (v) => /[!@#$%^&*]/.test(v),
  },
];

export default function PasswordRequirements({
  password,
}: {
  password: string;
}) {
  return (
    <div className="mt-8 rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <h2 className="mb-3 text-lg font-bold text-(--color-text-primary)">
        Password Requirements
      </h2>
      <ul className="flex flex-col gap-2">
        {REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <li key={req.label} className="flex items-center gap-2">
              {met ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-(--color-gold)" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-(--color-text-muted)" />
              )}
              <span
                className={
                  met
                    ? "text-sm text-(--color-text-primary)"
                    : "text-sm text-(--color-text-muted)"
                }
              >
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
