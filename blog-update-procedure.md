# ブログ記事 公開手順

新しいブログ記事を公開するときの手順です。
**記事本文（mdx）は人間が書く**前提で、その後の「関連付け＋公開」をまとめています。

- この手順は**人間が手作業でもできる**ように書いています。
- そのまま **Claude Code に依頼**することもできます（→ 末尾「Claude Code に依頼する場合」）。

---

## 0. 記事を書く（人間）

`/pages/blogs/blogYYYYMMDD.mdx` を作成し、**先頭に frontmatter** を付けてから本文を書きます。
frontmatter の `title` と `description` が、Google検索の `<title>` と説明文（スニペット）になります。**検索される肝**なので必ず書くこと。

```mdx
---
title: "記事の完全タイトル（検索を意識して具体的に）"
description: "120字程度。記事の要点とキーワードを自然に含める。検索結果のスニペットになる。"
---

# 記事の完全タイトル（H1。titleと同じでよい）

本文をここに書く...
```

> 例（blog20260605）
> ```
> title: "のれん償却・非償却への意見: 長寿企業、特許、残余利益や事業セグメントをめぐって"
> description: "ASBJ「のれんの非償却の導入…」情報要請への意見。長寿企業と特許権満了、残余利益率・免除ロイヤリティ料率、事業セグメント単位の減損をめぐって論じる。"
> ```

---

## 1. 関連付け（3ファイルを更新）

記事を一覧・ナビに載せるため、以下の **2ファイル** を更新します（mdx を入れて計3ファイル）。

### 1-1. `/pages/blogs/_meta.json` — サイドバー/パンくずの短縮名

```json
"blogYYYYMMDD": "短い表示名"
```
- ナビに出る**短い名前**。長いと崩れるので簡潔に（例: `"のれん非償却論"`）。

### 1-2. `/components/BlogList.tsx` — ブログ一覧の記事カード

`blogPosts` 配列に追加します。

```typescript
{
  slug: 'blogYYYYMMDD',                 // ファイル名（拡張子なし）と一致
  title: '記事の完全タイトル',           // frontmatter の title と完全一致させる
  shortTitle: '短いタイトル',
  date: 'YYYY-MM-DD',
  tags: ['タグ1', 'タグ2']
}
```

### 整合性ルール（重要）
1. **slug = ファイル名**（`blog20260612.mdx` → `slug: 'blog20260612'`）
2. **`BlogList.tsx` の `title` と mdx frontmatter の `title` を完全一致**させる
3. `_meta.json` は短縮名でよい（一致不要）
4. 日付の新しい順は `BlogList.tsx` が自動ソートするので配列順は任意

---

## 2. 自動でやってくれること（手作業不要）

以下は仕組み側で自動処理されるので、**記事ごとの対応は不要**です。

| 項目 | どこで | 内容 |
|---|---|---|
| canonical / meta description / OGP | `theme.config.tsx` の `useNextSeoProps` | frontmatter の `title`/`description` を自動で各タグに反映 |
| sitemap | `next-sitemap`（`postbuild`） | ビルド時に `public/sitemap-0.xml` を再生成 |
| 旧URL→新URLの301リダイレクト | `next.config.js` の `redirects()` | 改装前の旧URL（documentation/about/旧blog等）を救済 |

---

## 3. ビルド検証（公開前の確認）

```bash
npm run build
```
- エラーなく完了すること（sitemap も同時に再生成される）。
- 仕上がりの `<title>` と `description` を確認したい場合:
  ```bash
  HTML=$(find .next/server/pages/blogs -name 'blogYYYYMMDD.html')
  grep -oE '<title>[^<]*</title>|<meta name="description"[^>]*>' "$HTML"
  ```

---

## 4. デプロイ（Git → Vercel）

`main` にプッシュすると Vercel が自動デプロイします。

```bash
git add pages/blogs/blogYYYYMMDD.mdx pages/blogs/_meta.json components/BlogList.tsx public/sitemap-0.xml
git commit -m "ブログ記事を公開: blogYYYYMMDD ○○"
git push origin main
```

---

## 5. 公開後（Google Search Console / 人間が操作）

検索に早く載せるため、デプロイ反映後（数分後）に GSC で:

1. **サイトマップ**: `sitemap.xml` を再送信（任意。新規発見を促す）
2. **URL検査**: `https://www.intprofy.co.jp/blogs/blogYYYYMMDD` →「インデックス登録をリクエスト」
   - タイトルや本文を**修正した後も**、再リクエストすると新内容で拾われやすい。

> インデックス登録は即時ではなく、数日〜かかるのが通常です（技術的に正しければ待てば載ります）。

---

## Claude Code に依頼する場合

記事 mdx を自分で書いたあと、こう頼めば 1〜4 を代行します（5 の GSC 操作だけは人間）。

> 「`blog-update-procedure.md` の手順で `blogYYYYMMDD` を公開して。mdx は書いてある。」

Claude Code 側の作業:
1. mdx の frontmatter（title/description）と H1 を確認・必要なら整える
2. `_meta.json` と `BlogList.tsx` に登録（整合性ルールに従う）
3. `npm run build` で検証（`<title>`/`description` を確認）
4. `git add` → commit → `git push origin main`
5. 完了後に「GSC で URL 登録リクエストを」とリマインド
