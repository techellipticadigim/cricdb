#!/bin/bash

echo "🔧 TechElliptica CricketDB - Git Setup Script"
echo "=============================================="
echo "Copyright (c) 2024 TechElliptica. All rights reserved."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

print_info "Setting up Git repository for TechElliptica CricketDB..."

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
    print_info "Initializing Git repository..."
    git init
    print_status "Git repository initialized"
else
    print_info "Git repository already exists"
fi

# Add essential files to Git
print_info "Adding essential files to Git..."

# Add configuration files
git add .gitignore
git add .gitattributes
print_status "Git configuration files added"

# Add documentation
git add README.md
git add API_DOCUMENTATION.md
git add GIT_README.md
print_status "Documentation files added"

# Add source code
git add backend/src/
git add frontend/src/
git add database/init.sql
print_status "Source code added"

# Add configuration files
git add backend/src/main/resources/application.yml
git add frontend/package.json
git add backend/pom.xml
print_status "Configuration files added"

# Add Docker files
git add docker-compose.yml
git add docker-compose.dev.yml
git add backend/Dockerfile
git add frontend/Dockerfile
git add frontend/nginx.conf
print_status "Docker files added"

# Add scripts (excluding protected builds)
git add scripts/setup.sh
git add scripts/seed-data.sh
git add scripts/test-swagger.sh
print_status "Scripts added"

# Add testing files
git add e2e-tests/
git add postman/
git add playwright.config.ts
print_status "Testing files added"

# Add setup files
git add setup.sh
print_status "Setup files added"

# Check what files are staged
print_info "Files staged for commit:"
git status --porcelain

# Create initial commit
print_info "Creating initial commit..."
git commit -m "Initial commit: TechElliptica CricketDB source code

- Added complete source code for educational purposes
- Added configuration files and documentation
- Added Docker setup and testing files
- Protected files are excluded via .gitignore
- Copyright (c) 2024 TechElliptica. All rights reserved."

if [ $? -eq 0 ]; then
    print_status "Initial commit created successfully"
else
    print_error "Failed to create initial commit"
    exit 1
fi

# Show repository status
print_info "Repository status:"
git status

# Show ignored files
print_info "Files ignored by Git:"
git status --ignored

print_info "Git setup completed successfully!"
print_info "Repository is ready for development and collaboration."

echo ""
print_warning "IMPORTANT: Protected files are excluded from Git"
print_warning "This ensures intellectual property protection while allowing source code sharing"

echo ""
print_info "Next steps:"
echo "1. Add remote repository: git remote add origin <repository-url>"
echo "2. Push to remote: git push -u origin main"
echo "3. Continue development with normal Git workflow"

echo ""
print_info "For licensing inquiries: techellipticaeducation@gmail.com"
