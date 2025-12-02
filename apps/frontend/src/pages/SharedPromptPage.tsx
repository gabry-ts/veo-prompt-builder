import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, AlertCircle } from 'lucide-react';
import { promptService } from '../services/promptService';
import StarRating from '../components/StarRating';
import LoadingSkeleton from '../components/LoadingSkeleton';

function SharedPromptPage(): JSX.Element {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    data: prompt,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['shared-prompt', token],
    queryFn: () => promptService.getByShareToken(token!),
    enabled: !!token,
  });

  const handleDownload = (): void => {
    if (!prompt) return;
    const blob = new Blob([JSON.stringify(prompt.jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.name || 'prompt'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-xl border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
            <AlertCircle className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Prompt Not Found</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This prompt either doesn't exist or is no longer public.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {prompt.name}
              </h1>
              {prompt.description && (
                <p className="text-gray-600 dark:text-gray-400">{prompt.description}</p>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download JSON
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 items-center">
            {prompt.rating !== null && prompt.rating !== undefined && (
              <div className="flex items-center gap-2">
                <StarRating rating={prompt.rating} onRate={() => {}} />
              </div>
            )}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Created: {new Date(prompt.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* JSON Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">JSON Data</h2>
          <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-auto bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-wrap break-words max-h-96 border border-gray-200 dark:border-gray-700">
            {JSON.stringify(prompt.jsonData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default SharedPromptPage;
