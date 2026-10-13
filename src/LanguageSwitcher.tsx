import { memo, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import { LanguageContext, LanguageFailureContext, LanguagePendingContext, languages, useI18n } from "./i18n";
import { Icon } from "./Icons";
import type { Locale } from "./i18n";

type Language = (typeof languages)[number];

const LanguageName = memo(function LanguageName({ language, id }: { language: Language; id?: string }) {
  return <bdi id={id} lang={language.locale} translate="no">{language.name}</bdi>;
});

const LanguageOption = memo(function LanguageOption({ language, id, selected, active, onSelect }: {
  language: Language;
  id: string;
  selected: boolean;
  active: boolean;
  onSelect: (locale: Locale) => void;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      className={`language-option${active ? " is-active" : ""}`}
      onMouseDown={event => event.preventDefault()}
      onClick={() => onSelect(language.locale)}
    >
      <LanguageName language={language} />
      {selected && <Icon name="check" />}
    </div>
  );
});

const LanguageMenu = memo(function LanguageMenu({ id, locale, active, onSelect, listRef }: {
  id: string;
  locale: Locale;
  active: number;
  onSelect: (locale: Locale) => void;
  listRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="language-menu" id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} ref={listRef}>
      {languages.map((language, index) => (
        <LanguageOption
          key={language.locale}
          id={`${id}-${language.locale}`}
          language={language}
          selected={language.locale === locale}
          active={active === index}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
});

const LanguageTrigger = memo(function LanguageTrigger({ id, language, open, activeId, onClick, onKeyDown }: {
  id: string;
  language: Language;
  open: boolean;
  activeId: string | undefined;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const pending = useContext(LanguagePendingContext);
  return (
    <button
      type="button"
      className="language-trigger"
      role="combobox"
      aria-labelledby={`${id}-label ${id}-value`}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={`${id}-list`}
      aria-activedescendant={activeId}
      aria-busy={pending}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <LanguageName id={`${id}-value`} language={language} />
      <span className="language-chevron" aria-hidden="true" />
    </button>
  );
});

const LanguageErrorMessage = memo(function LanguageErrorMessage() {
  const { t } = useI18n();
  return <span role="alert">{t("languageLoadError")}</span>;
});

const LanguageError = memo(function LanguageError() {
  const failed = useContext(LanguageFailureContext);
  return failed ? <LanguageErrorMessage /> : null;
});

export const LanguageSwitcher = memo(function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const selectLanguage = useContext(LanguageContext)!;
  const selected = languages.findIndex(language => language.locale === locale);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(selected);
  const container = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const choose = useCallback((next: Locale) => {
    setOpen(false);
    void selectLanguage(next);
  }, [selectLanguage]);
  const toggle = useCallback(() => {
    setActive(selected);
    search.current.text = "";
    setOpen(current => !current);
  }, [selected]);
  const keys = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape") {
      if (!open) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(languages[active].locale);
      else toggle();
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      if (event.key === "Home") setActive(0);
      else if (event.key === "End") setActive(languages.length - 1);
      else if (!open) setActive(selected);
      else setActive(current => (current + (event.key === "ArrowDown" ? 1 : languages.length - 1)) % languages.length);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      const now = performance.now();
      search.current.text = (now - search.current.time < 700 ? search.current.text : "") + event.key.toLocaleLowerCase();
      search.current.time = now;
      const term = [...search.current.text].every(character => character === search.current.text[0])
        ? search.current.text[0] : search.current.text;
      const next = languages.map((_, index) => (active + index + 1) % languages.length)
        .find(index => languages[index].name.toLocaleLowerCase().startsWith(term));
      if (next !== undefined) {
        setActive(next);
        setOpen(true);
      }
    }
  }, [open, active, selected, choose, toggle]);

  return (
    <div
      className="language-switcher"
      ref={container}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <span className="language-label" id={`${id}-label`}>{t("language")}</span>
      <LanguageTrigger
        id={id}
        language={languages[selected]}
        open={open}
        activeId={open ? `${id}-${languages[active].locale}` : undefined}
        onClick={toggle}
        onKeyDown={keys}
      />
      {open && <LanguageMenu id={id} locale={locale} active={active} onSelect={choose} listRef={list} />}
      <LanguageError />
    </div>
  );
});
