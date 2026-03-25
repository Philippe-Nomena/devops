#!/bin/bash

echo "🚀 Lancement infrastructure..."
docker compose up -d --build

echo "⏳ Attente du backend (healthcheck)..."

until docker exec backend wget -qO- http://localhost:3000/health 2>/dev/null; do
  echo "⏳ Backend pas encore prêt..."
  sleep 3
done

echo "📦 Backend prêt ! Lancement seed + migrations..."
docker exec backend npm run seed

echo "✅ Tout est prêt !"
echo "🌐 Application : http://localhost"
echo "📄 API : http://localhost/api/documents"
echo "🔑 Login test : email = test@test.com / password = password"