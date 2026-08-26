# ブログ記事 公開手順

新しいブログ記事を公開するときの手順です。
**記事本文（mdx）は人間が書く**前提で、その後の「関連付け＋公開」をまとめています。

- この手順は**人間が手作業でもできる**ように書いています。
- そのまま **Claude Code に依頼**することもできます（→ 末尾「Claude Code に依頼する場合」）。

> **重要な設計方針（2026-07 以降）**
> ブログ一覧（`/blogs`）は **各記事 mdx の frontmatter を唯一の情報源** として自動生成されます。
> `components/BlogList.tsx` は `getPagesUnderRoute('/blogs')` で frontmatter を読むだけなので、
> **記事追加時に `BlogList.tsx` を編集する必要はありません**（もう触らない）。
> 記事の frontmatter を正しく書くことがすべてです。

---

## 0. 記事を書く（人間）

`/pages/blogs/blogYYYYMMDD.mdx` を作成し、**先頭に frontmatter を完備**してから本文を書きます。
この frontmatter が、検索の `<title>`／説明文だけでなく、**一覧・タグ・日付表示のすべての情報源**になります。

```mdx
---
title: "記事の完全タイトル（検索を意識して具体的に）"
description: "120字程度。記事の要点とキーワードを自然に含める。検索結果のスニペットになる。"
shortTitle: "短い名前"
date: "YYYY-MM-DD"
tags: ["タグ1", "タグ2"]
---

# 記事の完全タイトル（H1。title と同じにする）

本文をここに書く...
```

### frontmatter 各項目の役割
| キー | 役割 | 注意 |
|---|---|---|
| `title` | 検索の `<title>`／OGP／記事ページ見出し | 具体的・検索を意識。H1 と揃える |
| `description` | 検索スニペット／meta description／OGP | 120字程度、キーワードを自然に含める |
| `shortTitle` | 予備の短縮名（将来の一覧表示等で使用可） | 簡潔に |
| `date` | 一覧の表示日付＆並び替えキー | **必ず `"YYYY-MM-DD"` とダブルクオートで囲む**（YAMLが日付型に変換するのを防ぐ） |
| `tags` | 一覧のタグフィルタ | `["A", "B"]` の配列。既存タグと表記を合わせると filter がまとまる |

> 例（blog20260605）
> ```yaml
> title: "のれん償却・非償却への意見: 長寿企業、特許、残余利益や事業セグメントをめぐって"
> description: "ASBJ「のれんの非償却の導入…」情報要請への意見。…減損をめぐって論じる。"
> shortTitle: "のれん非償却論"
> date: "2026-06-05"
> tags: ["のれん", "特許権", "免除ロイヤリティ", "営業利益率"]
> ```


### 動画を入れる場合（Vimeo）

動画は Vimeo に置き、記事本文の入れたい位置に `<Vimeo>` を1行書きます。
**`import` は不要**です（`theme.config.tsx` の `components` に登録済み）。

```mdx
<Vimeo id="1234567890" title="音声を聞かなくても内容が分かる説明" caption="動画1　…" />
```

- `id` … Vimeo の共有URL `https://vimeo.com/1234567890` の**数字部分**。必須。
- `title` … 必須。スクリーンリーダーが読み上げ、検索にも使われる。
- `caption` … 任意。動画の下に小さく出る（`<figcaption>`）。
- `ratio` … 任意。既定は `16 / 9`。縦動画は `"9 / 16"`、横長の画面録画は `"16 / 10"` など。
- `h` … 任意。**限定公開**動画のハッシュ。一般公開なら不要。

> **プライバシー**
> 埋め込みURLに `dnt=1`（Do Not Track）を付けているため、Cookie を置かず視聴も追跡しません。
> Consent Manager（CMP）との衝突を避けるための設計です。

> **サムネイル（任意）**
> 動画の1コマを静止画にして `public/<slug>/video01.jpg` に置き、frontmatter に
> `image: /<slug>/video01.jpg` を書くと、SNSカードが「動画のある記事」だと分かる絵になります。

実装は **`components/Vimeo.tsx` の1ファイルに閉じています**。
プレイヤーの挙動（遅延読込・比率・プライバシー・将来のクリック後読込など）を変えるときは、
記事ではなくこのファイルを直します。サイトを別フレームワークへ移す際も、
同じ props のコンポーネントを1本書き直せば**記事本文は無変更**で済みます。

---

## 1. 関連付け（`_meta.json` に1行だけ）

`BlogList.tsx` は自動追従するので、手で更新するのは **`/pages/blogs/_meta.json`** の1ファイルだけです。
サイドバー／パンくずの**短縮名**を1行追加します。

```json
"blogYYYYMMDD": "短い表示名"
```
- ナビに出る**短い名前**。長いと崩れるので簡潔に（例: `"のれん非償却論"`）。
- 一覧に出す本文タイトルとは別物でよい（一致不要）。

