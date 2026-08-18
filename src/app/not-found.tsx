import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-main py-20 text-center">
      <p className="eyebrow mb-2">404</p>
      <h1 className="mb-4 text-2xl font-semibold text-ink">
        型が見つかりません
      </h1>
      <p className="mb-8 text-ink-soft">
        指定された型は存在しないか、削除された可能性があります。
      </p>
      <Link href="/" className="btn-pill-primary inline-flex">
        型一覧に戻る
      </Link>
    </div>
  );
}
