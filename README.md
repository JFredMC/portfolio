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
