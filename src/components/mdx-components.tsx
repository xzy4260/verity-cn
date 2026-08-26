import type { MDXComponents } from "mdx/types";
import * as React from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

// github-slugger 规则（与 TOC 数组中的 id 对齐）
// 关键：移除标点后用「单空格替换」（/ /g），不折叠连续空格，从而产生双连字符
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'"!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "")
    .replace(/ /g, "-");
}

// 从 React children 提取纯文本
function getText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getText).join("");
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    return getText(props.children);
  }
  return "";
}

// 生成 heading 的 id：优先用传入的 id，否则从文本 slug 化
function headingId(children: React.ReactNode, id?: string): string | undefined {
  if (id) return id;
  const text = getText(children);
  return text ? slugify(text) : undefined;
}

// shadcn/ui 风格的 MDX 组件映射
// 覆盖所有常见 Markdown 语法：标题/段落/链接/列表/代码/表格/引用/强调/删除/分割线/图片
export const mdxComponents: MDXComponents = {
  // 标题（手动生成 slug id，与 TOC 对齐）
  h1: ({ children, id, ...props }) => (
    <h1
      id={headingId(children, id)}
      className="mt-2 scroll-mt-24 text-3xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2
      id={headingId(children, id)}
      className="mt-10 scroll-mt-24 border-b border-border pb-2 text-2xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={headingId(children, id)}
      className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }) => (
    <h4
      id={headingId(children, id)}
      className="mt-6 scroll-mt-24 text-base font-semibold"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, id, ...props }) => (
    <h5
      id={headingId(children, id)}
      className="mt-4 scroll-mt-24 text-sm font-semibold"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, id, ...props }) => (
    <h6
      id={headingId(children, id)}
      className="mt-4 scroll-mt-24 text-sm font-medium"
      {...props}
    >
      {children}
    </h6>
  ),

  // 段落
  p: ({ children, ...props }) => (
    <p className="mt-4 text-sm leading-7 text-muted-foreground" {...props}>
      {children}
    </p>
  ),

  // 链接（区分内外链）
  a: ({ href, children, ...props }) => {
    const isInternal = href?.startsWith("/") || href?.startsWith("#");
    if (isInternal) {
      return (
        <Link
          href={href ?? ""}
          className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          {...props}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        {...props}
      >
        {children}
      </a>
    );
  },

  // 列表
  ul: ({ children, ...props }) => (
    <ul
      className="mt-4 ml-6 list-disc space-y-2 text-sm text-muted-foreground [&>li>ul]:mt-2"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mt-4 ml-6 list-decimal space-y-2 text-sm text-muted-foreground [&>li>ul]:mt-2 [&>li>ol]:mt-2"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7 [&>p]:mt-0 [&>p]:inline" {...props}>
      {children}
    </li>
  ),

  // 代码
  code: ({ children, className, ...props }) => {
    // 行内 code（无 language class）
    if (!className) {
      return (
        <code
          className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    }
    // 代码块里的 code（由 pre 处理）
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // 代码块
  pre: ({ children, ...props }) => {
    const codeChild = children as React.ReactElement<{
      className?: string;
      children?: string;
    }>;
    const lang = codeChild?.props?.className?.replace("language-", "") ?? "";
    const code = codeChild?.props?.children ?? "";
    return <CodeBlock code={String(code).trim()} lang={lang} />;
  },

  // 表格
  table: ({ children, ...props }) => (
    <div className="mt-4 w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-border" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="transition-colors hover:bg-muted/30" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-4 py-2.5 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2.5 align-top text-muted-foreground" {...props}>
      {children}
    </td>
  ),

  // 引用块
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-4 rounded-r-lg border-l-4 border-primary/40 bg-muted/50 py-3 pl-4 pr-4 text-sm text-muted-foreground [&>p]:mt-0 [&>p:first-of-type]:font-medium [&>p:first-of-type]:text-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // 强调 / 斜体 / 删除线
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  del: ({ children, ...props }) => (
    <del className="text-muted-foreground line-through" {...props}>
      {children}
    </del>
  ),

  // 分割线
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,

  // 图片
  img: ({ src, alt, ...props }) => (
    <img
      src={src}
      alt={alt ?? ""}
      className="mt-4 rounded-lg border border-border"
      {...props}
    />
  ),
};

declare global {
  type MDXProvidedComponents = typeof mdxComponents;
}
