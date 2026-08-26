import React from 'react'

// 記事本文に動画を埋め込むためのコンポーネント。
// 記事側は <Vimeo id="1234567890" title="…" /> とだけ書く。
// iframe の組み立て・比率・遅延読込・プライバシー設定はすべてここに閉じ込める。
// theme.config.tsx の components に登録済みなので、記事ごとの import は不要。
//
// 将来サイトを Astro 等へ移す際は、同じ props を持つコンポーネントを1本書き直せばよく、
// 記事本文（<Vimeo …> の行）は変更しなくてよい。

interface VimeoProps {
  /** Vimeo の動画ID（共有URL https://vimeo.com/1234567890 の数字部分） */
  id: string
  /** 限定公開動画のハッシュ（URLの ?h=… または /1234567890/abcdef の後半）。一般公開なら不要 */
  h?: string
  /** 動画の内容を表す説明。スクリーンリーダー用なので必須にしている */
  title: string
  /** 動画の下に出すキャプション（図表番号など） */
  caption?: string
  /** アスペクト比。既定は 16:9。縦動画は '9 / 16'、画面録画は '16 / 10' など */
  ratio?: string
}

const Vimeo: React.FC<VimeoProps> = ({ id, h, title, caption, ratio = '16 / 9' }) => {
  // 限定公開／埋め込み専用の動画は、プライバシーハッシュを動画IDの直後（先頭パラメータ）に
  // 置く必要がある。他のパラメータはその後ろに続ける。
  // dnt=1: Do Not Track。Cookie を置かず視聴追跡もしないので、同意管理の負担を下げる。
  const params = new URLSearchParams()
  if (h) params.set('h', h)
  params.set('dnt', '1')
  params.set('title', '0')
  params.set('byline', '0')
  params.set('portrait', '0')

  // data-cmp-ab="1" は consentmanager の自動ブロックから iframe を除外する指定。
  // この埋め込みは dnt=1 で Cookie を置かず視聴追跡もしないため、同意ゲートの対象にしない。
  // 外すと「不明なベンダー」の同意プレースホルダに差し替えられ、
  // Cookie を拒否した読者には動画が表示されなくなる。
  return (
    <figure style={{ margin: '1.5rem 0' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: ratio }}>
        <iframe
          src={`https://player.vimeo.com/video/${id}?${params.toString()}`}
          title={title}
          loading="lazy"
          data-cmp-ab="1"
          allow="fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
          }}
        />
      </div>
      {caption && (
        <figcaption style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default Vimeo
