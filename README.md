# 🎓 Student Records Portal

A modern, full-stack college/university student management system faithfully crafted from the **Stitch / Figma design specification**. Built with a **React.js + Vite** frontend, **Node.js + Express.js** REST API, and **MySQL** database persistence.

---

## 📌 Features & Visual Highlights

- **Exact Stitch UI Fidelity**:
  - Light university canvas palette (`#F8FAFC`), rounded cards (`20px`), subtle shadows, and crisp typography (`Plus Jakarta Sans`).
  - Mobile-first responsive layout that expands seamlessly to tablet and desktop screens.
  - Interactive bottom navigation bar (`Directory`, `Analytics`, `Admissions`, `Settings`).
- **Dashboard & Real-time Statistics**:
  - Live metric cards for **Total Students** and **Total Departments** derived directly from MySQL.
  - Interactive search bar with instant filtering by **Student Name** or **Register Number**.
  - Department carousel filter pills (`All Departments`, `Computer Science`, `Information Technology`, `Electronics & Comm`, `Mechanical`, `Civil`, `Electrical`).
  - Pagination controls (`Showing 1–4 of X students`) for high-volume datasets.
- **Full CRUD Operations**:
  - **Create**: Add student with name, department, unique register number, phone number, and optional photo upload with client preview.
  - **Read**: Dynamic student cards and full-featured Student Details profile page with verified status badges and enrollment info.
  - **Update**: Pre-filled edit form to update student records with uniqueness validation.
  - **Delete**: Stitch-style confirmation modal with drag-handle, destructive red styling, and audit log reference.
- **Robust Architecture**:
  - React communicates exclusively via Express REST API — **never directly to MySQL**.
  - Auto-initializing database pool with schema migration and initial seed data.
  - Input validation and duplicate register number conflict prevention on both frontend and backend.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Lucide React, Axios |
| **Backend** | Node.js, Express.js, Multer, Cors, Dotenv |
| **Database** | MySQL (with `mysql2/promise` connection pooling) |
| **Typography** | Google Fonts — Plus Jakarta Sans |

---

## 🏛 Architecture

```
┌─────────────────────────────────┐
│     React 19 Frontend (Vite)    │
│  http://localhost:5173          │
└───────────────┬─────────────────┘
                │ HTTP / REST API (Axios + Vite Proxy)
                ▼
┌─────────────────────────────────┐
│   Node.js / Express REST API    │
│  http://localhost:5000          │
└───────────────┬─────────────────┘
                │ mysql2 connection pool
                ▼
┌─────────────────────────────────┐
│         MySQL Database          │
│  Database: student_portal       │
│  Table: students                │
└─────────────────────────────────┘
```

---

## 🗄 Database Schema

The database table `students` is automatically created on backend startup if it doesn't already exist:

```sql
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  register_number VARCHAR(30) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Core Data Fields

Each student record stores strictly the core fields:
1. `name` — Full student name (VARCHAR 100)
2. `department` — Academic department (VARCHAR 100)
3. `register_number` — Unique student ID / roll number (VARCHAR 30)
4. `phone` — Contact phone number (VARCHAR 15)
5. `image_url` — Stored photo URL / upload path (TEXT)

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory (see `backend/.env.example`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_portal
DB_PORT=3306
PORT=5000
```

> **Note**: Sensitive credentials are kept inside `.env` and excluded via `.gitignore`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) running on `localhost:3306`

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dineshdk021105-art/student-records-portal.git
   cd "Student details"
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

---

### Running the Application

#### 1. Start the Backend API Server
```bash
cd backend
npm start
```
*The backend connects to MySQL, creates the `student_portal` database and `students` table automatically, and listens on `http://localhost:5000`.*

#### 2. Start the Frontend Dev Server
In a new terminal:
```bash
cd frontend
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get paginated students (supports `?search=`, `?department=`, `?page=`, `?limit=`) |
| `GET` | `/api/students/stats` | Get aggregate dashboard metrics (Total Students, Departments, Recent additions) |
| `GET` | `/api/students/:id` | Get a single student by ID |
| `POST` | `/api/students` | Create a new student (accepts JSON or `multipart/form-data` with photo upload) |
| `PUT` | `/api/students/:id` | Update an existing student record |
| `DELETE`| `/api/students/:id` | Permanently delete a student record |
| `GET` | `/api/health` | Health check endpoint |

---

## 🧪 Testing the Complete CRUD Flow

1. **Create**: Click **"+ Add Student"**, fill out the form (e.g. Name, Department, Register Number, Phone, Photo), and click **"Add Student"**. A success toast notification will appear and redirect to the dashboard.
2. **Read / Search**: Use the search input or department filter chips on the dashboard to instantly filter students.
3. **View Details**: Click **"View details →"** on any card to view the Stitch-style profile page with enrollment info and verified badges.
4. **Update**: Click the pencil icon on the card or **"Edit Student Record"** on the details page. Update fields and submit.
5. **Delete**: Click the trash icon or **"Delete Student"**. The bottom-sheet confirmation modal opens with student verification details. Confirming deletes the record from MySQL and refreshes the student list.

---

## 📄 License

This project is licensed under the ISC License.
