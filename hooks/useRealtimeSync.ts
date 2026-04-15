/**
 * useRealtimeSync Hook
 * React hook for real-time deployment updates
 * Connects to SSE endpoint and provides live deployment status
 */

import { useEffect, useState, useCallback, useRef } from 'react';

export interface DeploymentEvent {
  type: 'commit' | 'deploy_start' | 'deploy_progress' | 'deploy_complete' | 'deploy_error';
  data: {
    commitSha?: string;
    deploymentId?: string;
    status?: string;
    url?: string;
    error?: string;
  };
  timestamp: number;
}

export interface DeploymentStatus {
  isDeploying: boolean;
  status: string;
  progress: number;
  events: DeploymentEvent[];
  latestDeployment?: {
    id: string;
    url: string;
    state: string;
    createdAt: number;
  };
  error?: string;
}

export function useRealtimeSync() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    isDeploying: false,
    status: 'idle',
    progress: 0,
    events: [],
  });
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch current deployment status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/realtime-sync/status');
      const data = await response.json();

      if (data.status === 'success' && data.deployment) {
        setDeploymentStatus((prev) => ({
          ...prev,
          latestDeployment: data.deployment,
        }));
      }
    } catch (error: unknown) {
      console.error("", error);
    }
  }, []);

  // Trigger instant deployment with real-time updates
  const deploy = useCallback(
    async (filePath: string, content: string, commitMessage?: string) => {
      try {
        setDeploymentStatus({
          isDeploying: true,
          status: 'Starting deployment...',
          progress: 0,
          events: [],
        });

        const response = await fetch('/api/realtime-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'single',
            filePath,
            content,
            commitMessage: commitMessage || '🚀 Instant deployment',
          }),
        });

        if (!response.ok) {
          throw new Error('Deployment request failed');
        }

        // Connect to SSE stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response stream');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const eventData = JSON.parse(line.slice(6)) as DeploymentEvent;

              setDeploymentStatus((prev) => {
                const newEvents = [...prev.events, eventData];
                let progress = prev.progress;
                let status = prev.status;

                // Update progress based on event type
                switch (eventData.type) {
                  case 'commit':
                    progress = 25;
                    status = 'Committing to GitHub...';
                    break;
                  case 'deploy_start':
                    progress = 50;
                    status = 'Deploying to Vercel...';
                    break;
                  case 'deploy_progress':
                    progress = 75;
                    status = eventData.data.status || 'Building...';
                    break;
                  case 'deploy_complete':
                    progress = 100;
                    status = '✅ Live on production!';
                    break;
                  case 'deploy_error':
                    progress = 0;
                    status = '❌ Deployment failed';
                    break;
                }

                return {
                  isDeploying:
                    eventData.type !== 'deploy_complete' && eventData.type !== 'deploy_error',
                  status,
                  progress,
                  events: newEvents,
                  error: eventData.type === 'deploy_error' ? eventData.data.error : undefined,
                };
              });
            }
          }
        }

        // Refresh status after deployment
        await fetchStatus();
      } catch (error: unknown) {
        console.error("", error);
        setDeploymentStatus((prev) => ({
          ...prev,
          isDeploying: false,
          status: '❌ Deployment failed',
          error:
            error instanceof Error
              ? error instanceof Error
                ? error instanceof Error
                  ? error.message
                  : 'Unknown error'
                : 'Unknown error'
              : 'Unknown error',
        }));
      }
    },
    [fetchStatus]
  );

  // Batch deploy multiple files
  const batchDeploy = useCallback(
    async (files: Array<{ path: string; content: string }>, commitMessage?: string) => {
      try {
        setDeploymentStatus({
          isDeploying: true,
          status: 'Starting batch deployment...',
          progress: 0,
          events: [],
        });

        const response = await fetch('/api/realtime-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'batch',
            files,
            commitMessage: commitMessage || `🚀 Batch deployment (${files.length} files)`,
          }),
        });

        if (!response.ok) {
          throw new Error('Batch deployment request failed');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response stream');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const eventData = JSON.parse(line.slice(6)) as DeploymentEvent;

              setDeploymentStatus((prev) => {
                const newEvents = [...prev.events, eventData];
                let progress = prev.progress;
                let status = prev.status;

                switch (eventData.type) {
                  case 'commit':
                    progress = 25;
                    status = `Committing ${files.length} files...`;
                    break;
                  case 'deploy_start':
                    progress = 50;
                    status = 'Deploying batch...';
                    break;
                  case 'deploy_progress':
                    progress = 75;
                    status = eventData.data.status || 'Building...';
                    break;
                  case 'deploy_complete':
                    progress = 100;
                    status = `✅ ${files.length} files live!`;
                    break;
                  case 'deploy_error':
                    progress = 0;
                    status = '❌ Batch deployment failed';
                    break;
                }

                return {
                  isDeploying:
                    eventData.type !== 'deploy_complete' && eventData.type !== 'deploy_error',
                  status,
                  progress,
                  events: newEvents,
                  error: eventData.type === 'deploy_error' ? eventData.data.error : undefined,
                };
              });
            }
          }
        }

        await fetchStatus();
      } catch (error: unknown) {
        console.error("", error);
        setDeploymentStatus((prev) => ({
          ...prev,
          isDeploying: false,
          status: '❌ Batch deployment failed',
          error:
            error instanceof Error
              ? error instanceof Error
                ? error instanceof Error
                  ? error.message
                  : 'Unknown error'
                : 'Unknown error'
              : 'Unknown error',
        }));
      }
    },
    [fetchStatus]
  );

  // Load initial status on mount
  useEffect(() => {
    fetchStatus();

    // Poll for status updates every 30 seconds
    const interval = setInterval(fetchStatus, 30000);

    return () => {
      clearInterval(interval);
      const currentEventSource = eventSourceRef.current;
      if (currentEventSource) {
        currentEventSource.close();
      }
    };
  }, [fetchStatus]);

  return {
    deploymentStatus,
    deploy,
    batchDeploy,
    refreshStatus: fetchStatus,
  };
}

