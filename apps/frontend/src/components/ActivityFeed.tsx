import React, { useEffect, useState } from 'react';
import { auditService, type AuditLog } from '../services/auditService';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  entityId?: string;
  limit?: number;
}

const getActionIcon = (action: string) => {
  switch (action.toUpperCase()) {
    case 'CREATE':
      return '✨';
    case 'UPDATE':
      return '📝';
    case 'DELETE':
      return '🗑️';
    default:
      return '📌';
  }
};

const getActionColor = (action: string) => {
  switch (action.toUpperCase()) {
    case 'CREATE':
      return 'text-green-600 dark:text-green-400';
    case 'UPDATE':
      return 'text-blue-600 dark:text-blue-400';
    case 'DELETE':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ entityId, limit = 50 }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = entityId
          ? await auditService.getAuditLogsByEntity(entityId)
          : await auditService.getAuditLogs({ limit });

        setLogs(data);
      } catch (err) {
        setError('Failed to load activity feed');
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [entityId, limit]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {logs.map((log) => (
        <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-start space-x-3">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(
                log.action,
              )} bg-gray-100 dark:bg-gray-800`}
            >
              <span className="text-lg">{getActionIcon(log.action)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  <span className={`${getActionColor(log.action)} uppercase font-semibold`}>
                    {log.action}
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{log.entity}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </p>
              </div>
              {log.user && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  by {log.user.name || log.user.email}
                </p>
              )}
              {log.changes && Object.keys(log.changes).length > 0 && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  <details className="cursor-pointer">
                    <summary className="hover:underline">View changes</summary>
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
                      {JSON.stringify(log.changes, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
