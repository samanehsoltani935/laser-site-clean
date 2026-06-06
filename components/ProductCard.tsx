import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/Badge";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const badgeVariantMap = {
  new: "new" as const,
  special: "special" as const,
  sale: "sale" as const,
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && product.badgeLabel && (
          <div className="absolute right-3 top-3">
            <Badge label={product.badgeLabel} variant={badgeVariantMap[product.badge]} />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold text-gray-800">
          {product.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs text-brand-gray">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-base font-extrabold text-primary">
            {product.price}
            <span className="mr-1 text-xs font-normal text-brand-gray">تومان</span>
          </span>
          <Link
            href="/contact"
            className="rounded-lg bg-brand-gray-light px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-primary hover:text-white"
            aria-label={`مشاهده ${product.title}`}
          >
            جزئیات
          </Link>
        </div>
      </div>
    </article>
  );
}
