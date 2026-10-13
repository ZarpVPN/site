# Zarp

Сайт Zarp на React, Vite и TypeScript. Требуется Node.js 24.

## Запуск

```sh
npm ci
npm run dev
```

## Сборка

```sh
npm run build
```

Готовый сайт находится в `dist/`.

## GitHub Pages

В настройках репозитория выберите **Settings > Pages > Build and deployment > Source > GitHub Actions**.

Сайт публикуется после push в `main`. Если workflow завершился с ошибкой до включения Pages, повторите запуск через **Actions > Re-run jobs**.
