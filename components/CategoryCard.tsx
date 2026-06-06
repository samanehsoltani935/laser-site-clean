import Link from "next/link";
import type { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="group flex flex-col items-center rounded-2xl bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      aria-label={category.title}
    >
      <span
        className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl transition-colors group-hover:bg-primary group-hover:text-white"
        aria-hidden="true"
      >
        {category.icon}
      </span>
      <h3 className="mb-1 text-center text-sm font-bold text-gray-800">
        {category.title}
      </h3>
      <p className="text-center text-xs leading-relaxed text-brand-gray">
        {category.description}
      </p>
    </Link>
  );
}
