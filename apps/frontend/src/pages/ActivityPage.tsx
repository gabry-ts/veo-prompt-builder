import React from 'react';
import { ActivityFeed } from '../components/ActivityFeed';

export const ActivityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Feed</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View your recent activities and changes
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <ActivityFeed />
      </div>
    </div>
  );
};
