# Smart Mom Balancing System

A comprehensive web application designed for working mothers (ages 25-42) to track children's growth, nutrition, and development milestones, with professional advisor support.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed on your machine
- Port 3000, 5000, and 3306 available

### Run the Application

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Smart-Mom-Balancing-System
```

2. **Start all services (using npm scripts):**
```bash
# Start all services in background
npm start

# Or using docker-compose directly
docker-compose up -d
```

This will start:
- **MySQL Database** on port 3306
- **NestJS Backend API** on port 5000  
- **React Frontend** on port 3000

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

### Test Accounts

The database comes with pre-configured test accounts:

**Parent Account:**
- Email: `parent@smartmom.com`
- Password: `password`

**Advisor Account:**
- Email: `advisor@smartmom.com`  
- Password: `password`

## 🛠️ Development Setup

### Backend (NestJS)
```bash
cd server
npm install
npm run start:dev
```

### Frontend (React)
```bash
cd client
npm install
npm run dev
```

### Database (MySQL)
```bash
# Run MySQL locally or use Docker
docker run --name smart-mom-mysql \
  -e MYSQL_ROOT_PASSWORD=smartmom123 \
  -e MYSQL_DATABASE=smart_mom_db \
  -e MYSQL_USER=smart_mom_user \
  -e MYSQL_PASSWORD=smartmom456 \
  -p 3306:3306 -d mysql:8.0
```

## 📊 Docker Services

### Services Overview
- **database**: MySQL 8.0 with automatic schema initialization
- **backend**: NestJS API with TypeORM, JWT authentication
- **frontend**: React app served with Nginx

### Available NPM Scripts

```bash
# 🚀 Basic Operations
npm start              # Start all services in background
npm stop               # Stop all services
npm restart            # Restart all services
npm run build          # Build and start with latest changes
npm run rebuild        # Complete rebuild (down + build + up)

# 📊 Monitoring & Logs
npm run logs           # View all logs (follow mode)
npm run logs:backend   # View backend logs only
npm run logs:frontend  # View frontend logs only  
npm run logs:database  # View database logs only
npm run status         # Show running containers status
npm run health         # Check backend health

# 🧹 Cleanup & Reset
npm run clean          # Stop containers + remove volumes + prune
npm run reset          # Complete reset (clean + rebuild)

# 🛠️ Development Mode
npm run dev:backend    # Run backend in dev mode (without Docker)
npm run dev:frontend   # Run frontend in dev mode (without Docker)
npm run install:all    # Install dependencies for both frontend & backend

# 🧪 Testing
npm test               # Show test instructions
npm run test:backend   # Run backend tests
npm run test:frontend  # Run frontend tests
```

### Traditional Docker Commands (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove everything including volumes
docker-compose down -v

# View running containers
docker-compose ps
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and update values as needed:

```bash
cp .env.example .env
```

### Database

The MySQL database is automatically initialized with:
- Complete schema (users, children, appointments, growth tracking, etc.)
- Sample test data
- Proper indexes for performance
- Foreign key constraints

### Security

- JWT authentication with configurable secret
- Password hashing with bcrypt
- Rate limiting and throttling
- CORS configuration
- Security headers with Helmet
- Input validation with class-validator

## 📁 Project Structure

```
Smart-Mom-Balancing-System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── redux/          # Redux store and slices
│   │   └── services/       # API services
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── database/       # TypeORM entities
│   │   └── common/         # Guards, decorators, etc.
│   └── Dockerfile
├── docker-compose.yml      # Docker orchestration
├── init-db.sql            # Database initialization
└── README.md
```

## 🎯 Features

### MVP Features (Must Have)
- ✅ User authentication (Parent/Advisor)
- ✅ JWT-based security
- ✅ Role-based access control
- ✅ Responsive design with purple/pink theme
- ✅ Docker containerization
- 🔄 Child profile management (in progress)
- 🔄 Appointment system (in progress)
- 🔄 Growth tracking (in progress)

### Technology Stack
- **Frontend**: Next.js 15, React 19, Redux Toolkit, Tailwind CSS v4
- **Backend**: NestJS, TypeORM, MySQL, JWT, Passport
- **Database**: MySQL 8.0
- **DevOps**: Docker, Docker Compose, Nginx
- **Security**: Helmet, CORS, bcrypt, rate limiting

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register/parent` - Parent registration
- `POST /api/auth/register/advisor` - Advisor registration
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile

### Users
- `GET /api/users/advisors` - Get approved advisors

### Health
- `GET /api/health` - Health check

## 🚦 Health Checks

All services include health checks:
- **Database**: MySQL ping
- **Backend**: HTTP health endpoint  
- **Frontend**: Nginx status

## 📝 Logs

View logs for debugging:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

## 🔒 Security Features

- **Password Requirements**: 8+ characters, uppercase, lowercase, number
- **Age Restrictions**: Parents must be 25-42 years old
- **Advisor Approval**: Advisors require admin approval
- **Data Protection**: COPPA and GDPR compliant
- **No Browser Storage**: Uses React state instead of localStorage
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: All inputs validated on both client and server

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 5000, 3306 are free
2. **Database connection**: Wait for database health check to pass
3. **Build failures**: Check Docker logs for specific errors

### Reset Everything
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

## 📖 Development Methodology

This project follows **DSDM (Dynamic Systems Development Method)** with **MoSCoW prioritization**:
- **Must Have**: Core authentication and user management ✅
- **Should Have**: Child profiles, appointments, growth tracking 🔄
- **Could Have**: Advanced features like meal planning 📝
- **Won't Have**: Mobile apps, video consultation (future versions) ❌

---

**Happy developing! 🚀**