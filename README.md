# Lifespan+

โปรเจกต์ระบบจัดการตารางชีวิตและสุขภาพ (Organizer & Health) ที่พัฒนาด้วย React (Frontend) และ .NET 10 (Backend)

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend
- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Components:** Radix UI, Lucide Icons, Shadcn/UI
- **Language:** TypeScript

### Backend
- **Framework:** [.NET 10.0 Web API](https://dotnet.microsoft.com/)
- **Database ORM:** Entity Framework Core
- **Database:** MySQL (Pomelo)
- **Authentication:** JWT Bearer, Google OAuth

---

## 🚀 ขั้นตอนการติดตั้งและเริ่มใช้งาน

### 1. การเตรียมตัว (Prerequisites)
- ติดตั้ง [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน LTS)
- ติดตั้ง [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- ติดตั้ง [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 2. ตั้งค่า Backend (C# API)
1. เข้าไปที่โฟลเดอร์ backend:
   ```bash
   cd backend/Organizer.Api
   ```
2. คัดลอกไฟล์ตั้งค่าตัวอย่าง:
   ```bash
   cp appsettings.Example.json appsettings.json
   ```
3. แก้ไขไฟล์ `appsettings.json` โดยระบุข้อมูลของคุณ:
   - **ConnectionStrings**: ใส่รหัสผ่าน MySQL และชื่อ Database
   - **Smtp**: ใส่ข้อมูล SMTP ของคุณ (เช่น Brevo/Sendinblue)
   - **Gemini**: ใส่ API Key ของ Gemini AI
4. รันโปรเจกต์ backend:
   ```bash
   dotnet restore
   dotnet run
   ```
   *API จะรันอยู่ที่ https://localhost:7165 หรือตามที่กำหนดใน launchSettings.json*

### 3. ตั้งค่า Frontend (React)
1. กลับมาที่ root directory ของโปรเจกต์:
   ```bash
   cd ../..
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. รันโปรเจกต์ frontend:
   ```bash
   npm run dev
   ```
   *หน้าเว็บจะรันอยู่ที่ http://localhost:5173*

---

## 📂 โครงสร้างโฟลเดอร์
- `/src`: โค้ดส่วน Frontend (React components, pages, styles)
- `/backend`: โค้ดส่วน Backend (.NET API)
- `/guidelines`: เอกสารแนวทางการพัฒนา
- `.gitignore`: ไฟล์ที่ระบุสิ่งที่ Git จะไม่นำขึ้น GitHub (รวมถึง `appsettings.json` ที่มีความลับ)

## ⚠️ ข้อควรระวัง
- **อย่าลบไฟล์ `appsettings.Example.json`**: เพราะใช้เป็นต้นแบบให้เพื่อนคนอื่นในทีม
- **ห้าม Commit ข้อมูลความลับ**: เช่น รหัสผ่าน หรือ API Key ลงใน Git โดยเด็ดขาด (ระบบได้ตั้งค่าป้องกันไว้แล้วใน `.gitignore`)
