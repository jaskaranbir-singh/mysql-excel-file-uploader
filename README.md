# MySQL File Manager

A modern Next.js application for uploading CSV and Excel files directly to MySQL databases with an intuitive web interface.

## Features

- 🔐 **Secure Database Connections** - Connect to MySQL databases with validation
- 📁 **Multi-File Upload** - Upload multiple CSV and Excel files simultaneously
- 🔄 **Automatic Table Creation** - Tables are created automatically from file structure
- ✨ **Modern UI** - Beautiful, responsive interface built with Tailwind CSS and shadcn/ui
- 🔒 **Session Management** - Secure session handling with iron-session
- 📊 **Excel & CSV Support** - Parse both .xlsx, .xls, and .csv files
- 🎯 **Type-Safe** - Full TypeScript support throughout

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Database**: MySQL 8.0+
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Session Management**: iron-session
- **File Parsing**: ExcelJS, csv-parse
- **Validation**: Zod
- **Animation**: Framer Motion

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.17 or later
- MySQL 8.0 or later
- npm, yarn, or pnpm

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/jaskaranbir-singh/mysql-excel-file-uploader.git
cd mysql-excel-file-uploader
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Session Security (REQUIRED - minimum 32 characters)
SESSION_PASSWORD=3bf5a1c244c2f5b1f3b1a50f2f6f0e4d6e21e8a2b1f4f3d3c1b2a1a0f9e5678d

# Database Host Whitelist (comma-separated, optional)
# If not set, all hosts are allowed
ALLOWED_DB_HOSTS=127.0.0.1,localhost,your-server-ip

# Developer Information
NEXT_PUBLIC_DEVELOPER_NAME= Jaskaranbir Singh
NEXT_PUBLIC_DEVELOPER_URL= https://www.jaskaranbir-singh.com
```

**Important Security Notes:**

## API-KEY - Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

```

```bash
Output example:

SESSION_PASSWORD=3bf5a1c244c2f5b1f3b1a50f2f6f0e4d6e21e8a2b1f4f3d3c1b2a1a0f9e5678d
```

- Never commit `.env.local` to version control
- Use strong, randomly generated passwords in production

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Connecting to MySQL Database

1. Navigate to the home page
2. Enter your MySQL connection details:
   - **Host**: MySQL server address (e.g., 127.0.0.1)
   - **Port**: MySQL port (default: 3306)
   - **Username**: Database user
   - **Password**: Database password
   - **Database**: Target database name

3. Click "Connect to Database"

4. Set Up MySQL Database
   Option A: Using MySQL Workbench (Recommended)

a. Open MySQL 8.0 Command Line Client Terminal

b.

```bash
show databases;
```

mysql> show databases;
+--------------------+
| Database |
+--------------------+ |
| information_schema |
| mysql |
| performance_schema |
| sys |
+--------------------+

c.

```bash
CREATE DATABASE IF NOT EXISTS dummy_data;
```

mysql> show databases;
+--------------------+
| Database |
+--------------------+
| dummy_data |
| information_schema |
| mysql |
| performance_schema |
| sys |
+--------------------+
5 rows in set (0.00 sec)

d.

```bash
USE dummy_data;
```

Database changed to dummy_data

e.

```bash
 SHOW TABLES;
```

Empty set (0.00 sec) for dummy_data

### Create or Connecting to MySQL Database

Connect to your MySQL server

Click "Create a new SQL tab"

Copy and paste the following SQL commands:

```bash
 CREATE DATABASE IF NOT EXISTS dummy_data;

 CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin@123';

 CREATE USER IF NOT EXISTS 'admin'@'127.0.0.1' IDENTIFIED BY 'admin';

 GRANT ALL PRIVILEGES ON dummy_data.* TO 'admin'@'localhost';
 GRANT ALL PRIVILEGES ON dummy_data.* TO 'admin'@'127.0.0.1';

 FLUSH PRIVILEGES;
```

## 100% Fix for MySQL Connection Error

```bash

mysql -h localhost -u root -p

```

