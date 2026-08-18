import type { Kata, PeriodMeta } from "./types";
import { enrichSample } from "./youtube";
import { videoFromPool } from "./sample-videos";

function makeSamples(seed: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const video = videoFromPool(seed, i);
    return enrichSample({
      id: video.id,
      title: video.title,
      thumbnailUrl: "",
      views: video.views,
      channelName: video.channelName,
      seed,
      offset: i,
    });
  });
}

export const periodMeta: Record<string, PeriodMeta> = {
  week: { label: "今週", updatedAt: "2026-08-19 06:00 JST" },
  today: { label: "今日", updatedAt: "2026-08-19 06:00 JST" },
  "24h": { label: "24h", updatedAt: "2026-08-19 06:00 JST" },
};

export const mockKatas: Kata[] = [
  {
    id: "1",
    slug: "before-after-transformation",
    rank: 1,
    title: "Before/After 一瞬変身型",
    tags: ["ビフォーアフター", "15秒", "テロップ大"],
    stats: { videoCount: 847, avgViews: 2_400_000, growthRate: 312 },
    mimicPoints: [
      "冒頭0.5秒で「Before」を見せ、3秒以内にAfterをドンと出す",
      "変身の瞬間にSE（キラッ）を入れる",
      "テロップは「〇〇が変わった」系の1行のみ",
    ],
    description:
      "ビフォーアフターの落差を最短で見せる型。サムネはBefore側を大きく、Afterは小さく切り取って「続きが気になる」構図が多い。",
    checklist: [
      "Before状態を冒頭1秒以内に提示する",
      "変身ポイントを1つに絞る（複数は伸びにくい）",
      "Afterの結果を数字やビジュアルで示す",
      "15秒以内に収める",
      "BGMはテンポ120BPM前後の明るい系",
    ],
    samples: makeSamples(1, 6),
    genreBreakdown: [
      { genre: "美容・コスメ", percentage: 34 },
      { genre: "ダイエット", percentage: 28 },
      { genre: "インテリア", percentage: 18 },
      { genre: "その他", percentage: 20 },
    ],
    relatedSlugs: ["countdown-reveal", "split-screen-compare"],
  },
  {
    id: "2",
    slug: "countdown-reveal",
    rank: 2,
    title: "3秒カウント→ドンと公開型",
    tags: ["カウントダウン", "サスペンス", "SE重視"],
    stats: { videoCount: 612, avgViews: 1_850_000, growthRate: 248 },
    mimicPoints: [
      "3→2→1のカウント中は画面を暗くor ぼかす",
      "「1」の瞬間にメインコンテンツを全画面表示",
      "カウント中のSEはティック音（1秒間隔）",
    ],
    description:
      "カウントダウンで期待感を作り、最後に一気に答えを見せる型。クイズ・開封・結果発表系で特に伸びやすい。",
    checklist: [
      "カウントは3秒以内（長いと離脱）",
      "最後の1秒で画面を明るくする",
      "答え/結果はテロップ+音声の両方で伝える",
      "サムネに「?」や数字を入れる",
    ],
    samples: makeSamples(2, 5),
    genreBreakdown: [
      { genre: "エンタメ", percentage: 42 },
      { genre: "ゲーム", percentage: 25 },
      { genre: "料理", percentage: 15 },
      { genre: "その他", percentage: 18 },
    ],
    relatedSlugs: ["before-after-transformation", "text-hook-scroll"],
  },
  {
    id: "3",
    slug: "text-hook-scroll",
    rank: 3,
    title: "テロップ先出し→スクロール解説型",
    tags: ["テロップ", "リスト", "情報系"],
    stats: { videoCount: 534, avgViews: 1_620_000, growthRate: 195 },
    mimicPoints: [
      "冒頭テロップで結論/フックを先に出す",
      "縦スクロールで項目を1つずつ見せる",
      "各項目は2〜3秒、合計15秒以内",
    ],
    description:
      "結論先出しのテロップで離脱を防ぎ、縦スクロールで情報を畳み込む型。How-to・ランキング・Tips系に強い。",
    checklist: [
      "1行目のテロップで「得られるもの」を明示",
      "項目数は3〜5個に絞る",
      "各項目に番号を付ける",
      "背景は単色または薄いテクスチャ",
    ],
    samples: makeSamples(3, 5),
    genreBreakdown: [
      { genre: "ビジネス", percentage: 31 },
      { genre: "ライフハック", percentage: 29 },
      { genre: "教育", percentage: 22 },
      { genre: "その他", percentage: 18 },
    ],
    relatedSlugs: ["countdown-reveal", "split-screen-compare"],
  },
  {
    id: "4",
    slug: "split-screen-compare",
    rank: 4,
    title: "左右分割・比較検証型",
    tags: ["比較", "検証", "左右分割"],
    stats: { videoCount: 489, avgViews: 1_410_000, growthRate: 178 },
    mimicPoints: [
      "画面を左右に分割し、A vs B を同時表示",
      "中央にVSまたは矢印を配置",
      "結果は最後3秒で勝者を明示",
    ],
    description:
      "2つの選択肢・商品・方法を並べて比較する型。サムネは左右分割が多く、どちらが正解か気になる構図。",
    checklist: [
      "比較対象は2つに限定",
      "左=一般的、右=新しい/優れている、の配置が多い",
      "結果は数字やチェックマークで示す",
      "15秒で完結させる",
    ],
    samples: makeSamples(4, 4),
    genreBreakdown: [
      { genre: "ガジェット", percentage: 36 },
      { genre: "料理", percentage: 24 },
      { genre: "美容", percentage: 20 },
      { genre: "その他", percentage: 20 },
    ],
    relatedSlugs: ["before-after-transformation", "reaction-face-cam"],
  },
  {
    id: "5",
    slug: "reaction-face-cam",
    rank: 5,
    title: "顔出しリアクション→本編型",
    tags: ["顔出し", "リアクション", "PIP"],
    stats: { videoCount: 421, avgViews: 1_280_000, growthRate: 162 },
    mimicPoints: [
      "左上or右下に顔出しカメラ（PIP）",
      "本編コンテンツをメイン画面に",
      "リアクションの瞬間にテロップで感情を補足",
    ],
    description:
      "顔出しのリアクションを添えて本編を見せる型。エンタメ・レビュー・開封系で定番。",
    checklist: [
      "PIPは画面の1/4以下",
      "リアクションは本編のハイライトに合わせる",
      "表情は大げさめに",
      "本編が15秒以内に収まるよう編集",
    ],
    samples: makeSamples(5, 4),
    genreBreakdown: [
      { genre: "エンタメ", percentage: 45 },
      { genre: "レビュー", percentage: 30 },
      { genre: "Vlog", percentage: 15 },
      { genre: "その他", percentage: 10 },
    ],
    relatedSlugs: ["split-screen-compare", "silent-aesthetic"],
  },
  {
    id: "6",
    slug: "silent-aesthetic",
    rank: 6,
    title: "無音・ASMR系ビジュアル型",
    tags: ["無音", "ASMR", "美的"],
    stats: { videoCount: 398, avgViews: 1_150_000, growthRate: 148 },
    mimicPoints: [
      "BGM・ナレーションなし、環境音のみ",
      "スローモーションまたはタイムラプス",
      "画面中央に被写体、余白多め",
    ],
    description:
      "音を最小限にし、ビジュアルの美しさで見せる型。料理・クラフト・自然系で伸びやすい。",
    checklist: [
      "1カット3秒以上の長めカット",
      "色味は暖色またはパステル",
      "テロップは最小限（またはなし）",
      "ループ再生を意識した構成",
    ],
    samples: makeSamples(6, 4),
    genreBreakdown: [
      { genre: "料理", percentage: 38 },
      { genre: "クラフト", percentage: 28 },
      { genre: "自然", percentage: 22 },
      { genre: "その他", percentage: 12 },
    ],
    relatedSlugs: ["reaction-face-cam", "text-hook-scroll"],
  },
  {
    id: "7",
    slug: "question-answer-flip",
    rank: 7,
    title: "質問テロップ→即答え型",
    tags: ["Q&A", "テロップ", "知識"],
    stats: { videoCount: 356, avgViews: 980_000, growthRate: 134 },
    mimicPoints: [
      "冒頭1秒で疑問形テロップ",
      "2秒目から答えをテロップ+音声で",
      "答えは1つに絞る",
    ],
    description: "視聴者の疑問を代弁し、即座に答える型。豆知識・FAQ系。",
    checklist: [
      "質問は「なぜ？」「どうして？」形式",
      "答えは3秒以内に出す",
      "意外性のある答えが伸びやすい",
    ],
    samples: makeSamples(7, 3),
    genreBreakdown: [
      { genre: "教育", percentage: 40 },
      { genre: "ライフハック", percentage: 35 },
      { genre: "その他", percentage: 25 },
    ],
    relatedSlugs: ["text-hook-scroll", "countdown-reveal"],
  },
  {
    id: "8",
    slug: "speed-run-tutorial",
    rank: 8,
    title: "倍速チュートリアル型",
    tags: ["倍速", "How-to", "実演"],
    stats: { videoCount: 312, avgViews: 890_000, growthRate: 121 },
    mimicPoints: [
      "1.5〜2倍速で手順を見せる",
      "各ステップに番号テロップ",
      "最後に完成品を静止画で2秒",
    ],
    description: "手順を倍速で畳み、短時間で「できる感」を見せる型。",
    checklist: [
      "ステップ数は5以内",
      "手元または画面録画が中心",
      "完成品は必ず最後に見せる",
    ],
    samples: makeSamples(8, 3),
    genreBreakdown: [
      { genre: "DIY", percentage: 32 },
      { genre: "料理", percentage: 30 },
      { genre: "IT", percentage: 22 },
      { genre: "その他", percentage: 16 },
    ],
    relatedSlugs: ["text-hook-scroll", "silent-aesthetic"],
  },
  {
    id: "9",
    slug: "meme-template-overlay",
    rank: 9,
    title: "ミームテンプレ被せ型",
    tags: ["ミーム", "テンプレ", "エンタメ"],
    stats: { videoCount: 287, avgViews: 820_000, growthRate: 108 },
    mimicPoints: [
      "流行中のミームテンプレに自コンテンツを被せる",
      "テロップはミームの流儀に合わせる",
      "オリジナル要素を1箇所入れる",
    ],
    description: "既存ミームの型に乗っかる型。拡散力が高いが寿命は短い。",
    checklist: [
      "最新のミームを1週間以内にキャッチ",
      "ジャンル転用で差別化",
      "著作権・規約に注意",
    ],
    samples: makeSamples(9, 3),
    genreBreakdown: [
      { genre: "エンタメ", percentage: 55 },
      { genre: "ゲーム", percentage: 25 },
      { genre: "その他", percentage: 20 },
    ],
    relatedSlugs: ["reaction-face-cam", "question-answer-flip"],
  },
  {
    id: "10",
    slug: "day-in-life-montage",
    rank: 10,
    title: "1日密着モンタージュ型",
    tags: ["Vlog", "モンタージュ", "BGM"],
    stats: { videoCount: 245, avgViews: 750_000, growthRate: 95 },
    mimicPoints: [
      "朝→昼→夜の3カット以上",
      "各カット2〜3秒、BGMで統一",
      "最後に「今日もお疲れ様」系テロップ",
    ],
    description: "1日のハイライトを短く切り取る型。共感・ lifestyle系。",
    checklist: [
      "時間帯の変化がわかる",
      "BGMはトレンド音源を使用",
      "テロップは日付または曜日",
    ],
    samples: makeSamples(10, 3),
    genreBreakdown: [
      { genre: "Vlog", percentage: 48 },
      { genre: "ビジネス", percentage: 22 },
      { genre: "学生", percentage: 18 },
      { genre: "その他", percentage: 12 },
    ],
    relatedSlugs: ["silent-aesthetic", "reaction-face-cam"],
  },
];

export function getMockKataBySlug(slug: string): Kata | undefined {
  return mockKatas.find((k) => k.slug === slug);
}

export function getMockRelatedKatas(slugs: string[]): Kata[] {
  return slugs
    .map((slug) => getMockKataBySlug(slug))
    .filter((k): k is Kata => k !== undefined);
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M`;
  }
  if (views >= 1_000) {
    return `${Math.round(views / 1_000)}K`;
  }
  return views.toString();
}

export function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}
