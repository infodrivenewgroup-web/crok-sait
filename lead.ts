import type { QueryType, TariffId } from "./types";

export function makeReportId(): string {
  const n = Math.floor(Math.random() * 1_000_000);
  return `CL-${String(n).padStart(6, "0")}`;
}

export function makeIndex(): number {
  return 89;
}

export function validateQuery(type: QueryType, raw: string): string | null {
  const value = raw.trim();
  if (type === "phone") {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) {
      return "Введите номер: не меньше 10 цифр. Пароль и код из SMS не нужны.";
    }
    return null;
  }
  const vk = value.match(/vk\.com\/([A-Za-zА-Яа-яЁё0-9_.]+)/i);
  if (vk) {
    const slug = vk[1];
    if (slug.length >= 3 || /^id\d+$/i.test(slug)) return null;
    return "Добавьте имя страницы: vk.com/имя или @имя.";
  }
  if (/vk\.com/i.test(value)) {
    return "Добавьте имя страницы: vk.com/имя или @имя.";
  }
  const name = value.startsWith("@") ? value.slice(1) : value;
  if (/^[A-Za-zА-Яа-яЁё0-9_.]{3,32}$/.test(name)) return null;
  return "Введите ссылку vk.com, @имя или короткое имя от 3 символов.";
}

export function tariffLine(tariff: TariffId): string {
  return tariff === "express" ? "Базовая 1999" : "Полная 2999";
}

export function tariffPrice(tariff: TariffId): string {
  return tariff === "express" ? "1999 ₽" : "2999 ₽";
}

export function tariffAmount(tariff: TariffId): string {
  return tariff === "express" ? "1999" : "2999";
}

export function leadText(input: {
  reportId: string;
  query: string;
  queryType: QueryType;
  index: number;
  tariff: TariffId;
}): string {
  const kind = input.queryType === "phone" ? "телефон" : "VK";
  return [
    "Заявка Check-Love",
    `Номер отчёта: ${input.reportId}`,
    `Запрос: ${input.query.trim()}`,
    `Тип: ${kind}`,
    `Оценка риска: ${input.index}%`,
    `Выбранный тариф: ${tariffLine(input.tariff)}`,
    "Клиент прошёл 2-минутное сканирование и просит расшифровку закрытых блоков отчёта.",
  ].join("\n");
}