```bash
admin@123
```

```bash

DROP USER IF EXISTS 'admin'@'localhost';
DROP USER IF EXISTS 'admin'@'127.0.0.1';

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin@123';
CREATE USER 'admin'@'127.0.0.1' IDENTIFIED BY 'admin@123';

GRANT ALL PRIVILEGES ON dummy_data.* TO 'admin'@'localhost';
GRANT ALL PRIVILEGES ON dummy_data.* TO 'admin'@'127.0.0.1';

FLUSH PRIVILEGES;

EXIT;

```

### Uploading Files

1. After successful connection, you'll be redirected to the upload page
2. Click "Click to select files" or drag and drop files
3. Select one or more CSV or Excel files
4. Review selected files (you can remove any unwanted files)
5. Click "Upload Files"
6. View upload results for each file

**Notes:**

- File names are used as table names (sanitized automatically)
- Tables are created if they don't exist
- All columns are created as TEXT type with NULL allowed
- Duplicate column names are automatically made unique

## Project Structure

```
mysql-file-manager/
├── app/
│   ├── actions/
│   │   ├── connect.ts       # Database connection handler
│   │   ├── disconnect.ts    # Disconnect handler
│   │   └── upload.ts        # File upload handler
│   ├── upload/
│   │   └── page.tsx         # Upload page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home/connection page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── connection-form.tsx  # Database connection form
│   ├── upload-form.tsx      # File upload form
│   ├── view-toggle.tsx      # Navigation toggle
│   └── Footer.tsx           # Footer component
├── config/
│   ├── developer-link.ts    # Developer config
│   └── env.ts               # Environment config
├── lib/
│   ├── mysql.ts             # MySQL pool management
│   ├── parse-files.ts       # File parsing logic
│   ├── schemas.ts           # Zod schemas
│   ├── session.ts           # Session management
│   ├── sql-identifiers.ts   # SQL identifier utilities
│   └── templates.ts         # Code templates
└── public/                  # Static assets
```

## API Routes & Server Actions

### Server Actions

- **`connectAction`** - Validates and establishes MySQL connection
- **`disconnectAction`** - Clears connection session
- **`uploadAction`** - Processes and uploads files to MySQL

## Security Features

- **Host Whitelisting**: Restrict database connections to approved hosts
- **Session Encryption**: Secure session data with iron-session
- **SQL Injection Prevention**: Parameterized queries and identifier validation
- **Input Validation**: Zod schemas for all user inputs
- **Connection Pooling**: Efficient database connection management

## Configuration

```bash
New-Item .env.local -ItemType File
```

```bash
notepad .env.local

```

```bash
SESSION_PASSWORD=
```

### Database Host Whitelist

Set `ALLOWED_DB_HOSTS` in `.env.local` to restrict connections:

```env
ALLOWED_DB_HOSTS=127.0.0.1,localhost,192.168.1.100
```

If not set, all hosts are allowed (not recommended for production).

### Session Configuration

Customize session settings in `lib/session.ts`:

```typescript
export const sessionOptions: SessionOptions = {
  cookieName: "mysql-uploader-session",
  password: mustGetSessionPassword(),
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30, // 30 minutes
  },
};
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t mysql-file-manager .
docker run -p 3000:3000 --env-file .env.local mysql-file-manager
```

## Troubleshooting

### Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check firewall settings
- Ensure user has proper permissions
- Verify host is in whitelist

### Session Password Error

Error: "SESSION_PASSWORD is missing or too short"

**Solution**: Set `SESSION_PASSWORD` in `.env.local` with at least 32 characters

### File Upload Fails

- Check file format (.csv, .xlsx, .xls only)
- Verify database permissions (CREATE, INSERT)
- Review server logs for detailed errors

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Your Name**

- Website: [https://www.jaskaranbir-singh.com]
- GitHub: [https://github.com/jaskaranbir-singh]

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [ExcelJS](https://github.com/exceljs/exceljs) - Excel file parsing

## Support

**⭐ If you find this project helpful, please consider giving it a star!**
