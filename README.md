# JOO HIGH SCHOOL – NEW YEAR PARTY 2026

Premium dark-mode билет жүйесі: QR билеттер, Curator share, Admin dashboard, Scanner check-in.

## Stack
- Next.js App Router (TypeScript)
- Tailwind CSS (glassmorphism, dark default)
- Prisma schema for PostgreSQL (Role-based users)
- Framer Motion, lucide-react icons
- QR generation via [`qrcode`](https://github.com/soldair/node-qrcode)

## Құрылым
- `/` — Admin/Curator стиліндегі дашборд (кесте, фильтр, статистика)
- `/ticket/[qrToken]` — Public билет беті, үлкен QR + share / copy / download
- `/scanner` — Scanner рөліне арналған жеңіл check-in экраны
- `/api/check-in` — Demo check-in API (in-memory list)
- `prisma/schema.prisma` — Рөлдер мен студенттер кестесі

## Жылдам бастау
1. `npm install` (registry қолжетімді болмағанда lock файл жоқ, сондықтан онлайн болу керек)
2. `.env` ішінде `DATABASE_URL` көрсету (PostgreSQL)
3. `npm run dev` → http://localhost:3000

> Demo деректер `src/data/students.ts` ішінде. Scanner бетінде qrToken ретінде сол мәндерді қолданыңыз.

## Design highlights
- Primary `#4F46E5`, Secondary `#9333EA`, Success `#22C55E`, Error `#EF4444`
- Glass cards, hover glow, badge стилі
- Mobile-first layout

## Security note
QR ішінде тек `qrToken`. Check-in API бір рет қана белгілейді (in-memory demo).
