/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // این خط کلید ماجراست!
  images: {
    unoptimized: true, // چون گیت‌هاب‌پیجز نمی‌تونه ابزارهای بهینه‌سازِ ایمیجِ نکست رو اجرا کنه
  },
}


export default nextConfig;