### ルール
1. **ファイル名＝スラッグ**（`blog20260612.mdx` → URL は `/blogs/blog20260612`）
2. 一覧に載る条件は「frontmatter に `date` があること」。`date` を書き忘れると一覧に出ない。
3. 並び順は `date` の新しい順に自動ソート。

---

## 2. 自動でやってくれること（手作業不要）

| 項目 | どこで | 内容 |
|---|---|---|
| **ブログ一覧・タグ・日付** | `components/BlogList.tsx`＋`getPagesUnderRoute` | 各記事 frontmatter から自動生成 |
| canonical / meta description / OGP | `theme.config.tsx` の `useNextSeoProps` | frontmatter の `title`/`description` を各タグに反映 |
| sitemap | `next-sitemap`（`postbuild`） | ビルド時に `public/sitemap-0.xml` を再生成 |
| 旧URL→新URLの301リダイレクト | `next.config.js` の `redirects()` | 改装前の旧URL（documentation/about/旧blog等）を救済 |

---

## 3. ビルド検証（公開前の確認）

> ⚠️ **frontmatter を変更したら必ずクリーンビルド。**
> Nextra は frontMatter を `.next` にキャッシュするため、`npm run build` だけだと
> 一覧に**古い（または空の）情報**が残ることがある。必ず `.next` を消してからビルドする。

```bash
rm -rf .next && npm run build
```
- エラーなく完了すること（sitemap も同時に再生成される）。
- 一覧に記事が出ているか（空でないか）を確認:
  ```bash
  HB=$(find .next/server/pages -name 'blogs.html')
  grep -oE '20[0-9]{2}-[0-9]{2}-[0-9]{2}' "$HB" | sort -u    # 記事の日付が並ぶ
  grep -c '選択したタグに一致' "$HB"                          # 0 であること（空でない）
  ```
- 記事ページの `<title>`/`description` を確認:
  ```bash
  H=$(find .next/server/pages/blogs -name 'blogYYYYMMDD.html')
  grep -oE '<title>[^<]*</title>|<meta name="description"[^>]*>' "$H"
  ```
- 動画を入れた記事は、プレイヤーの iframe が出ているかを確認:
  ```bash
  grep -oE '<iframe src="https://player.vimeo.com/video/[^"]*"' "$H"
  ```
  `REPLACE_WITH_VIMEO_ID` のような**プレースホルダのまま残っていないか**をここで潰す。

---

## 4. デプロイ（Git → Vercel）

`main` にプッシュすると Vercel が自動デプロイします。

```bash
git add pages/blogs/blogYYYYMMDD.mdx pages/blogs/_meta.json public/sitemap-0.xml
git commit -m "ブログ記事を公開: blogYYYYMMDD ○○"
git push origin main
```

> デプロイ後は本番 `/blogs` を目視し、全記事が表示されるか（frontMatter キャッシュ由来の空表示が起きていないか）を一度確認すると安心。
>
> **動画を入れた記事は、本番ページで実際に再生できるかも確認する。**
> Consent Manager の自動ブロックが `player.vimeo.com` を止めていると、動画の位置に同意プレースホルダが出る。
> その場合は consentmanager の管理画面で許可リストに入れる（`dnt=1` で追跡していないため、その判断ができる）。

### ⚠️ ビルドキャッシュで一覧だけが古くなる

Vercel はデプロイ間で Next.js のビルドキャッシュを復元する。
**mdx と `_meta.json` しか変更していないデプロイでは、キャッシュされた古いページマップが再利用され、
記事ページは最新なのに `/blogs` の一覧・タグ・サイドバーだけが古いまま**になることがある。
このブログは通常 mdx の追加だけなので、放置すると毎回起きる。

- 対策: Vercel → プロジェクト → Settings → Environment Variables に
  `VERCEL_FORCE_NO_BUILD_CACHE` = `1`（Production）を設定し、毎回キャッシュなしでビルドさせる。
- その場しのぎ: Deployments → 対象デプロイの「⋯」→ Redeploy で
  **「Use existing Build Cache」のチェックを外す**。
- どうしてもダッシュボードを触れないとき: `.tsx` のどれかに1行加えて push すると
  キャッシュが壊れて一覧が更新される（応急処置）。

> **確認は記事ページではなく `/blogs` で行う。**
> この不具合が起きていても記事ページは正常に表示されるため、
> 公開直後に記事URLだけを見ると「問題なし」に見えてしまう。

```bash
# 本番の一覧が更新されたかの確認
curl -s https://www.intprofy.co.jp/blogs | grep -c 'blogs/blogYYYYMMDD'   # 1 であること
curl -s https://www.intprofy.co.jp/blogs | grep -c '選択したタグに一致'    # 0 であること
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
1. mdx の frontmatter（title/description/shortTitle/date/tags）と H1 を確認・必要なら整える
2. `_meta.json` に短縮名を1行登録（`BlogList.tsx` は触らない）
3. `rm -rf .next && npm run build` で検証（一覧が空でないこと・`<title>`/`description` を確認）
4. `git add` → commit → `git push origin main`
5. 完了後に「GSC で URL 登録リクエストを」とリマインド
