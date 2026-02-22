export const LANGS = ["ja", "en"] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "ja";

type Copy = {
  languageLabel: string;
  themeToggleLabel: string;
};

export const copyByLang: Record<Lang, Copy> = {
  ja: {
    languageLabel: "言語",
    themeToggleLabel: "テーマ切替"
  },
  en: {
    languageLabel: "Language",
    themeToggleLabel: "Toggle theme"
  }
};

export function toLang(value: string): Lang {
  return value === "en" ? "en" : "ja";
}
