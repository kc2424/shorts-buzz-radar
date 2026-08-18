# Buzz Style

YouTube Shortsで今バズっている動画を、個別のランキングではなく**「型（フォーマット）」として抽出**して見せるツール。

毎日Shortsを追えないクリエイターが、今週の勝ちパターンをまとめて把握し、自分のジャンルに当てはめて真似できるようにする。

## コアバリュー

「動画を1本ずつ見なくても、今バズってる"型"がわかる」

競合（Social Blade / vidIQ / Playboard 等）はいずれも数値の可視化・ランキング止まりで、「動画の構成パターンを型として抽出する」切り口は空席。

## MVP スコープ

- 対象プラットフォーム：YouTube Shorts のみ（TikTok / Reels は Phase 2）
- 画面：トップ（今週の型一覧）/ 型詳細 / About の3画面
- 登録不要・完全無料
- 型の抽出範囲：構成パターン・トピック/テーマ・見た目の共通点（編集テンポ等の動画内部の型は対象外、メタデータ+サムネで判断できる範囲）

## 想定スタック

- Next.js 15（App Router）
- Cloudflare Pages + Workers
- Cloudflare D1（DB）
- Cloudflare Cron Triggers（1時間ごとにYouTube APIポーリング）
- Cloudflare R2（サムネ画像キャッシュ）
- Google Gemini 2.5 Flash（型分析・分類）
- YouTube Data API v3（公式・無料枠）

予算上限：月 〜¥5,000 / 納期目安：10日以内（MVP）

## 状態

- [x] 要件定義
- [x] 構成設計（サイトマップ・ワイヤーフレーム・CTA設計）
- [x] デザイン（トンマナ確定・キービジュアル承認）
- [ ] DBスキーマ確定
- [ ] YouTube API接続・ポーリング実装
- [ ] Gemini分析パイプライン実装
- [ ] フロントエンド実装（Cursor/Codexで実施予定）
- [ ] テスト
- [ ] 納品（公開）

## 関連ドキュメント

- [DESIGN.md](./DESIGN.md) — デザイントークン・コンポーネント仕様（実装ハンドオフ用）
- [CONTEXT.md](./CONTEXT.md) — 企画の背景・決定履歴

## Phase 2 以降（保留中の構想）

- TikTok / Instagram Reels 展開
- バズ予測（投稿直後の動画の伸びしろスコアリング）
- 既存の「バズ音源可視化ツール」との連携
- 週次レポートのX自動投稿
- モバイルアプリ
- 有料プラン
