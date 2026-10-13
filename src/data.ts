export type PlatformId = "windows" | "android" | "macos";
export type Release = {
  version: string;
  size: number;
  url: string;
  releaseUrl: string;
};
export const github = "https://github.com/ZarpVPN";
export const platforms: {
  id: PlatformId;
  label: string;
  repo: string;
  format: string;
  requirements: string;
  description: string;
  screenshot: string;
  release: Release;
}[] = [
  {
    id: "windows",
    label: "Windows",
    repo: "Zarp",
    format: "EXE",
    requirements: "Windows 10 / 11 · x64",
    description:
      "Один файл, без установщика. WARP устанавливается с вашего согласия, если его ещё нет. Нужны права администратора.",
    screenshot: "windows-app.png",
    release: {
      version: "v1.5.0",
      size: 32550400,
      url: `${github}/Zarp/releases/download/v1.5.0/Zarp.exe`,
      releaseUrl: `${github}/Zarp/releases/tag/v1.5.0`,
    },
  },
  {
    id: "android",
    label: "Android",
    repo: "Zarp-Android",
    format: "APK",
    requirements: "Android 8.0+ · arm64 / armv7 / x86_64",
    description:
      "Собственный WARP-клиент. Без root и дополнительных приложений. При первом подключении разрешите создание VPN.",
    screenshot: "android-app.png",
    release: {
      version: "v1.1.1",
      size: 52102257,
      url: `${github}/Zarp-Android/releases/download/v1.1.1/Zarp-v1.1.1.apk`,
      releaseUrl: `${github}/Zarp-Android/releases/tag/v1.1.1`,
    },
  },
  {
    id: "macos",
    label: "macOS",
    repo: "Zarp-MacOS",
    format: "DMG",
    requirements: "macOS 14+ · Apple Silicon M1 и новее",
    description:
      "Нативное приложение для Mac. Без отдельного WARP. При первом запуске разрешите открытие и установите фоновую службу.",
    screenshot: "macos-app.png",
    release: {
      version: "v0.2.0",
      size: 11128210,
      url: `${github}/Zarp-MacOS/releases/download/v0.2.0/Zarp-0.2.0-arm64.dmg`,
      releaseUrl: `${github}/Zarp-MacOS/releases/tag/v0.2.0`,
    },
  },
];
export const faqs = [
  {
    q: "Что такое Zarp и чем он отличается от обычного VPN?",
    a: "Zarp - открытый клиент, который помогает подключить Cloudflare WARP в сетях с блокировкой DPI. Он проверяет стратегии обхода и сохраняет рабочую. Windows и Android также поддерживают ваши VLESS, Trojan и Hysteria2 серверы и подписки. Zarp не продаёт доступ к собственной сети VPN-серверов.",
  },
  {
    q: "Это бесплатно? Нужна регистрация?",
    a: "Приложения Zarp бесплатны, отдельный аккаунт Zarp не нужен. На Android и macOS при первом запуске создаётся WARP-устройство после принятия условий Cloudflare. Собственный сервер или подписка, если вы их используете, оплачиваются отдельно выбранному провайдеру.",
  },
  {
    q: "Будет ли работать у моего провайдера?",
    a: "Результат зависит от вашей сети и её ограничений. Zarp тестирует стратегии именно на вашем соединении. Если быстрый поиск не помог, попробуйте полный. Во время поиска отключите другие VPN. Гарантировать обход в любой сети нельзя.",
  },
  {
    q: "Собирает ли Zarp мои данные?",
    a: "Согласно документации, у Zarp нет телеметрии и сбора персональных данных. Настройки и результаты проверок хранятся на устройстве. При использовании WARP трафик обрабатывает Cloudflare по своей политике приватности, а при использовании своего сервера - его оператор. Это не обещание полной анонимности.",
    link: "https://www.cloudflare.com/application/privacypolicy/",
    label: "Политика Cloudflare",
  },
  {
    q: "Почему Windows или macOS предупреждают при запуске?",
    a: "Windows-релиз v1.5.0 не подписан, поэтому SmartScreen может показывать предупреждение. Релиз macOS v0.2.0 не нотарифицирован Apple: первый запуск разрешается в «Системные настройки → Конфиденциальность и безопасность → Всё равно открыть». Контрольные суммы и подробности доступны на странице каждого релиза.",
    link: `${github}/Zarp-MacOS#why-wont-zarp-open`,
    label: "Инструкция для macOS",
  },
  {
    q: "Можно ли выбрать страну или отдельные приложения?",
    a: "WARP не предлагает произвольный выбор страны выхода. Фильтры Россия, Иран и Китай выбирают стратегии для тестирования, а не страну вашего IP. В Windows маршрутизация и выбор приложений доступны со своим сервером; Android поддерживает выбор приложений и редактируемые правила. В macOS этих функций пока нет.",
  },
  {
    q: "Где сообщить об ошибке или предложить улучшение?",
    a: "Создайте issue в репозитории своей платформы. Укажите версию Zarp, операционную систему и описание проблемы. Перед отправкой логов удалите ссылки подписок, пароли и другие личные данные.",
    link: github,
    label: "Открыть репозитории",
  },
];
