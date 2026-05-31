import React from 'react';
import { Server, Database, Cpu, HardDrive, Activity, Clock } from 'lucide-react';
import { useSystemHealth, useSystemInfo, useClearCache } from './hooks/useAdminQueries';

export const SystemHealthPage: React.FC = () => {
  const systemHealth = useSystemHealth();
  const systemInfo = useSystemInfo();
  const clearCache = useClearCache();

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear the cache?')) {
      try {
        await clearCache.mutateAsync();
        alert('Cache cleared successfully');
      } catch (error) {
        alert('Failed to clear cache');
      }
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const health = systemHealth.data;
  const info = systemInfo.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
              <p className="text-gray-600 mt-1">Monitor system status and performance</p>
            </div>
            <button
              onClick={handleClearCache}
              disabled={clearCache.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {clearCache.isPending ? 'Clearing...' : 'Clear Cache'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Database Status */}
        {health?.database && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Database</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-3 h-3 rounded-full ${health.database.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="font-semibold text-gray-900 capitalize">{health.database.status}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Database Name</p>
                <p className="font-semibold text-gray-900 mt-1">{health.database.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Host</p>
                <p className="font-semibold text-gray-900 mt-1">{health.database.host}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Ready State</p>
                <p className="font-semibold text-gray-900 mt-1">{health.database.readyState}</p>
              </div>
            </div>
          </div>
        )}

        {/* Server Status */}
        {health?.server && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Server className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Server</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="font-semibold text-gray-900 mt-1">{formatUptime(health.server.uptime)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Node Version</p>
                <p className="font-semibold text-gray-900 mt-1">{health.server.nodeVersion}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Platform</p>
                <p className="font-semibold text-gray-900 mt-1 capitalize">{health.server.platform}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">CPU Cores</p>
                <p className="font-semibold text-gray-900 mt-1">{health.server.cpuCores}</p>
              </div>
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Memory Usage</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-700">Heap Used: {formatBytes(health.server.memoryUsage.heapUsed)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Heap Total: {formatBytes(health.server.memoryUsage.heapTotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">RSS: {formatBytes(health.server.memoryUsage.rss)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Info */}
        {info?.app && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Application</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900 mt-1">{info.app.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Version</p>
                <p className="font-semibold text-gray-900 mt-1">{info.app.version}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="font-semibold text-gray-900 mt-1">{formatUptime(info.app.uptime)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Node & Database Info */}
        {info && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Node Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Node Configuration</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="font-semibold text-gray-900">{info.node.version}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Environment</p>
                  <p className="font-semibold text-gray-900 capitalize">{info.node.env}</p>
                </div>
              </div>
            </div>

            {/* Database Collections */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <HardDrive className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-bold text-gray-900">Database Collections</h2>
              </div>
              <div className="space-y-2">
                {info.database.collections && Object.entries(info.database.collections).map(([name, count]) => (
                  <div key={name} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 capitalize">{name}</span>
                    <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {health?.timestamp && (
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              Last updated: {new Date(health.timestamp).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthPage;
