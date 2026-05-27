# BauernPlatform Backend

Backend API for BauernPlatform — a marketplace for local farm products.

## Tech Stack

- **NestJS** — Node.js framework
- **Prisma** — ORM for database
- **PostgreSQL** — database
- **Cloudinary** — image storage
- **JWT** — authentication

## Getting Started

### Prerequisites

- Node.js 18+
- Docker
- Git

### Installation

```bash
git clone https://github.com/leonidvuha/team-back-nest
cd team-back-nest
npm install
```

### Environment Variables

Copy `.env.example` and fill in the values:

```bash
cp env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://farmer_user:farm12062026P@localhost:5432/farmer_db"
JWT_SECRET=supersecretkey123
ADMIN_EMAIL=admin@farm.com
ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=do02lfyee
CLOUDINARY_API_KEY=542724579649992
CLOUDINARY_API_SECRET=57nCGpwZdtlUe2uM90BYnW25ODY
```

### Running with Docker

Start the PostgreSQL database:

```bash
docker-compose up -d
```

### Running the App

```bash
# development
npm run start:dev

# production
npm run start:prod
```

### Database Migrations

```bash
# apply migrations
npx prisma migrate dev

# reset database
npx prisma migrate reset
```

## API Endpoints

### Auth

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and get JWT token
- `GET /api/auth/me` — get current user profile

### Products

- `GET /api/products` — get all products (with pagination, sorting, filtering)
- `POST /api/products` — create a product (auth required)
- `PUT /api/products/:id` — update a product (auth required, owner only)
