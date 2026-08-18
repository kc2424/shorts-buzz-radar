interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="font-en text-xs text-ink-faint"
        >
          #{tag}
        </li>
      ))}
    </ul>
  );
}
