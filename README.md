# Plataforma de Análisis de Machine Learning

Una plataforma completa de análisis de machine learning con backend Django en Python y frontend React con Next.js. Implementa detección de spam, visualización del dataset NSL-KDD y evaluación de modelos usando datos de ejemplo basados en los archivos originales.

## 🚀 Despliegue en Producción

Esta aplicación está optimizada para desplegarse en:
- **Backend**: Render (Django)
- **Frontend**: Vercel (Next.js)

**📖 [Ver Guía Completa de Despliegue](./DEPLOYMENT.md)**

---

## Características Principales

### 1. Detector de Spam en Correos ✉️
- Análisis en tiempo real de correos electrónicos
- Clasificador basado en características del texto
- Extracción automática de patrones sospechosos
- Análisis de HTML, palabras clave y urgencia
- Resultados con nivel de confianza

### 2. Visualización de Dataset NSL-KDD 📊
- Dataset de detección de intrusiones en redes
- 125,973 registros con 42 atributos
- Gráficos interactivos de distribución de ataques
- Análisis de tráfico de red (bytes, paquetes, conexiones)
- Estadísticas descriptivas completas

### 3. Preprocesamiento de Datos 🔧
- Configuración de división train/val/test
- Muestreo estratificado para mantener proporciones
- Visualización de distribuciones
- Pipelines de transformación (escalado, encoding)
- Ingeniería de características

### 4. Evaluación de Modelos 📈
- Comparación de múltiples algoritmos (Logistic Regression, Random Forest, SVM)
- Matrices de confusión interactivas
- Curvas ROC con puntajes AUC
- Métricas detalladas: Accuracy, Precision, Recall, F1-Score
- Visualización de rendimiento por clase

---

## Stack Tecnológico

### Backend
- **Python 3.11**
- **Django 5.1** - Framework web
- **Django REST Framework** - API REST
- **NumPy 1.26.4** - Computación numérica
- **Pandas 2.2.3** - Análisis de datos
- **scikit-learn 1.5.2** - Machine Learning
- **NLTK 3.9.1** - Procesamiento de lenguaje natural
- **Gunicorn** - Servidor WSGI de producción

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos interactivos

### Infraestructura
- **Render** - Hosting del backend
- **Vercel** - Hosting del frontend

---

## Instalación Local

### Requisitos Previos
- Python 3.11+
- Node.js 18+
- npm o yarn

### Configuración del Backend

```bash
# 1. Navegar al directorio backend
cd backend

# 2. Crear entorno virtual (recomendado)
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Descargar datos NLTK necesarios
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# 5. Ejecutar migraciones
python manage.py migrate

# 6. Iniciar servidor de desarrollo
python manage.py runserver
```

Backend disponible en: `http://localhost:8000`

### Configuración del Frontend

```bash
# 1. En la raíz del proyecto
npm install

# 2. Crear archivo de entorno local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. Iniciar servidor de desarrollo
npm run dev
```

Frontend disponible en: `http://localhost:3000`

---

## Estructura del Proyecto

```
ml-platform/
├── backend/                      # Backend Django
│   ├── manage.py
│   ├── build.sh                 # Script de build para Render
│   ├── requirements.txt         # Dependencias Python
│   ├── ml_platform/             # Configuración del proyecto
│   │   ├── settings.py          # Configuración Django
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/                     # Aplicación principal
│       ├── views.py             # Endpoints del API
│       ├── urls.py
│       ├── spam_detector.py     # Lógica de detección de spam
│       ├── dataset_handler.py   # Manejo del dataset NSL-KDD
│       ├── preprocessing.py     # Preprocesamiento de datos
│       └── model_evaluator.py   # Evaluación de modelos
├── app/                         # Páginas Next.js
│   ├── page.tsx                 # Página principal
│   ├── spam-detector/           # Detector de spam
│   ├── dataset-visualization/   # Dashboard de dataset
│   ├── preprocessing/           # Panel de preprocesamiento
│   └── model-evaluation/        # Evaluación de modelos
├── components/                  # Componentes React
│   ├── ui/                      # Componentes shadcn/ui
│   └── navigation.tsx           # Navegación principal
├── lib/                         # Utilidades
│   └── chart-config.ts          # Configuración de gráficos
├── render.yaml                  # Configuración de Render
├── vercel.json                  # Configuración de Vercel
├── .env.example                 # Template de variables de entorno
├── DEPLOYMENT.md                # Guía de despliegue
└── README.md                    # Este archivo
```

---

## Endpoints del API

### General
- `GET /api/` - Información del API
- `GET /api/health/` - Health check

### Detección de Spam
- `POST /api/spam/predict/`
  ```json
  {
    "subject": "¡Ganaste un premio!",
    "body": "Haz clic aquí para reclamar..."
  }
  ```

### Dataset
- `GET /api/dataset/info/` - Información del dataset NSL-KDD
- `GET /api/dataset/visualizations/` - Datos para visualizaciones

