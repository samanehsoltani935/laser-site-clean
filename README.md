# سیستم خدمات پس از فروش دستگاه لیزر پوست — کابوک طب

پلتفرم دیجیتال مدیریت درخواست‌های خدمات پس از فروش برای دستگاه‌های لیزر پوست.

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (httpOnly cookie)
- **Validation:** Zod
- **Charts:** Recharts
- **Direction:** RTL / Persian UI

## پیش‌نیازها

- Node.js 18+
- PostgreSQL 14+

## راه‌اندازی

```bash
# 1. نصب وابستگی‌ها
npm install

# 2. کپی فایل env
cp .env.example .env
# DATABASE_URL و JWT_SECRET را تنظیم کنید

# 3. ایجاد دیتابیس و migration
npx prisma migrate dev --name init

# 4. Seed داده‌های نمونه
npx prisma db seed

# 5. اجرای dev server
npm run dev
```

اپلیکیشن روی [http://localhost:3000](http://localhost:3000) اجرا می‌شود.

## متغیرهای محیطی

| متغیر | توضیح |
|-------|-------|
| `DATABASE_URL` | Connection string PostgreSQL |
| `JWT_SECRET` | کلید امضای JWT (حداقل ۳۲ کاراکتر در production) |
| `JWT_EXPIRES_IN` | مدت اعتبار توکن (پیش‌فرض: 7d) |
| `UPLOAD_DIR` | مسیر ذخیره فایل (پیش‌فرض: public/uploads) |

## کاربران Demo

| نقش | ایمیل | رمز عبور |
|-----|-------|----------|
| مدیر | manager@cabokteb.ir | Admin123! |
| تکنسین ۱ | tech1@cabokteb.ir | Tech123! |
| تکنسین ۲ | tech2@cabokteb.ir | Tech123! |
| مشتری | customer1@cabokteb.ir | Customer123! |

## مسیرهای اصلی

| مسیر | توضیح |
|------|-------|
| `/login` | ورود |
| `/register` | ثبت‌نام کلینیک |
| `/customer/dashboard` | داشبورد مشتری |
| `/customer/devices` | دستگاه‌ها (+ مودال افزودن) |
| `/customer/requests` | درخواست‌ها |
| `/technician/requests` | درخواست‌های تکنسین |
| `/manager/dashboard` | داشبورد KPI |
| `/manager/requests` | مدیریت درخواست‌ها |
| `/manager/users` | مدیریت کاربران |
| `/manager/spare-parts` | موجودی قطعات |

## API Endpoints

- `POST /api/auth/login` — ورود
- `POST /api/auth/register` — ثبت‌نام
- `POST /api/auth/logout` — خروج
- `GET /api/me` — اطلاعات کاربر جاری
- `GET/POST/PUT/DELETE /api/devices` — CRUD دستگاه
- `GET/POST /api/requests` — درخواست‌ها
- `PUT /api/requests/:id/status` — تغییر وضعیت
- `PUT /api/requests/:id/assign` — اختصاص تکنسین
- `GET/POST /api/service-reports` — گزارش سرویس
- `GET/POST/PUT /api/spare-parts` — قطعات یدکی
- `POST /api/messages` — پیام
- `GET /api/notifications` — اعلان‌ها
- `GET /api/manager/kpis` — KPIs مدیریت

## تست

```bash
npm test
```

## ساختار پروژه

```
app/           # Pages & API routes
components/    # UI components
lib/
  auth/        # JWT & session
  db/          # Prisma client
  domain/      # Business rules (warranty, SLA)
  services/    # Application layer
  validations/ # Zod schemas
prisma/        # Schema & seed
```

## افزودن دستگاه (مشتری)

در صفحه `/customer/devices` دکمه **افزودن دستگاه** مودال را باز می‌کند. فرم شامل:
- نام دستگاه
- مدل (Select)
- شماره سریال
- تاریخ نصب
- شعبه

پس از ثبت موفق، مودال بسته شده و `router.refresh()` لیست را به‌روز می‌کند.

## Notification Service

سرویس mock در `lib/services/notification.service.ts` — آماده برای اتصال SMS/Firebase.

## License

Private — Cabok Teb
