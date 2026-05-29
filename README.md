# Dune Tourist Camp - Вэб систем

Dune Tourist Camp-ын захиалга болон удирдлагын цогц систем. Энэхүү төсөл нь хэрэглэгчийн захиалгын вэб болон админ удирдлагын хэсгээс бүрдэнэ.

---

## 🚀 Технологийн сан (Tech Stack)

- **Framework:** Next.js 15 (App Router)
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS, Global CSS
- **Icons:** Lucide React
- **UI Components:** Framer Motion (optional), Custom Components

---

## 🛠️ Суулгах заавар (Installation)

### 1. Урьдчилсан нөхцөл
Таны компьютерт **Node.js** (v18 эсвэл түүнээс дээш) суусан байх шаардлагатай.

### 2. Сангуудыг суулгах
Терминал дээр төслийн үндсэн хавтсанд очиж дараах командыг ажиллуулна:
```bash
npm install
```

### 3. Өгөгдлийн сан (Database)
SQLite ашиглаж байгаа тул өгөгдлийн санг үүсгэж, Prisma client-ийг бэлтгэнэ:
```bash
npx prisma generate
npx prisma db push
```

---

## 🏃 Ажиллуулах заавар (How to Run)

Энэхүү төсөл нь хэрэглэгчийн вэб болон админ хэсгийг тусдаа портууд дээр зэрэг ажиллуулах зориулалттай.

### Хэрэглэгчийн вэб болон Админыг зэрэг ажиллуулах:
Файл түгжигдэх алдаанаас (`EBUSY`) сэргийлэхийн тулд **хоёр тусдаа** терминал дээр ажиллуулна уу:

**Терминал 1: Хэрэглэгчийн вэб (Port 3000)**
```bash
npm run dev:web
```
*Хаяг: [http://localhost:3000](http://localhost:3000)*

**Терминал 2: Админ удирдлага (Port 3001)**
```bash
npm run dev:admin
```
*Хаяг: [http://localhost:3001](http://localhost:3001)*

---

## 📂 Төслийн бүтэц (Project Structure)

- `/app`: Next.js App Router (Хуудаснууд болон API)
- `/src/components`: Дахин ашиглагдах UI компонентууд
- `/src/styles`: CSS загварын файлууд
- `/public`: Зураг болон статик файлууд
- `/prisma`: Өгөгдлийн сангийн схем

---

## 🔑 Үндсэн боломжууд (Key Features)

- **Booking System:** Өрөө захиалгын систем (Check-in/out).
- **Experiences:** Морь унах, ресторан, аялал захиалга.
- **Admin Dashboard:** Өрөө, цэс, үйлчилгээ болон захиалгыг удирдах хэсэг.
- **Modern UI:** Next.js 15, Tailwind CSS ашигласан хурдан бөгөөд загварлаг интерфэйс.
- **Infrastructure:** Starlink интернэт, Спортын талбай зэрэг нэмэлт мэдээлэл бүхий хэсгүүд.

---

## ⚠️ Анхааруулга (Notes)

- **EBUSY Error:** Хэрэв "resource busy" гэсэн алдаа гарвал `.next`, `.next-web`, эсвэл `.next-admin` хавтаснуудыг устгаад дахин ажиллуулна уу.
- **Database:** `prisma/dev.db` файл дотор таны бүх өгөгдөл хадгалагдах тул устгаж болохгүй.
