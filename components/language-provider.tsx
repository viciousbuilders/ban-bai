"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { PAGE_TITLE, type Language } from "@/lib/language";

export type { Language };

const copy: Record<Language, Record<string, string>> = {
  vi: {
    appName: "Bàn Bài",
    chooseDeck: "Chọn bộ bài",
    classicCards: "Bài Tây",
    createTab: "Tạo bàn",
    createError: "Không thể tạo bàn chơi.",
    createTable: "Tạo bàn mới",
    english: "English",
    entryChoice: "Tạo hoặc vào bàn chơi",
    heroIntro: "Tạo bàn riêng, gửi một đường link và chơi theo luật của bạn.",
    heroTitle: "Chơi bài cùng nhau.",
    home: "Trang chủ Bàn Bài",
    joinTab: "Vào bàn",
    joinError: "Không thể vào phòng này.",
    joinFriends: "Đã có mã phòng?",
    joinRoom: "Vào phòng",
    joiningTable: "Đang vào bàn…",
    language: "Ngôn ngữ",
    namePlaceholder: "Ví dụ: Minh",
    noAccount: "Không cần tài khoản",
    pageTitle: PAGE_TITLE.vi,
    roomCode: "MÃ PHÒNG",
    roomCodeHint: "Nhập mã 6 ký tự bạn bè đã gửi.",
    sandbox52: "Bộ bài tự do 52 lá",
    settingTable: "Đang dọn bàn…",
    startPlaying: "Bắt đầu",
    tamDeck: "Bộ bài chuẩn 108 lá",
    tamQuocSat: "Tam Quốc Sát",
    vietnamese: "Tiếng Việt",
    yourName: "Tên của bạn",
  },
  en: {
    appName: "Card Table",
    chooseDeck: "Choose a deck",
    classicCards: "Classic cards",
    createTab: "Create",
    createError: "Could not create the table.",
    createTable: "Create new table",
    english: "English",
    entryChoice: "Create or join a table",
    heroIntro: "Create a table, share a link, play your way.",
    heroTitle: "Play cards together.",
    home: "Card Table home",
    joinTab: "Join",
    joinError: "Could not join that room.",
    joinFriends: "Already have a room code?",
    joinRoom: "Join room",
    joiningTable: "Joining table…",
    language: "Language",
    namePlaceholder: "e.g. Minh",
    noAccount: "No account needed",
    pageTitle: PAGE_TITLE.en,
    roomCode: "ROOM CODE",
    roomCodeHint: "Enter the 6-character code shared by your friend.",
    sandbox52: "52-card deck",
    settingTable: "Setting the table…",
    startPlaying: "Get started",
    tamDeck: "108-card deck",
    tamQuocSat: "Sanguosha",
    vietnamese: "Tiếng Việt",
    yourName: "Your name",
  },
};

const LanguageContext = createContext<Language>("en");
const STORAGE_KEY = "ban-bai:language";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("ban-bai:language", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("ban-bai:language", onChange);
  };
}

function readStoredLanguage(): Language | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "vi" || stored === "en" ? stored : null;
}

export function LanguageProvider({ defaultLanguage, children }: { defaultLanguage: Language; children: React.ReactNode }) {
  const pathname = usePathname();
  const language = useSyncExternalStore(
    subscribe,
    () => readStoredLanguage() ?? defaultLanguage,
    () => defaultLanguage,
  );
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy[language].pageTitle;
  }, [language, pathname]);
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const language = useContext(LanguageContext);
  return useMemo(
    () => ({ language, t: (key: string) => copy[language][key] ?? copy.en[key] ?? key }),
    [language],
  );
}

export function setLanguage(next: Language) {
  window.localStorage.setItem(STORAGE_KEY, next);
  window.dispatchEvent(new Event("ban-bai:language"));
}

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`inline-flex items-center gap-0.5 rounded-[0.625rem] border border-[#d8d1c5] bg-white/55 p-[3px] ${compact ? "shrink-0" : ""}`}
    >
      {(["vi", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
          className={`cursor-pointer rounded-[7px] px-2 text-[0.7rem] font-extrabold tracking-wide uppercase transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gilt ${compact ? "h-7 min-w-[1.875rem]" : "h-10 min-w-11"} ${
            language === option ? "bg-foreground text-[#fffdf7] shadow-sm" : "text-[#66716b] hover:bg-[#13755a]/10 hover:text-[#125f49]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
