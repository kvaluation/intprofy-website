import type { AppProps } from 'next/app';
import Script from 'next/script';

const gtmId = 'GTM-TTSPVG5R';

// ===================================================================
// Consent Manager用のコンポーネント
// ===================================================================
const ConsentManagerScript = () => {
  return (
    <Script
      id="consent-manager-script"
      strategy="beforeInteractive" // GTMより先に読み込むための設定
      type="text/javascript"
      src="https://cdn.consentmanager.net/delivery/autoblocking/3d4a5c36a2327.js"
      data-cmp-ab="1"
      data-cmp-host="a.delivery.consentmanager.net"
      data-cmp-cdn="cdn.consentmanager.net"
      data-cmp-codesrc="0"
    />
  );
};
// ===================================================================
//
// GTM用のコンポーネント
// ===================================================================
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* 1. Consent Managerのスクリプトを読み込む */}
      <ConsentManagerScript />

      {/* 2. GTMの本体スクリプト (CMPの後に読み込まれる) */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </Script>
      
      {/* GTMのnoscript部分 */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      {/* Next.jsのページ本体 */}
      <Component {...pageProps} />
    </>
  );
}
// ===================================================================