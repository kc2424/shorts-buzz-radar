"use client";

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  async function handleShare() {
    const url = window.location.href;
    const text = `${title} | Buzz Style`;

    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }

    await navigator.clipboard.writeText(url);
  }

  return (
    <button type="button" onClick={handleShare} className="btn-pill-outline">
      共有
    </button>
  );
}
