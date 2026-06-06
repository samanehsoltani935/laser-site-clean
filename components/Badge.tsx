type BadgeVariant = "new" | "special" | "sale";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  new: "bg-brand-red text-white",
  special: "bg-primary text-white",
  sale: "bg-primary text-white",
};

export default function Badge({ label, variant = "new" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
