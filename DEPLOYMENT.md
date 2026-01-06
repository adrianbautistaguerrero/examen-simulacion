# Guía de Despliegue - Plataforma ML

Esta guía te llevará paso a paso para desplegar tu aplicación de Machine Learning en producción usando **Render** para el backend y **Vercel** para el frontend.

## Requisitos Previos

- Cuenta en [Render](https://render.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Repositorio de GitHub con el código
- Node.js 18+ instalado localmente
- Python 3.11+ instalado localmente

## Arquitectura de Despliegue

```
┌─────────────────┐         ┌──────────────────┐
│   Vercel        │         │   Render         │
│   (Frontend)    │ ◄─────► │   (Backend)      │
│   Next.js       │  HTTP   │   Django         │
└─────────────────┘         └──────────────────┘
```

---

## Paso 1: Preparar el Repositorio

### 1.1 Clonar y Verificar

```bash
git clone https://github.com/tu-usuario/ml-platform.git
cd ml-platform
```

### 1.2 Verificar Estructura

Asegúrate de tener:
```
ml-platform/
├── backend/
│   ├── manage.py
│   ├── build.sh
│   ├── requirements.txt
│   └── ml_platform/
├── app/
├── components/
├── package.json
├── render.yaml
└── vercel.json
```

---

## Paso 2: Desplegar Backend en Render

### 2.1 Crear Nuevo Web Service

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `ml-platform`

### 2.2 Configuración del Servicio

Completa los campos:

| Campo | Valor |
|-------|-------|
| **Name** | `ml-platform-backend` |
| **Region** | Elige la más cercana a tus usuarios |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `./build.sh` |
| **Start Command** | `gunicorn ml_platform.wsgi:application` |

### 2.3 Variables de Entorno

En la sección **Environment**, agrega:

```bash
PYTHON_VERSION=3.11.0
SECRET_KEY=<haz clic en "Generate" para auto-generar>
DEBUG=False
ALLOWED_HOSTS=<tu-app>.onrender.com
CORS_ALLOWED_ORIGINS=<se configurará después con URL de Vercel>
```

**Notas importantes:**
- `SECRET_KEY`: Usa el botón "Generate" de Render para crear una clave segura
- `ALLOWED_HOSTS`: Reemplaza `<tu-app>` con el nombre de tu servicio
- `CORS_ALLOWED_ORIGINS`: Lo actualizaremos después del despliegue en Vercel

### 2.4 Permisos del Build Script

Antes de desplegar, asegúrate de que `build.sh` tenga permisos de ejecución:

```bash
chmod +x backend/build.sh
git add backend/build.sh
git commit -m "Add execute permissions to build.sh"
git push
```

### 2.5 Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir tu aplicación
3. Espera 5-10 minutos para el primer despliegue
4. Verás logs en tiempo real del proceso

### 2.6 Verificar Despliegue

Una vez completado, tu backend estará en:
```
https://<tu-app>.onrender.com
```

Prueba la API:
```bash
curl https://<tu-app>.onrender.com/api/health/
```

Deberías ver:
```json
{
  "estado": "saludable",
  "timestamp": "2024-01-..."
}
```

---

## Paso 3: Desplegar Frontend en Vercel

### 3.1 Preparar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_API_URL=https://<tu-app>.onrender.com
```

Reemplaza `<tu-app>` con el nombre de tu servicio en Render.

### 3.2 Desplegar en Vercel

**Opción A: Usar Vercel CLI (Recomendado)**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# Seguir las instrucciones:
# - Set up and deploy? → Yes
# - Which scope? → Tu cuenta personal
# - Link to existing project? → No
# - Project name? → ml-platform (o tu nombre preferido)
# - In which directory is your code? → ./
# - Override settings? → No
```

**Opción B: Usar Dashboard de Vercel**

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente Next.js

### 3.3 Configurar Variables de Entorno en Vercel

1. En el dashboard del proyecto, ve a **"Settings"** → **"Environment Variables"**
2. Agrega:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://<tu-app>.onrender.com` |

3. Aplica a: **Production, Preview, Development**
4. Guarda cambios

### 3.4 Re-desplegar

Después de agregar las variables:

```bash
vercel --prod
```

O desde el dashboard: **"Deployments"** → **"Redeploy"**

### 3.5 Verificar Despliegue

Tu frontend estará en:
```
https://<tu-proyecto>.vercel.app
```

---

## Paso 4: Configurar CORS

Ahora que tienes ambas URLs, actualiza el backend:

### 4.1 Actualizar Variable en Render

1. Ve a tu servicio en Render
2. **"Environment"** → Edita `CORS_ALLOWED_ORIGINS`
3. Cambia a: `https://<tu-proyecto>.vercel.app`
4. Guarda cambios
5. Render re-desplegará automáticamente

### 4.2 Verificar Conexión

Abre tu frontend en Vercel y prueba:
- Detector de Spam
- Visualización de Dataset
- Todas las funcionalidades deberían funcionar

---

## Paso 5: Configuración de Dominio Personalizado (Opcional)

### 5.1 Dominio para Frontend (Vercel)

1. En Vercel: **"Settings"** → **"Domains"**
2. Agrega tu dominio: `miapp.com`
3. Configura DNS según instrucciones de Vercel
4. Vercel generará certificado SSL automáticamente

### 5.2 Dominio para Backend (Render)

1. En Render: **"Settings"** → **"Custom Domains"**
2. Agrega tu subdominio: `api.miapp.com`
3. Configura CNAME en tu proveedor DNS
4. Render generará certificado SSL automáticamente

### 5.3 Actualizar Variables

Después de configurar dominios:

**En Render:**
```bash
ALLOWED_HOSTS=api.miapp.com
CORS_ALLOWED_ORIGINS=https://miapp.com
```

**En Vercel:**
```bash
NEXT_PUBLIC_API_URL=https://api.miapp.com
```

---

## Monitoreo y Mantenimiento

### Logs en Render

Ver logs en tiempo real:
1. Dashboard → Tu servicio → **"Logs"**
2. O usa CLI: `render logs -f <service-id>`

### Logs en Vercel

Ver logs de funciones:
1. Dashboard → Tu proyecto → **"Deployments"** → Click en deployment → **"Functions"**

### Re-despliegues Automáticos

Ambas plataformas se re-despliegan automáticamente cuando haces push a `main`:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

- **Render**: Re-construye backend en 3-5 minutos
- **Vercel**: Re-construye frontend en 1-2 minutos

---

## Solución de Problemas

### Error: "Application failed to start"

**Causa**: Error en build.sh o dependencias

**Solución:**
```bash
# Verifica localmente
cd backend
chmod +x build.sh
./build.sh

# Si funciona local, verifica logs en Render
```

### Error: "Module not found"

**Causa**: Dependencia faltante en requirements.txt

**Solución:**
```bash
# Agrega dependencia faltante
echo "nombre-paquete==version" >> backend/requirements.txt
git commit -am "Add missing dependency"
git push
```

### Error: CORS Policy

**Causa**: CORS_ALLOWED_ORIGINS mal configurado

**Solución:**
1. Verifica URL exacta de Vercel (con https://)
2. No agregues barra final: ❌ `https://app.vercel.app/` ✅ `https://app.vercel.app`
3. Actualiza variable en Render
4. Espera re-despliegue

### Error: "Static files not found"

**Causa**: collectstatic no ejecutado

**Solución:**
```bash
# En build.sh, asegúrate de tener:
python manage.py collectstatic --noinput --clear
```

### Frontend no conecta con Backend

**Checklist:**
1. ✅ NEXT_PUBLIC_API_URL configurado en Vercel
2. ✅ URL termina sin barra: `https://api.com` (no `https://api.com/`)
3. ✅ Backend está respondiendo: prueba `/api/health/`
4. ✅ CORS configurado correctamente en Render

### Timeout en Render (Free Tier)

**Problema**: Render Free tier duerme después de 15 minutos de inactividad

**Síntomas:**
- Primera request tarda 30-60 segundos
- Requests subsecuentes son rápidas

**Soluciones:**
- Actualizar a plan pagado ($7/mes)
- Usar servicio de "keep-alive" como [UptimeRobot](https://uptimerobot.com)
- Mostrar mensaje de carga al usuario

---

## Checklist Final de Despliegue

Antes de considerar completo:

### Backend (Render)
- [ ] Servicio desplegado exitosamente
- [ ] `/api/health/` responde correctamente
- [ ] SECRET_KEY generada y segura
- [ ] DEBUG=False
- [ ] ALLOWED_HOSTS configurado
- [ ] CORS_ALLOWED_ORIGINS configurado con URL de Vercel
- [ ] Logs sin errores críticos

### Frontend (Vercel)
- [ ] Proyecto desplegado exitosamente
- [ ] NEXT_PUBLIC_API_URL configurado
- [ ] Build exitoso sin errores
- [ ] Todas las páginas cargan correctamente
- [ ] Detector de spam funciona
- [ ] Visualizaciones se renderizan

### Funcionalidad
- [ ] Detector de Spam detecta correctamente
- [ ] Gráficos del dataset se muestran
- [ ] Preprocesamiento calcula splits
- [ ] Evaluación muestra métricas
- [ ] No hay errores CORS en la consola

---

## URLs de Producción

Después del despliegue, tendrás:

```
Frontend: https://<tu-proyecto>.vercel.app
Backend:  https://<tu-app>.onrender.com
API:      https://<tu-app>.onrender.com/api/
```

---

## Costos

### Render Free Tier
- ✅ 750 horas/mes gratis
- ✅ SSL incluido
- ⚠️ Duerme después de 15 min inactividad
- ⚠️ Límite de memoria: 512 MB

### Vercel Hobby (Free)
- ✅ Despliegues ilimitados
- ✅ SSL incluido
- ✅ CDN global
- ⚠️ 100 GB bandwidth/mes
- ⚠️ Máximo 6,000 minutos build/mes

**Para producción seria**: Considera planes pagados
- Render Starter: $7/mes
- Vercel Pro: $20/mes

---

## Seguridad en Producción

### Variables de Entorno

**NUNCA** commitees:
- SECRET_KEY
- API Keys
- Credenciales de BD

Usa `.gitignore`:
```
.env
.env.local
*.sqlite3
```

### HTTPS

Ambas plataformas proveen SSL/HTTPS automático:
- ✅ Render: Let's Encrypt
- ✅ Vercel: Let's Encrypt

### Headers de Seguridad

Ya configurados en `settings.py`:
- ✅ SECURE_SSL_REDIRECT
- ✅ SESSION_COOKIE_SECURE
- ✅ CSRF_COOKIE_SECURE
- ✅ X_FRAME_OPTIONS

---

## Próximos Pasos

1. **Monitoreo**: Configura alertas en Render para errores
2. **Analytics**: Agrega Vercel Analytics para métricas de frontend
3. **Backup**: Exporta datos periódicamente
4. **Testing**: Configura CI/CD con GitHub Actions
5. **Documentación**: Mantén actualizado el README

---

## Soporte

### Documentación Oficial
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Django Deployment](https://docs.djangoproject.com/en/5.1/howto/deployment/)

### Comunidad
- [Render Community](https://community.render.com)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

¡Felicidades! 🎉 Tu plataforma de Machine Learning está ahora en producción.