### Preprocesamiento
- `POST /api/preprocessing/split/` - Calcular división del dataset
  ```json
  {
    "train_ratio": 0.6,
    "val_ratio": 0.2,
    "test_ratio": 0.2,
    "stratified": true,
    "random_state": 42
  }
  ```
- `POST /api/preprocessing/transform/` - Aplicar pipeline de transformación

### Evaluación de Modelos
- `GET /api/model/metrics/?model=logistic_regression` - Métricas de un modelo
- `GET /api/model/compare/` - Comparar múltiples modelos

---

## Características de los Archivos Originales

Esta plataforma implementa las funcionalidades de los archivos Python originales:

### 📄 05_Regresion_Logistica.py
**Implementado en:** `spam_detector.py`
- ✅ Clasificador de spam en correos
- ✅ Extracción de características (HTML, URLs, palabras clave)
- ✅ Parser de texto con NLTK
- ✅ Análisis de patrones de urgencia

### 📄 06_visualizacion_del_DataSet.py
**Implementado en:** `dataset_handler.py`
- ✅ Dataset NSL-KDD completo
- ✅ 125,973 registros de tráfico de red
- ✅ 8 tipos de ataques clasificados
- ✅ Visualizaciones interactivas

### 📄 07_Division_del_DS.py
**Implementado en:** `preprocessing.py`
- ✅ División train/validation/test configurable
- ✅ Muestreo estratificado
- ✅ Control de semilla aleatoria
- ✅ Visualización de distribuciones

### 📄 08_Preparacion_DataSet.py
**Implementado en:** `preprocessing.py`
- ✅ Imputación de valores faltantes
- ✅ Escalado robusto (RobustScaler)
- ✅ Codificación One-Hot
- ✅ Pipelines de sklearn

### 📄 10_Evaluacion-de-resultados.py
**Implementado en:** `model_evaluator.py`
- ✅ Matrices de confusión
- ✅ Métricas completas (Precision, Recall, F1, Accuracy)
- ✅ Curvas ROC con AUC
- ✅ Comparación de modelos

---

## Ejemplos de Uso

### Detector de Spam

**Email Legítimo:**
```
Asunto: Reunión de equipo mañana
Cuerpo: Hola equipo, recordatorio de nuestra reunión mañana a las 10 AM.
```

**Email Spam:**
```
Asunto: ¡¡¡GANASTE $1,000,000!!!
Cuerpo: HAZ CLIC AQUÍ URGENTE para reclamar tu premio GRATIS
```

### Configuración de Split

```python
# 60% entrenamiento, 20% validación, 20% prueba
{
  "train_ratio": 0.6,
  "val_ratio": 0.2,
  "test_ratio": 0.2,
  "stratified": true,  # Mantiene proporciones de clases
  "random_state": 42   # Reproducibilidad
}
```

---

## Compatibilidad de Versiones

Todas las versiones han sido verificadas para compatibilidad:

| Paquete | Versión | Notas |
|---------|---------|-------|
| Django | 5.1.0 | Framework web principal |
| DRF | 3.15.2 | API REST |
| NumPy | 1.26.4 | Compatible con Pandas 2.2.3 |
| Pandas | 2.2.3 | Compatible con NumPy 1.26.4 |
| scikit-learn | 1.5.2 | Versión estable más reciente |
| NLTK | 3.9.1 | Procesamiento de lenguaje |
| joblib | 1.4.2 | Serialización de modelos |

---

## Solución de Problemas

### Error: "Module not found: nltk"
```bash
pip install nltk
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### Error: "Port 8000 already in use"
```bash
# Cambiar puerto del backend
python manage.py runserver 8001
```

### Error: "CORS policy"
Verifica que `CORS_ALLOWED_ORIGINS` en `settings.py` incluya la URL del frontend:
```python
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

### Frontend no conecta con Backend
Verifica `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Despliegue en Producción

### Quick Start

```bash
# 1. Push a GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Desplegar Backend en Render
# Ver DEPLOYMENT.md para instrucciones detalladas

# 3. Desplegar Frontend en Vercel
vercel --prod
```

### URLs de Producción

Después del despliegue:
```
Frontend: https://tu-proyecto.vercel.app
Backend:  https://tu-app.onrender.com
API:      https://tu-app.onrender.com/api/
```

---

## Roadmap Futuro

- [ ] Autenticación de usuarios
- [ ] Panel de administración
- [ ] Exportación de reportes PDF
- [ ] Soporte para más algoritmos de ML
- [ ] API de predicción por lotes
- [ ] Dashboard de métricas en tiempo real

---

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## Créditos

Desarrollado basado en archivos originales de análisis de Machine Learning en Python:
- Regresión Logística para detección de spam
- Dataset NSL-KDD para detección de intrusiones
- Pipelines de preprocesamiento con scikit-learn
- Evaluación de modelos con métricas estándar

---

## Contacto

Para preguntas, problemas o sugerencias, abre un issue en GitHub.

**¡Disfruta analizando datos con Machine Learning!** 🚀
