export type Language = "vi" | "en";

export const PAGE_TITLE: Record<Language, string> = {
  vi: "Bàn Bài | Bàn chơi bài trực tuyến",
  en: "Card Table | Play Cards Together Online",
};

export const PAGE_DESCRIPTION: Record<Language, string> = {
  vi: "Tạo bàn chơi bài riêng, mời bạn bè và chơi cùng nhau trực tuyến.",
  en: "Create a private card table, invite friends, and play together online.",
};

// ban-bai.vietbrosinaus.com serves Vietnamese, every other host serves English.
export function languageForHost(host: string | null | undefined): Language {
  return host?.toLowerCase().startsWith("ban-bai.") ? "vi" : "en";
}
