import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Buzz Styleの使い方とFAQ。YouTube Shortsのバズ型を毎日追わなくても、今週の勝ちパターンをまとめて把握できます。",
};

const steps = [
  {
    title: "型一覧を見る",
    body: "トップページで今週バズっているShortsの「型」を10個まで確認できます。個別の動画ランキングではなく、構成パターン単位でまとめています。",
  },
  {
    title: "気になる型の詳細へ",
    body: "型名をクリックすると、特徴・真似チェックリスト・サンプル動画・ジャンル内訳が見られます。自分のジャンルに当てはめやすい型を選びましょう。",
  },
  {
    title: "自分のコンテンツに当てはめる",
    body: "チェックリストと真似ポイントを参考に、自分のShorts制作に応用してください。動画本体の分析ではなく、メタデータとサムネから抽出した型です。",
  },
];

const faqs = [
  {
    q: "「型」とは何ですか？",
    a: "複数のバズ動画に共通する構成パターン・トピック・見た目の特徴をまとめたフォーマットのことです。1本1本のランキングではなく、「こういう作り方の動画が今伸びている」という単位で見せます。",
  },
  {
    q: "データはどこから来ていますか？",
    a: "YouTube Data API v3でShortsのメタデータを取得し、Gemini 2.5 Flashで型の分類・分析を行っています。1時間ごとに更新されます（MVP実装予定）。",
  },
  {
    q: "登録や課金は必要ですか？",
    a: "不要です。Buzz Styleは完全無料の公開ツールです。",
  },
  {
    q: "TikTokやReelsにも対応していますか？",
    a: "MVPではYouTube Shortsのみです。TikTok / Instagram ReelsはPhase 2で検討中です。",
  },
];

export default function AboutPage() {
  return (
    <div className="container-main max-w-3xl">
      <p className="eyebrow mb-2">About Buzz Style</p>
      <h1 className="mb-6 text-[clamp(28px,4.4vw,42px)] font-medium tracking-tight text-ink">
        Shortsの<span className="highlight-pill">型</span>
        を、毎日追わなくていい
      </h1>
      <p className="mb-12 text-ink-soft">
        Buzz
        Styleは、YouTube
        Shortsで今バズっている動画を個別のランキングではなく「型（フォーマット）」として抽出して見せるツールです。毎日大量のShortsを見続けなくても、今週の勝ちパターンをまとめて把握し、自分のジャンルに当てはめて真似できます。
      </p>

      <section className="mb-12">
        <h2 className="eyebrow mb-4">使い方</h2>
        <ol>
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-line py-5">
              <p className="font-en mb-1 text-xs tabular-nums text-ink-faint">
                STEP {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-2 text-base font-semibold text-ink">
                {step.title}
              </h3>
              <p className="text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="eyebrow mb-4">FAQ</h2>
        <dl>
          {faqs.map((faq) => (
            <div key={faq.q} className="border-t border-line py-5">
              <dt className="mb-2 font-semibold text-ink">{faq.q}</dt>
              <dd className="text-ink-soft">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="section-divider pt-8">
        <Link href="/" className="btn-pill-primary inline-flex">
          型一覧を見る
        </Link>
      </div>
    </div>
  );
}
