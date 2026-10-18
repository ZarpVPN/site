# Zarp

Сайт Zarp на React, Vite, TypeScript и SCSS. Требуется Node.js 24.

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

Сборка создаёт готовый HTML для английской главной `/` и семи языковых адресов (`/ru/`, `/es/`, `/pt/`, `/zh/`, `/fr/`, `/de/`, `/fa/`), а также `sitemap.xml` и страницу 404. Канонический домен в SEO-метаданных — `https://zarp.dev`; после публикации отправьте `https://zarp.dev/sitemap.xml` в Google Search Console и Яндекс Вебмастер.

## GitHub Pages

В настройках репозитория выберите **Settings > Pages > Build and deployment > Source > GitHub Actions**.

Сайт публикуется после push в `main`. Если workflow завершился с ошибкой до включения Pages, повторите запуск через **Actions > Re-run jobs**.
