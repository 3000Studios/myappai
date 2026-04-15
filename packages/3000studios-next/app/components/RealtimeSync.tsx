/**
 * RealtimeSync Component
 * Live deployment status indicator for Boss Man J
 * Shows real-time sync status and deployment progress
 */

'use client';

import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Zap } from 'lucide-react';

export default function RealtimeSync() {
  const { deploymentStatus } = useRealtimeSync();

  return (
    <AnimatePresence>
      {deploymentStatus.isDeploying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="glass-premium border border-gold/30 rounded-xl p-4 shadow-2xl min-w-[320px]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Loader2 className="w-6 h-6 text-gold animate-spin" />
                <Zap className="w-3 h-3 text-yellow-400 absolute top-0 right-0 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-gold font-bold text-sm">🚀 Deploying to Production</h3>
                <p className="text-gray-300 text-xs">{deploymentStatus.status}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-yellow-400"
                initial={{ width: 0 }}
                animate={{ width: `${deploymentStatus.progress}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>

            {/* Events */}
            <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gold scrollbar-track-gray-800">
              {deploymentStatus.events.slice(-5).map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-xs text-gray-400"
                >
                  {event.type === 'deploy_complete' && (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  )}
                  {event.type === 'deploy_error' && <XCircle className="w-3 h-3 text-red-400" />}
                  {(event.type === 'commit' ||
                    event.type === 'deploy_start' ||
                    event.type === 'deploy_progress') && (
                    <div className="w-3 h-3 rounded-full bg-gold/50 animate-pulse" />
                  )}
                  <span>{event.data.status || event.type}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Success notification - auto-hide after 5 seconds */}
      {!deploymentStatus.isDeploying && deploymentStatus.progress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="glass-premium border border-green-500/30 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-green-400 font-bold text-sm">✅ Deployed Successfully!</h3>
                <p className="text-gray-300 text-xs">Changes are LIVE on production</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error notification */}
      {deploymentStatus.error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="glass-premium border border-red-500/30 rounded-xl p-4 shadow-2xl max-w-md">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-red-400 font-bold text-sm">❌ Deployment Failed</h3>
                <p className="text-gray-300 text-xs">{deploymentStatus.error}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Compact version for the Matrix dashboard
 */
export function CompactRealtimeSync() {
  const { deploymentStatus } = useRealtimeSync();

  return (
    <div className="glass border border-gray-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-300">Deployment Status</h4>
        {deploymentStatus.isDeploying && <Loader2 className="w-4 h-4 text-gold animate-spin" />}
        {!deploymentStatus.isDeploying && deploymentStatus.progress === 100 && (
          <CheckCircle className="w-4 h-4 text-green-400" />
        )}
      </div>

      <p className="text-xs text-gray-400 mb-2">{deploymentStatus.status}</p>

      {deploymentStatus.isDeploying && (
        <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-yellow-400"
            animate={{ width: `${deploymentStatus.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {deploymentStatus.latestDeployment && !deploymentStatus.isDeploying && (
        <div className="mt-2 text-xs text-gray-500">
          Last deployed: {new Date(deploymentStatus.latestDeployment.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}

