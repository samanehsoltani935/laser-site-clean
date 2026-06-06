import Container from "@/components/Container";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export default function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <section className={cn("border-b border-gray-100 bg-gradient-to-l from-sky-50 to-white py-10 lg:py-14", className)}>
      <Container>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
