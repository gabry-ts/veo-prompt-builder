interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps): JSX.Element {
  const formatMarkdown = (text: string): string => {
    let formatted = text;

    // Headers
    formatted = formatted.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>',
    );
    formatted = formatted.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>',
    );
    formatted = formatted.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>',
    );

    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>');
    formatted = formatted.replace(/__(.*?)__/gim, '<strong class="font-bold">$1</strong>');

    // Italic
    formatted = formatted.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
    formatted = formatted.replace(/_(.*?)_/gim, '<em class="italic">$1</em>');

    // Links
    formatted = formatted.replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" class="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    // Code inline
    formatted = formatted.replace(
      /`([^`]+)`/gim,
      '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm font-mono">$1</code>',
    );

    // Line breaks
    formatted = formatted.replace(/\n/gim, '<br />');

    return formatted;
  };

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
    />
  );
}

export default MarkdownPreview;
