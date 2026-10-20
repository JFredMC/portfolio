# JFredDev Portfolio

Portafolio personal de Jhon Maquilon, desarrollado con Angular 20, TypeScript y Tailwind CSS 4. Presenta experiencia profesional, proyectos, tecnologías y formas de contacto.

## Requisitos

- Node.js compatible con Angular 20
- Yarn

## Desarrollo local

```bash
yarn install
yarn start
```

Abre `http://localhost:4200/`. La aplicación se recarga automáticamente al guardar cambios.

## Validación

```bash
yarn build
yarn test
```

Las pruebas unitarias usan Jasmine, Karma y Chrome.

## Despliegue

Los cambios que llegan a `main` se construyen y publican en GitHub Pages mediante `.github/workflows/deploy.yml`. El artefacto se genera con la ruta base `/portfolio/`.

## Contenido

- Las secciones se componen desde `src/app/app.html`.
- La información de proyectos vive en `src/app/features/projects/projects.ts`.
- Las imágenes y el CV están en `public/`.

## Analítica de visitas y resumen diario

El sitio usa [GoatCounter](https://www.goatcounter.com/) (sin cookies, sin guardar IPs)
y un workflow diario (`.github/workflows/portfolio-digest.yml`, 12:00 UTC =
7:00 a. m. America/Bogota) envía por Amazon SES el resumen del día anterior
con `scripts/portfolio-digest.mjs`.

Puesta en marcha (una sola vez):

1. Crear la cuenta en goatcounter.com con el código de sitio `jfredmc`
   (si eliges otro, cámbialo en `src/index.html` y en el secret de abajo).
2. En GoatCounter, crear un API token: menú de tu usuario → **API**.
3. En este repo: Settings → Secrets and variables → Actions → New repository secret:
   `GOATCOUNTER_SITE_CODE`, `GOATCOUNTER_API_TOKEN`, `AWS_ACCESS_KEY_ID`,
   `AWS_SECRET_ACCESS_KEY` (usuario IAM `api_amazon_ses`), `SES_AWS_REGION`,
   `SES_FROM_EMAIL` (identidad verificada en SES) y `STATS_EMAIL_TO` (tu correo).
4. Probar: Actions → *Portfolio daily digest* → Run workflow con `dry_run` activo.

Comprobación local sin enviar nada: `node scripts/portfolio-digest.mjs --sample`
y pruebas: `node --test scripts/portfolio-digest.test.mjs`.
