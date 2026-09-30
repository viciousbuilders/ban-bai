"use client";

import { ArrowRight, LogIn, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { LanguageToggle, useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TableDeck } from "@/lib/domain/setup";
import { newRoomCode } from "@/lib/room-code";
import { tableDoor } from "@/lib/party-host";
import { cn } from "@/lib/utils";

type EntryMode = "create" | "join";

const DECKS: Array<{ id: TableDeck; mark: string; title?: string; titleKey?: string; noteKey: string }> = [
  { id: "classic-52", mark: "♠", titleKey: "classicCards", noteKey: "sandbox52" },
  { id: "tam-quoc-sat", mark: "殺", titleKey: "tamQuocSat", noteKey: "tamDeck" },
];

export default function Lobby() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [deck, setDeck] = useState<TableDeck>("tam-quoc-sat");
  const [mode, setMode] = useState<EntryMode>("create");
  const canSubmit = Boolean(name.trim()) && !busy && (mode === "create" || roomCode.trim().length === 6);

  async function createTable() {
    const code = newRoomCode();
    const response = await fetch(tableDoor(code), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "create", name: name.trim(), deck }) });
    const result = await response.json() as { seatId?: string; error?: string };
    if (!response.ok || !result.seatId) throw new Error(result.error ?? t("createError"));
    window.localStorage.setItem("ban-bai:" + code + ":seat", result.seatId);
    window.localStorage.setItem("ban-bai:name", name.trim());
    router.push("/room/" + code);
  }

  async function joinTable() {
    const code = roomCode.trim().toUpperCase();
    const response = await fetch(tableDoor(code), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "join", name: name.trim(), role: "player" }) });
    const result = await response.json() as { seatId?: string; error?: string };
    if (!response.ok || !result.seatId) throw new Error(result.error ?? t("joinError"));
    window.localStorage.setItem("ban-bai:" + code + ":seat", result.seatId);
    window.localStorage.setItem("ban-bai:name", name.trim());
    router.push("/room/" + code);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      if (mode === "create") await createTable();
      else await joinTable();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t(mode === "create" ? "createError" : "joinError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-[radial-gradient(circle_at_14%_12%,rgba(19,117,90,0.09),transparent_34%),radial-gradient(circle_at_90%_82%,rgba(232,95,67,0.08),transparent_30%),#f5f0e5]">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <span className="inline-flex items-center gap-3 text-lg font-extrabold tracking-tight text-foreground">
          <Image src="/favicon.svg" alt="" aria-hidden="true" width={40} height={40} className="size-10 shrink-0" />
          {t("appName")}
        </span>
        <LanguageToggle />
      </header>

      <div className="mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-10 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(370px,0.85fr)] lg:gap-16 lg:px-12 lg:py-16">
        <section aria-labelledby="home-title" className="mx-auto w-full max-w-[34rem] text-center lg:mx-0 lg:max-w-none lg:text-left">
          <h1 id="home-title" className="max-w-[11ch] text-balance text-[clamp(2.9rem,5.6vw,5.15rem)] leading-[1.12] font-extrabold tracking-[-0.065em] text-foreground max-lg:mx-auto">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-5 max-w-[34rem] text-pretty text-base leading-[1.75] text-[#4b5b52] sm:text-lg lg:mx-0">
            {t("heroIntro")}
          </p>
          <div aria-hidden="true" className="relative mx-auto mt-9 hidden h-[210px] max-w-[540px] overflow-hidden rounded-[2rem] border-[10px] border-[#67472b] bg-[radial-gradient(ellipse_at_50%_30%,#188362,#0c624a_68%,#084833)] shadow-[0_18px_36px_rgba(46,38,23,0.20),inset_0_0_0_3px_#a27743] lg:block">
            <div className="absolute inset-3 rounded-[1.4rem] border border-white/15" />
            <div className="absolute left-[14%] top-[22%] h-[112px] w-[78px] -rotate-18 rounded-lg border-[3px] border-[#fff8e8] bg-[#173a30] shadow-[0_12px_16px_rgba(0,0,0,0.28)]"><div className="m-2 grid h-[calc(100%-1rem)] place-items-center rounded border border-[#d9b45a]/70 font-serif text-4xl text-[#f4c95d]">♠</div></div>
            <div className="absolute left-[35%] top-[14%] h-[128px] w-[89px] rotate-[-4deg] rounded-lg border-[3px] border-white bg-[#fff9ea] text-[#ce503c] shadow-[0_14px_18px_rgba(0,0,0,0.25)]">
              <span className="absolute inset-0 grid place-items-center font-serif text-5xl">♥</span>
              <span className="absolute left-2 top-2 text-xl font-bold leading-none">A<span className="block text-base">♥</span></span>
            </div>
            <div className="absolute left-[62%] top-[17%] h-[128px] w-[89px] rotate-[13deg] rounded-lg border-[3px] border-white bg-[#fff9ea] text-[#17241f] shadow-[0_14px_18px_rgba(0,0,0,0.25)]">
              <span className="absolute inset-0 grid place-items-center font-serif text-5xl">♠</span>
              <span className="absolute left-2 top-2 text-xl font-bold leading-none">K<span className="block text-base">♠</span></span>
            </div>
          </div>
        </section>

        <section aria-labelledby="entry-title" className="w-full max-w-[480px] justify-self-center rounded-[1.75rem] border border-[#dcd3c3] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(34,49,41,0.11)] sm:p-7 lg:justify-self-end">
          <div className="mb-6">
            <h2 id="entry-title" className="text-2xl font-extrabold tracking-[-0.045em] text-foreground sm:text-[1.8rem]">{t("startPlaying")}</h2>
            <p className="mt-1.5 text-sm text-[#526157]">{t("noAccount")}</p>
          </div>
          <div role="group" aria-label={t("entryChoice")} className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-[#eee9de] p-1">
            {(["create", "join"] as const).map((option) => (
              <button key={option} type="button" aria-pressed={mode === option} onClick={() => setMode(option)} className={cn("flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold transition-[background-color,color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#13755a]", mode === option ? "bg-[#fffdf8] text-foreground shadow-sm" : "text-[#59685d] hover:text-foreground")}>
                {option === "create" ? <Plus aria-hidden="true" className="size-4" /> : <LogIn aria-hidden="true" className="size-4" />}
                {t(option === "create" ? "createTab" : "joinTab")}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="player-name" className="text-sm font-bold text-[#34443a]">{t("yourName")}</label>
              <Input id="player-name" value={name} onChange={(event) => setName(event.target.value)} placeholder={t("namePlaceholder")} autoComplete="nickname" maxLength={24} required className="h-12 rounded-xl border-[#d3cbbb] bg-white px-3.5 focus-visible:border-[#13755a]" />
            </div>
            {mode === "create" ? (
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-bold text-[#34443a]">{t("chooseDeck")}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DECKS.map((option) => (
                    <button key={option.id} type="button" onClick={() => setDeck(option.id)} aria-pressed={deck === option.id} className={cn("grid min-h-[76px] cursor-pointer grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2.5 rounded-xl border border-[#d8d1c5] bg-white p-3 text-left transition-[border-color,background-color,box-shadow] hover:border-[#8da895] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#13755a]", deck === option.id && "border-[#16765b] bg-[#eef6f0] shadow-[inset_0_0_0_1px_#16765b]")}>
                      <span aria-hidden="true" className={cn("grid h-11 w-8 place-items-center rounded-md border border-[#d8cfbf] bg-card-face font-serif text-lg font-bold", option.id === "tam-quoc-sat" && "border-[#c9973f] bg-[#2a4a3c] text-gilt")}>{option.mark}</span>
                      <span className="min-w-0"><b className="block text-[0.8rem] leading-tight text-foreground">{option.title ?? t(option.titleKey!)}</b><small className="mt-1 block whitespace-nowrap text-[0.69rem] leading-tight text-[#536359]">{t(option.noteKey)}</small></span>
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              <div className="grid gap-2">
                <label htmlFor="room-code" className="text-sm font-bold text-[#34443a]">{t("roomCode")}</label>
                <Input id="room-code" value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} placeholder="ABC123" maxLength={6} autoComplete="off" autoCapitalize="characters" spellCheck={false} required className="h-12 rounded-xl border-[#d3cbbb] bg-white px-3.5 font-extrabold tracking-[0.18em] uppercase focus-visible:border-[#13755a]" />
                <p className="text-xs leading-relaxed text-[#58685e]">{t("roomCodeHint")}</p>
              </div>
            )}
            <Button type="submit" disabled={!canSubmit} className="mt-2 h-12 cursor-pointer rounded-xl bg-[#d65538] text-sm font-bold text-white shadow-[0_5px_13px_rgba(214,85,56,0.2)] transition-[background-color,transform] hover:bg-[#b9452c] active:scale-[0.99] focus-visible:ring-[#d65538]/40">
              {busy ? t(mode === "create" ? "settingTable" : "joiningTable") : t(mode === "create" ? "createTable" : "joinRoom")}
              {!busy && <ArrowRight aria-hidden="true" className="size-4" />}
            </Button>
          </form>
        </section>
      </div>
      <footer className="border-t border-[#dfd5c4] bg-[#efe8da]/80 px-5 py-5 text-center text-xs text-[#536157] sm:px-8">
        <span className="inline-flex flex-wrap items-center justify-center gap-1">
          <span>Made with</span>
          <svg aria-hidden="true" viewBox="38 55 190 161" className="h-[1.2em] w-auto text-[#b74d33]">
            <path fill="currentColor" d="M132.8 214 45.6 107.2A30.3 30.3 0 0 1 40.5 90c0-18.2 13.8-33 30.8-33 17.4 0 30.8 13.2 30.8 30.6v29.1c0 18.7 11.8 30.3 30.7 30.3 19 0 31.2-11.6 31.2-30.3V87.6C164 70.2 177.7 57 195 57c17 0 30.8 14.8 30.8 33a30.3 30.3 0 0 1-5.1 17.2L132.8 214Z" />
          </svg>
          <span className="sr-only">love</span>
          <span>by</span>
          <a href="https://vietbrosinaus.com" className="font-bold text-[#94502e] underline underline-offset-2 hover:text-[#703817] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#13755a]">vietbrosinaus</a>
        </span>
      </footer>
    </main>
  );
}
