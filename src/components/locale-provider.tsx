"use client";

import * as React from "react";
import type { LocaleCode } from "@/lib/i18n";
import type { Messages } from "@/lib/dictionary";

type LocaleContextValue = {
  locale: LocaleCode;
  messages: Messages;
};

const LocaleContext = React.createContext<LocaleContextValue>({
  locale: "zh-CN",
  messages: {},
});

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: LocaleCode;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => ({ locale, messages }), [locale, messages]);

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleCode {
  return React.useContext(LocaleContext).locale;
}

/** 客户端组件的翻译函数；键不存在时原样返回键名，方便发现漏配 */
export function useT() {
  const { messages } = React.useContext(LocaleContext);
  return React.useMemo(() => {
    const t = (key: string): string => {
      const i = key.indexOf(".");
      const ns = i < 0 ? key : key.slice(0, i);
      return messages[ns]?.[key] ?? key;
    };
    return t;
  }, [messages]);
}
