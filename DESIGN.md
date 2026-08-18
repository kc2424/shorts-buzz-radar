# Buzz Style — Design Reference

実装ハンドオフ用のデザイン仕様書。Cursor / Codex 等でそのままコーディングに使う想定。

**Theme:** light（意図的にライト一本。ダーク対応は行わない）
**参照元:** [Seline Analytics](https://styles.refero.design/style/7967c6d9-e50c-42b5-b4d1-74003ba41781)（Refero Styles）をベースに、JP対応・型図鑑コンテンツ向けに調整。

紙のような暖色の余白に、水色1色だけを差し色として使う、罫線構造のエディトリアル分析画面。カード状の影付きボックスは使わない。

---

## Color Palette

### Brand / Accent（差し色は以下1系統のみ。他の色を追加しない）

| Token | Hex | 用途 |
|---|---|---|
| `--accent` | `#3BA6F1` | プライマリCTA塗り、アクティブ状態、伸び率(+%)の数値 |
| `--accent-ink` | `#2C82C9` | リンク文字、アウトラインボタンのホバー文字色 |
| `--accent-wash` | `#C1E1F7` | 見出し内ハイライトのpill背景（1見出しにつき最大1箇所） |

### Neutrals

| Token | Hex | 用途 |
|---|---|---|
| `--canvas` | `#FAFAF9` | ページ背景。紙のような暖色オフホワイト。**`#FFFFFF`をページ背景に使わない** |
| `--surface` | `#FFFFFF` | サムネ画像などメディア面の下地のみ。汎用カード背景としては使わない |
| `--ink` | `#0C0A09` | 見出し、強調テキスト |
| `--ink-soft` | `#57534E` | 本文 |
| `--ink-faint` | `#A8A29E` | 補助テキスト、ラベル、無効状態 |
| `--line` | `#E8E6E5` | 罫線（構造化の主手段） |
| `--line-strong` | `#D6D3D1` | セクション区切りの罫線、強調ボーダー |

---

## Typography

JP本文は日本語フォールバック込みのシステムスタックを使用（Web CDN読み込みなし）。実装時は `next/font` で `Inter` を正式ロードし、Latin/数字部分に適用する。

```css
--font-jp: -apple-system, "Hiragino Kaku Gothic ProN", "Hiragino Sans",
           "BIZ UDPGothic", "Yu Gothic UI", "Meiryo", "Segoe UI", sans-serif;
--font-en: "Inter", -apple-system, "Segoe UI", Roboto, sans-serif; /* 数字・英字・ラベル用 */
```

| 用途 | サイズ | Weight | Letter-spacing | フォント |
|---|---|---|---|---|
| H1（トップ見出し） | clamp(28px, 4.4vw, 42px) | 500 | -0.02em | font-jp |
| H2（型名・記事見出し） | clamp(26px, 3.2vw, 36px) | 600 | -0.02em | font-jp |
| 型リストのタイトル | 17px | 600 | -0.005em | font-jp |
| 本文 | 14.5px | 400 | 標準 | font-jp, line-height 1.85 |
| 統計の数値 | 25–26px | 600 | -0.02em | font-en, `font-variant-numeric: tabular-nums` |
| ラベル/eyebrow | 11–12px | 600–700 | 0.06–0.08em, uppercase | font-en |
| タグ | 12px | 400 | 標準 | font-en |

**見出しの水色ハイライト**：H1やAboutページ見出しの中で、キーワード1箇所だけを `--accent-wash` 背景 + `--accent-ink` 文字色のpill（`border-radius: 6px; padding: 2px 10px 4px;`）で囲む。1見出しにつき最大1回。多用しない。

---

## Spacing & Shape

| Token | Value | 用途 |
|---|---|---|
| `--radius-sm` | 6px | アイコン、小さい要素 |
| `--radius-md` | 10px | サムネイル画像、入力欄 |
| `--radius-lg` | 18px | 使用頻度低（大きな装飾ブロックが必要な場合のみ） |
| ボタン | 9999px（完全ピル型） | 全てのボタン |

**Elevation（影）**: 使用しない。影の代わりに `1px solid var(--line)` の罫線で構造を作る。画像サムネイルにも影ではなく1pxボーダーのみ。

---

## Components

### Header / Nav
- `border-bottom: 1px solid var(--line)`、背景は `--canvas` と同色（面を分けない）
- ロゴ：ドット（`--accent`、9px、影なし）＋ ブランド名（font-en, 600, -0.01em）
- 期間フィルタ（今週/今日/24h）：ピル型ボタン。非アクティブ＝アウトライン、アクティブ＝`--accent`塗り+白文字

### Lead Story（トップ#1）
- カード枠なし。`border-top: 1px solid var(--line-strong)` のみで区切る
- 統計3項目は横並びflex、区切りは下線1本（`border-bottom: 1px solid var(--line)`）のみ
- サンプル画像は非対称配置（1枚大＋2枚小）、各画像に `1px solid var(--line)` + `radius-md`
- 「真似ポイント」は `border-left: 2px solid var(--accent)` のみ、背景色なし

### Ranked List（#2〜#10）
- グリッドカードではなく、`1px solid var(--line)` の下線で区切る横長行（`kata-row`）
- 各行：順位（font-en, tabular-nums）／タイトル+タグ／右端にミニサムネ3枚+統計
- ホバー時：タイトル文字色のみ `--accent-ink` に変化。背景色や影は変化させない

### 型詳細ページ
- パンくず → タイトル+共有ボタン(ピル型アウトライン) → タグ → 統計(下線区切り) → 特徴文（アクセントボーダーのみ） → チェックリスト（各項目を上罫線で区切る、カード化しない） → サンプル動画グリッド（画像は1pxボーダーのみ、影なし）
- サイドバー：ジャンル内訳の横棒グラフ（トラック色`--line`、塗り`--accent`）、関連する型リスト（罫線区切り）。**サイドバーも背景ボックス化しない**

### About ページ
- 使い方3ステップ、FAQ、いずれも罫線区切りリスト。カード化しない

---

## Guidelines

1. 構造化の手段は**1pxの罫線のみ**。影・グラデーション・グラスモーフィズムは使わない
2. 差し色は`--accent`系1色のみ。新しいアクセントカラーを追加しない
3. ページ背景は必ず `--canvas`(#FAFAF9)。`#FFFFFF` はサムネ画像などメディア面の下地にのみ使う
4. ボタンは常に完全ピル型（9999px）
5. 見出し内の水色ハイライトpillは1見出しにつき最大1箇所
6. 数字・統計は `--font-en` + `tabular-nums` で桁を揃える
7. カード状のUI（背景色+枠線+角丸+padding で囲うブロック）は極力使わない。リスト・罫線・余白で階層を表現する

## Don't

- ダッシュボードKPIタイル風の影付きカードグリッドを作らない（過去に一度作って却下された経緯あり）
- ネオン・グロー効果、暗い背景を使わない（旧デザイン案から意図的に転換済み）
- モノスペースフォントを多用しない（データの桁揃えは `tabular-nums` で十分）
- 罫線の色を`--line`と`--line-strong`以外に増やさない

---

## レスポンシブ

- ブレークポイント：900px（レイアウト2カラム→1カラム）、560〜640px（モバイル最適化）
- モバイルではミニサムネ（`mini-thumbs`）を非表示にして情報量を絞る
- コンテナ最大幅：1160px

---

## 参照ワイヤーフレーム（Artifact）

- トップページ: https://claude.ai/code/artifact/d6834373-1818-439c-ad22-4f2cbb579e12
- 型詳細ページ + About: https://claude.ai/code/artifact/074889d0-92e7-4e4b-9d86-724edd817733

上記2つのArtifactのHTML/CSSがそのままトークン・コンポーネント仕様の実例。Cursor/Codexにこのファイルと合わせて渡すこと。
