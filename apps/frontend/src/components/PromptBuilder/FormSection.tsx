import { useState } from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

function FormSection({
  title,
  children,
  collapsible = true,
  defaultOpen = true,
}: FormSectionProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        {collapsible && (
          <span className="text-gray-500 dark:text-gray-400">
            {isOpen ? '▼' : '▶'}
          </span>
        )}
      </button>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

export default FormSection;
