# ブログ記事追加の手順

新しいブログ記事を追加する際の更新手順です。

## 必要な作業

新しいブログ記事を追加するには、以下の3つのファイルを更新します：

### 1. `/pages/blogs/` に新しいmdxファイルを作成

例：`/pages/blogs/blog20251203.mdx`

```mdx
# 記事のタイトル

記事の本文をここに書く...
```

### 2. `/pages/blogs/_meta.json` を更新

新しい記事のエントリを追加します。**タイトルは正確に一致させること。**

```json
{
  "*": {
    "theme": {
      "breadcrumb": true,
      "footer": true,
      "sidebar": true,
      "toc": true,
      "pagination": true
    },
    "type": "doc"
  },
  "blog20251201": {
    "title": "依拠の類似を生成AI出力画像から見つけるいくつかの方法（１）",
    "type": "page"
  },
  "blog20251202": {
    "title": "免除ロイヤリティ料率で目標の営業利益率を記述する",
    "type": "page"
  },
  "blog20251203": {
    "title": "新しい記事のタイトル",
    "type": "page"
  }
}
```

### 3. `/components/BlogList.tsx` を更新

`blogPosts` 配列に新しい記事の情報を追加します。

```typescript
const blogPosts: BlogPost[] = [
  {
    slug: 'blog20251201',
    title: '依拠の類似を生成AI出力画像から見つけるいくつかの方法（１）',
    shortTitle: '依拠の類似(1)',
    date: '2025-12-01',
    tags: ['生成AI', '著作権', '無断学習禁止']
  },
  {
    slug: 'blog20251202',
    title: '免除ロイヤリティ料率で目標の営業利益率を記述する',
    shortTitle: '免除ロイヤリティ',
    date: '2025-12-02',
    tags: ['免除ロイヤリティ', '営業利益率']
  },
  {
    slug: 'blog20251203',
    title: '新しい記事のタイトル',
    shortTitle: '短縮タイトル',
    date: '2025-12-03',
    tags: ['タグ1', 'タグ2']
  }
]
```

## 重要な注意点

1. **タイトルの一致**: `/pages/blogs/_meta.json` と `/components/BlogList.tsx` の `title` は**完全に一致**させること
2. **slug**: ファイル名（拡張子なし）と一致させる（例：`blog20251203.mdx` → `slug: 'blog20251203'`）
3. **日付順**: `BlogList.tsx` では日付の新しい順に自動ソートされるため、配列の順序は任意
4. **タグ**: 複数のタグを設定可能。タグでフィルタリングできる

## デプロイ

3つのファイルを更新後、Gitにコミット・プッシュすれば、Vercelが自動的にデプロイします。

```bash
git add pages/blogs/blog20251203.mdx pages/blogs/_meta.json components/BlogList.tsx
git commit -m "Add new blog post: blog20251203"
git push
```
