#!/bin/bash

# Typing Master Platform Setup Script

echo "Setting up Typing Master Platform..."

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v18 or later."
    exit 1
fi

if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed. Please install MySQL v8.0 or later."
    exit 1
fi

# Create project structure
mkdir -p typing-master-platform/{backend/{src/{config,controllers,middleware,models,routes,services,utils},prisma},frontend/src/{app,components,hooks,lib,store,types},.vscode}

# Navigate to project
cd typing-master-platform

# Initialize git
git init
echo "# Typing Master Platform" > README.md

# Setup backend
cd backend
npm init -y

# Install backend dependencies
npm install express cors helmet bcryptjs jsonwebtoken joi dotenv prisma @prisma/client
npm install -D typescript ts-node @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken nodemon

# Setup frontend
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --app --no-eslint --yes
npm install @reduxjs/toolkit react-redux recharts lucide-react axios

echo "Setup complete!"
echo "Next steps:"
echo "1. Configure database in backend/.env"
echo "2. Run 'cd backend && npx prisma migrate dev'"
echo "3. Start servers with 'npm run dev' in both directories"
echo "4. Open http://localhost:3000"