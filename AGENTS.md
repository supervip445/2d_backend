# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
Thai 2D/3D lottery betting platform with three components:
- **Backend API** (Express.js + TypeScript + Prisma) at repo root — runs on port 3000 by default
- **Admin Panel** (React + Vite) in `2_3_admin_panel/` — runs on port 5173
- **Player App** (React Native / Expo) in `player_app/` — mobile only, not needed for web dev

### MySQL setup (required)
MySQL 8.0 must be running before the backend can start. In the cloud VM:
```bash
sudo mkdir -p /var/run/mysqld && sudo chown mysql:mysql /var/run/mysqld
sudo mysqld --user=mysql --datadir=/var/lib/mysql --socket=/var/run/mysqld/mysqld.sock --pid-file=/var/run/mysqld/mysqld.pid &
sleep 5
```
Then create the database and user if not already present:
```bash
sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS 2d_backend; CREATE USER IF NOT EXISTS 'dev_user'@'localhost' IDENTIFIED BY 'DevPassword2025-Secure.Xy9'; GRANT ALL PRIVILEGES ON 2d_backend.* TO 'dev_user'@'localhost'; FLUSH PRIVILEGES;"
```

### Environment files
- Backend `.env` needs `DATABASE_URL`, `JWT_SECRET` (>=32 chars), and `PORT`
- Admin panel `.env` needs `VITE_API_URL=http://localhost:3000/api`
- See `.env.example` files in repo root and `2_3_admin_panel/`

### Running services
- **Backend dev**: `npm run dev` (uses nodemon + ts-node)
- **Admin panel dev**: `cd 2_3_admin_panel && npx vite --host 0.0.0.0`
- **Database migrations**: `npx prisma migrate deploy`
- **Database seeding**: `npx prisma db seed` (creates Owner/Agent/Sub_Agent/Player users + 100 two-digit numbers)

### Gotchas
- The `secrets.ts` module validates `JWT_SECRET` must be at least 32 characters; shorter values crash the server on startup.
- `npx tsc --noEmit` reports pre-existing errors from legacy Sequelize files in `src/migrations/` and `src/models/TwoDigit.ts`; these are unused by the active Prisma-based codebase and do not affect runtime.
- ESLint for the admin panel (`cd 2_3_admin_panel && npx eslint .`) reports pre-existing warnings and errors from `react-hooks` rules; these are in the existing code.
- The backend `package.json` has `"test": "echo \"Error: no test specified\" && exit 1"` — there is no automated test suite.

### Seed data credentials
| Role      | Username  | Password     |
|-----------|-----------|--------------|
| Owner     | owner     | owner123     |
| Agent     | agent     | agent123     |
| Sub_Agent | subagent  | subagent123  |
| Player    | player    | player123    |
