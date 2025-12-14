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

## PostgreSQL + Prisma толық орнату
Prisma v5 (repo-да бекітілген) қолданады. Егер npx арқылы v7 орнатсаңыз, `datasource url` қателігін аласыз. Сондықтан алдымен жобадағы тәуелділіктерді орнатыңыз немесе тікелей `npx prisma@5.19.1 ...` командасын пайдаланыңыз.

1. **Дерекқорды дайындау**
   - Жергілікті PostgreSQL: `docker run --name newyearparty-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=newyearparty -p 5432:5432 -d postgres:16`
   - Немесе кез келген дайын PostgreSQL instance қолданыңыз.

2. **.env құру**
   - `.env.example` файлын көшіріңіз: `cp .env.example .env`
   - `DATABASE_URL` мәнін өз дерекқорыңызға сәйкестендіріңіз (формат: `postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public`).

3. **Тәуелділіктерді орнату (Prisma v5 алу үшін)**
   - `npm install`
   - Егер желі болмай қалса және `npx prisma migrate dev` v7 сұраса, нұсқаны күштеп көрсетіңіз: `npx prisma@5.19.1 migrate dev --name init --schema prisma/schema.prisma`

4. **Миграция және клиент генерациясы**
   - `npx prisma migrate dev --name init` — кестелерді құрады
   - `npx prisma generate` — Prisma Client шығарады

5. **Тексеру / деректер көру** (қалауыңыз бойынша)
   - `npx prisma studio` — кестелерді браузерде көру

6. **Қосымшаны іске қосу**
   - `npm run dev` және http://localhost:3000 адресіне кіріңіз

> Пайдалы: басқа Prisma нұсқасын қолданғыңыз келсе, жаңа конфигурация (Prisma 7) үшін `prisma.config.ts` пайдаланып datasource URL беру керек. Осы репо ішінде v5 қолданылады, сондықтан жоғарыдағы командаларды сақтаңыз.

## Design highlights
- Primary `#4F46E5`, Secondary `#9333EA`, Success `#22C55E`, Error `#EF4444`
- Glass cards, hover glow, badge стилі
- Mobile-first layout

## Security note
QR ішінде тек `qrToken`. Check-in API бір рет қана белгілейді (in-memory demo).
