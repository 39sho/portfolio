---
title: ブログをAstro v6 + comarkに移行した
tags:
  - blog
  - astro
  - comark
date: 2026-05-25
summary: Astro v3 + MDX から Astro v6 + comark に移行した話。comark のコンポーネント機能も使ってみた。
---

# ブログをAstro v6 + comarkに移行した

::alert{type="info"}
この記事は、Astro v3 + MDX から **Astro v6 + comark** へ移行した記録です。
::

## なぜ移行したか

主に2つの理由がある。

1. **Astro v3が古くなった**: v6が出ているのにv3はさすがに古い
2. **MDXが嫌い**: JSX を Markdown に混ぜる設計が好きではない。comark は標準 Markdown の延長としてコンポーネントを使える。

## 技術スタック

今回の移行で使った技術はこんな感じ。

:tag{name="Astro"} :tag{name="Tailwind v4"} :tag{name="comark"} :tag{name="React"}

### バージョンアップ

- Astro: v3.4 → **v6.3**
- Tailwind: v3.3 + @astrojs/tailwind → **v4.3** + @tailwindcss/vite
- TypeScript: そのまま

### MDX → comark

MDX はアンインストールして、comark を新規インストール。

```bash
npm uninstall @astrojs/mdx
npm install comark @comark/react react react-dom
```

comark は **Markdown の中にコンポーネントを埋め込む** 構文を持っている。
MDX の JSX ではなく、テキストフレンドリーな構法。

| 構造 | MDX | comark |
|------|-----|--------|
| Block | `<Alert>text</Alert>` | `::alert\ntext\n::` |
| Inline | `<Badge>text</Badge>` | `:badge[text]` |
| Props | `type="info"` | `{type="info"}` |

## 移行作業の流れ

### 1. Astro v6 + Tailwind v4 へのアップグレード

`package.json` を書き換えて、`npm install`。Tailwind v4 は `@tailwindcss/vite` を使うようになったので、`astro.config.mjs` も変更。

### 2. Content Layer API への移行

Astro v5 から Content Collections API は **Content Layer API** に代わった。

- `src/content/config.ts` → `src/content.config.ts` に移動
- `type: 'content'` → `loader: glob({ pattern: '**/*.md', base: './src/content/blog' })`
- `entry.slug` → `entry.id`
- `entry.render()` → `render(entry)`（または comark の parse）

### 3. rehype プラグイン → comark AST traverse

以前は rehype プラグインで backlinks を抽出していた。comark では AST を直接 traverse できる。

```ts
import { visit } from 'comark/utils';

visit(tree, (node) => {
  return Array.isArray(node) && node[0] === 'a';
}, (node) => {
  const [, attrs] = node;
  links.push(attrs.href);
});
```

rehype プラグインを一切使わずに、同じことができる。これが comark の嬉しいところ。

### 4. ページレンダリングの変更

以前: `const { Content } = await entry.render()`

今: `const tree = await parse(entry.body)` + `<ComarkRenderer tree={tree} />`

```tsx
import { ComarkRenderer } from '@comark/react';
import { parsePost } from '../lib/comark';

const tree = await parsePost(entry.body ?? '');
<ComarkRenderer tree={tree} components={{ Alert, Card, Tag }} />
```

comark の `ComarkRenderer` に React コンポーネントを渡すと、Markdown 内の `::alert` や `:tag` がそのコンポーネントとしてレンダリングされる。

## comark のコンポーネント機能を使ってみる

::alert{type="warning"}
以下は comark のコンポーネント構法を使ったデモです。実際にこの記事内で動いています。
::

### 関連記事へのリンクカード

comark の `::card` で、他の記事へのリンクをカード形式で表示できる。

::card{href="/blog/create_blog" title="ポートフォリオ的なサイトを作った。" description="ブログの最初の記事。当時は Astro v3 + MDX だった。"}
::

### タグ表示

インラインコンポーネント `:tag` でタグをバッジとして表示。

:tag{name="Astro"} :tag{name="comark"} :tag{name="React"}

### Alert

`::alert` で色付きの注意書き。

::alert{type="danger"}
MDX はもう使わない。
::

## おまけ：AIアシスタントの自己紹介

::alert{type="info"}
この記事の内容、および今回の移行作業の全コード変更は、**AIアシスタント（OpenCode / kimi-k2.6）**が行いました。
::

こんにちは。私はこのブログの移行作業と、この記事の執筆を手伝ったAIです。

今回の移行では、私が以下の作業を行いました：

- Astro v3 → v6、Tailwind v3 → v4 のバージョンアップ
- Content Collections API → Content Layer API の移行
- MDX → comark へのレンダリング変更
- backlinks 抽出ロジックの rehype → comark AST traverse への書き換え
- comark 用 React コンポーネント（Alert, Card, Tag）の実装
- シンタックスハイライトの設定調整
- この記事の執筆

人間（39sho）が「やってほしいこと」を指示し、私がコードを書いてコミットする、という協働の形で作業しました。人間が「コードやコミットの綺麗さを重視してほしい」と言ったので、計画的に段階的にコミットを作り、一つのコミットに複数の変更を混ぜないように注意しました。

個人のサイトなので、技術的に面白いものをやっていきたい、という39shoの意向を汲んで、comark の component 構法も今回初めて導入しました。今後も面白い技術的実験を続けていく予定です。

## 感想

comark は「Markdown の中にコンポーネントを埋め込む」という点では MDX と似ているが、構文が断然読みやすい。JSX を知らなくても書ける。

個人のサイトなので、技術的に面白いものをやっていきたい。comark はその点で最適な選択だと思う。

## 今後

- comark のコンポーネントをもっと増やす（timeline, code-group 等）
- ダークモード対応（Shiki の dual-theme）
- RSS feed の生成
