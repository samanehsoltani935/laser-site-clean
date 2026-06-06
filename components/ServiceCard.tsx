import Link from "next/link";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
  compact?: boolean;
}

export default function ServiceCard({ service, compact = false }: ServiceCardProps) {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <span
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl"
        aria-hidden="true"
      >
        {service.icon}
      </span>
      <h3 className="mb-2 text-lg font-bold text-gray-800">{service.title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-brand-gray">
        {service.description}
      </p>
      {!compact && (
        <ul className="mb-5 space-y-1">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-gray-600">
              <span className="text-primary" aria-hidden="true">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/contact"
        className="inline-block rounded-xl border border-primary bg-primary px-5 py-2.5 text-center text-sm font-bold text-white transition-colors hover:opacity-90"
        aria-label={`ثبت درخواست ${service.title}`}
      >
        ثبت درخواست
      </Link>
    </article>
  );
}
