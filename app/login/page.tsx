import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { LoadingSpinner } from "@/components/shared/EmptyState";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
