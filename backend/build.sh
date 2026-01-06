#!/usr/bin/env bash
# Script de construcción para Render

set -o errexit

echo "📦 Instalando dependencias..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🗄️ Ejecutando migraciones..."
python manage.py migrate --noinput

echo "📊 Recolectando archivos estáticos..."
python manage.py collectstatic --noinput --clear

echo "📥 Descargando datos NLTK necesarios..."
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

echo "✅ Build completado exitosamente!"
