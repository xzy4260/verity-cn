"use client";

import * as React from "react";

export interface DocTocItem {
  id: string;
  label: string;
  /** 步骤编号，存在时 TOC 会展示编号圆点 */
  n?: number;
}

interface DocsTocApi {
  register: (item: DocTocItem) => void;
  unregister: (id: string) => void;
}

const DocsTocApiContext = React.createContext<DocsTocApi | null>(null);
const DocsTocItemsContext = React.createContext<DocTocItem[]>([]);

/**
 * 文档页 TOC 注册中心：Step 等内容组件挂载时把自身标题注册进来，
 * Toc 不传 items 时会自动读取，保证目录与正文永远一致。
 * 注册 API 与列表数据拆分为两个 Context，前者引用永远稳定，
 * 避免 items 变化导致 Step 的注册 effect 无限重跑。
 */
export function DocsTocProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<DocTocItem[]>([]);

  const register = React.useCallback((item: DocTocItem) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, item]
    );
  }, []);

  const unregister = React.useCallback((id: string) => {
    setItems((prev) =>
      prev.some((i) => i.id === id)
        ? prev.filter((i) => i.id !== id)
        : prev
    );
  }, []);

  const api = React.useMemo(() => ({ register, unregister }), [
    register,
    unregister,
  ]);

  return (
    <DocsTocApiContext.Provider value={api}>
      <DocsTocItemsContext.Provider value={items}>
        {children}
      </DocsTocItemsContext.Provider>
    </DocsTocApiContext.Provider>
  );
}

/** 注册 API（引用稳定，可安全作为 effect 依赖） */
export function useDocsToc() {
  return React.useContext(DocsTocApiContext);
}

/** 已注册的目录项 */
export function useDocsTocItems() {
  return React.useContext(DocsTocItemsContext);
}
