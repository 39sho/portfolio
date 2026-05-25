# ポートフォリオ兼ブログのリニューアル計画

## 現状
- Astro v3 + MDX + Tailwind
- `src/content/blog/*.mdx`, `src/content/profile/*.mdx` を Content Collections で管理
- カスタム rehype-forlink プラグインで backlinks
- `entry.render()` で Content + headings を取得

## 目標
- Astro v5 にアップグレード
- Content Collections → Content Layer API 移行
- MDX → comark に移行
- デザインは変更しない
- 今後 comark の component 構文を使いたい

## Phase
1. Astro v5 アップグレード（package.json, config更新）
2. Content Collections → Content Layer API 移行
3. React + comark セットアップ
4. MDX → .md 移行 + backlinkシステム comark移行
5. ページを comark レンダリングに更新
6. ビルドテスト・修正

## 承認
- comark component 構法は今後使う
- Content Layer API に移行
- comark 内蔵のシンタックスハイライトを使用
- @comark/react + React でレンダリング
