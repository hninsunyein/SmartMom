#!/bin/bash
cd server
export NODE_ENV=development
export PORT=5001
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_USERNAME=smart_mom_user
export DB_PASSWORD=smartmom456
export DB_DATABASE=smart_mom_db
export JWT_SECRET=your_super_secret_jwt_key_for_production_change_this
export JWT_ACCESS_EXPIRES_IN=15m
export JWT_REFRESH_SECRET=your_super_secret_refresh_key_for_production_change_this
export JWT_REFRESH_EXPIRES_IN=7d
export THROTTLE_TTL=60000
export THROTTLE_LIMIT=100

npm run start:dev
