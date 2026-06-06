"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2>مشکلی پیش اومده!</h2>
        <button onClick={() => reset()} className="text-blue-500">تلاش مجدد</button>
      </div>
    </div>
  );
}
