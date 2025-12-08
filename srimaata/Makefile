.PHONY: help install dev build start stop clean logs test seed

help:
	@echo "🌿 SriMaata - Prenatal Care Application"
	@echo ""
	@echo "Available commands:"
	@echo "  make install        - Install dependencies"
	@echo "  make dev            - Start development server"
	@echo "  make build          - Build Docker image"
	@echo "  make start          - Start with Docker Compose"
	@echo "  make stop           - Stop Docker containers"
	@echo "  make logs           - View Docker logs"
	@echo "  make clean          - Clean all Docker resources"
	@echo "  make seed           - Seed database with sample data"
	@echo "  make test           - Run tests"
	@echo ""

install:
	npm install
	@echo "✅ Dependencies installed"

dev:
	npm run dev
	@echo "🚀 Development server running on http://localhost:5000"

build:
	docker-compose build
	@echo "✅ Docker image built"

start:
	docker-compose up -d
	@echo "🚀 Services started"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:5000"
	@echo "   MongoDB:  mongodb://localhost:27017"

stop:
	docker-compose down
	@echo "⏹️  Services stopped"

logs:
	docker-compose logs -f backend

logs-db:
	docker-compose logs -f mongodb

clean:
	docker-compose down -v
	@echo "🗑️  All containers and volumes removed"

seed:
	docker-compose exec backend node backend/seed.js
	@echo "✅ Database seeded with sample data"

test:
	npm test
	@echo "✅ Tests completed"

db-shell:
	docker-compose exec mongodb mongosh srimaata

reset:
	docker-compose down -v
	docker-compose up --build -d
	sleep 10
	make seed
	@echo "✅ Application reset and seeded"

status:
	docker-compose ps

health:
	@curl -s http://localhost:5000/api/health | jq .
