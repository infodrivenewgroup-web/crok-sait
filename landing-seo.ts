import type { LandingPage } from "./landings";

const INTROS = [
  (title: string, description: string) =>
    `${description}. Страница отвечает на запрос «${title}»: проверка идёт по номеру телефона или странице VK и смотрит только открытые данные.`,
  (title: string, description: string) =>
    `«${title}». ${description}. Партнёр не получает уведомление: мы не пишем ему, не звоним и не входим в телефон.`,
  (title: string, description: string) =>
    `${description}. Так Check-Love отвечает на вопрос «${title}». Отчёт собирается по открытым профилям, без пароля и без взлома.`,
  (title: string, description: string) =>
    `Если вас интересует «${title}», начните с номера или ссылки VK. ${description}. Отчёт структурирован и открывается после оплаты по СБП.`,
  (title: string, description: string) =>
    `${title}. ${description}. В отчёт попадают публичные следы: аккаунты, анкеты, ночная активность и геометки из открытых публикаций.`,
  (title: string, description: string) =>
    `${description}. Запрос «${title}» не требует доступа к перепискам: личные чаты закрыты, анализируются только открытые данные.`,
];

const POINTS = [
  "Проверка анонимная: партнёр не узнает, что вы оставили заявку.",
  "Достаточно номера телефона или ссылки на страницу ВКонтакте.",
  "Пароль, код из SMS и доступ к телефону не запрашиваются.",
  "Личные переписки не читаются и в отчёт не попадают.",
  "Ищем открытые профили ВКонтакте, Telegram и других соцсетей.",
  "Отдельно отмечаются анкеты на сайтах знакомств, если они есть в открытых данных.",
  "Ночная активность считается по открытым меткам времени, без входа в чаты.",
  "Геометки берутся только из открытых публикаций, не из геолокации телефона.",
  "Скрытые друзья и зеркала профиля помечаются, названия открываются в отчёте.",
  "Пустой след тоже результат: выдуманных находок в отчёте нет.",
  "После оплаты по СБП отчёт доступен сразу, без ожидания менеджера.",
  "Поддержка на связи круглосуточно в Telegram, если вопрос возникнет на оплате.",
];

function hash(value: string): number {
  let acc = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    acc ^= value.charCodeAt(i);
    acc = Math.imul(acc, 16777619);
  }
  return acc >>> 0;
}

export function landingNotes(page: LandingPage): { intro: string; points: string[] } {
  const seed = hash(page.slug);
  const intro = INTROS[seed % INTROS.length](page.title, page.description);
  const points: string[] = [];
  let cursor = seed % POINTS.length;
  while (points.length < 3) {
    const line = POINTS[cursor % POINTS.length];
    if (!points.includes(line)) points.push(line);
    cursor += 1 + (seed % 5);
  }
  return { intro, points };
}
