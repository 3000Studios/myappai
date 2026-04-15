/**
 * Real-Time Sync Service
 * Handles instant deployment and live updates for Boss Man J
 *
 * Features:
 * - Instant commit to main branch
 * - Real-time deployment triggering
 * - WebSocket notifications
 * - Cache invalidation
 * - Zero-downtime deployments
 */

import { createCommit } from './github';
import { triggerDeployment, getDeploymentStatus } from './vercel';

export interface SyncResult {
  success: boolean;
  commitSha?: string;
  deploymentId?: string;
  deploymentUrl?: string;
  message: string;
  timestamp: number;
}

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

/**
 * Instant sync to production - commits and deploys in one flow
 */
export async function instantSync(
  filePath: string,
  content: string,
  commitMessage: string,
  onProgress?: (event: DeploymentEvent) => void
): Promise<SyncResult> {
  const timestamp = Date.now();

  try {
    // Step 1: Commit to main branch
    onProgress?.({
      type: 'commit',
      data: { status: 'Creating commit...' },
      timestamp: Date.now(),
    });

    const commitSha = await createCommit([
      {
        path: filePath,
        content,
        message: commitMessage,
      },
    ]);

    onProgress?.({
      type: 'commit',
      data: { commitSha, status: 'Commit created' },
      timestamp: Date.now(),
    });

    // Step 2: Trigger instant deployment
    onProgress?.({
      type: 'deploy_start',
      data: { commitSha, status: 'Triggering deployment...' },
      timestamp: Date.now(),
    });

    const deployment = await triggerDeployment('main');

    onProgress?.({
      type: 'deploy_start',
      data: {
        commitSha,
        deploymentId: deployment.id,
        url: deployment.url,
        status: 'Deployment started',
      },
      timestamp: Date.now(),
    });

    // Step 3: Monitor deployment status
    const finalStatus = await monitorDeployment(deployment.id, onProgress);

    if (finalStatus === 'READY') {
      onProgress?.({
        type: 'deploy_complete',
        data: {
          commitSha,
          deploymentId: deployment.id,
          url: deployment.url,
          status: 'Live on production!',
        },
        timestamp: Date.now(),
      });

      return {
        success: true,
        commitSha,
        deploymentId: deployment.id,
        deploymentUrl: `https://${deployment.url}`,
        message: 'Changes deployed successfully and are LIVE!',
        timestamp,
      };
    } else {
      throw new Error(`Deployment failed with status: ${finalStatus}`);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : 'Unknown error';

    onProgress?.({
      type: 'deploy_error',
      data: { error: errorMessage },
      timestamp: Date.now(),
    });

    return {
      success: false,
      message: `Sync failed: ${errorMessage}`,
      timestamp,
    };
  }
}

/**
 * Monitor deployment until complete
 */
async function monitorDeployment(
  deploymentId: string,
  onProgress?: (event: DeploymentEvent) => void,
  maxAttempts: number = 60,
  interval: number = 2000
): Promise<string> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const status = await getDeploymentStatus(deploymentId);

      onProgress?.({
        type: 'deploy_progress',
        data: { deploymentId, status },
        timestamp: Date.now(),
      });

      if (status === 'READY' || status === 'ERROR' || status === 'CANCELED') {
        return status;
      }

      await new Promise<void>((resolve) => setTimeout(resolve, interval));
      attempts++;
    } catch (error: unknown) {
      console.error("", error);
      attempts++;
    }
  }

  return 'TIMEOUT';
}

/**
 * Batch sync multiple files at once
 */
export async function batchSync(
  files: Array<{ path: string; content: string }>,
  commitMessage: string,
  onProgress?: (event: DeploymentEvent) => void
): Promise<SyncResult> {
  const timestamp = Date.now();

  try {
    onProgress?.({
      type: 'commit',
      data: { status: `Creating batch commit for ${files.length} files...` },
      timestamp: Date.now(),
    });

    const commitSha = await createCommit(
      files.map((file) => ({
        path: file.path,
        content: file.content,
        message: commitMessage,
      }))
    );

    onProgress?.({
      type: 'commit',
      data: { commitSha, status: 'Batch commit created' },
      timestamp: Date.now(),
    });

    onProgress?.({
      type: 'deploy_start',
      data: { commitSha, status: 'Triggering deployment...' },
      timestamp: Date.now(),
    });

    const deployment = await triggerDeployment('main');

    onProgress?.({
      type: 'deploy_start',
      data: {
        commitSha,
        deploymentId: deployment.id,
        url: deployment.url,
        status: 'Deployment started',
      },
      timestamp: Date.now(),
    });

    const finalStatus = await monitorDeployment(deployment.id, onProgress);

    if (finalStatus === 'READY') {
      onProgress?.({
        type: 'deploy_complete',
        data: {
          commitSha,
          deploymentId: deployment.id,
          url: deployment.url,
          status: 'All changes LIVE!',
        },
        timestamp: Date.now(),
      });

      return {
        success: true,
        commitSha,
        deploymentId: deployment.id,
        deploymentUrl: `https://${deployment.url}`,
        message: `${files.length} files deployed successfully!`,
        timestamp,
      };
    } else {
      throw new Error(`Deployment failed with status: ${finalStatus}`);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : 'Unknown error';

    onProgress?.({
      type: 'deploy_error',
      data: { error: errorMessage },
      timestamp: Date.now(),
    });

    return {
      success: false,
      message: `Batch sync failed: ${errorMessage}`,
      timestamp,
    };
  }
}

/**
 * Quick commit - commits without deploying
 * Use when you want to batch multiple changes before deploying
 */
export async function quickCommit(
  filePath: string,
  content: string,
  commitMessage: string
): Promise<{ success: boolean; commitSha?: string; message: string }> {
  try {
    const commitSha = await createCommit([
      {
        path: filePath,
        content,
        message: commitMessage,
      },
    ]);

    return {
      success: true,
      commitSha,
      message: 'Committed to main branch',
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : 'Unknown error';
    return {
      success: false,
      message: `Commit failed: ${errorMessage}`,
    };
  }
}

/**
 * Force deploy - triggers deployment without new commits
 * Use to redeploy the current state
 */
export async function forceRedeploy(
  onProgress?: (event: DeploymentEvent) => void
): Promise<SyncResult> {
  const timestamp = Date.now();

  try {
    onProgress?.({
      type: 'deploy_start',
      data: { status: 'Forcing redeployment...' },
      timestamp: Date.now(),
    });

    const deployment = await triggerDeployment('main');

    onProgress?.({
      type: 'deploy_start',
      data: {
        deploymentId: deployment.id,
        url: deployment.url,
        status: 'Redeployment started',
      },
      timestamp: Date.now(),
    });

    const finalStatus = await monitorDeployment(deployment.id, onProgress);

    if (finalStatus === 'READY') {
      onProgress?.({
        type: 'deploy_complete',
        data: {
          deploymentId: deployment.id,
          url: deployment.url,
          status: 'Redeployment complete!',
        },
        timestamp: Date.now(),
      });

      return {
        success: true,
        deploymentId: deployment.id,
        deploymentUrl: `https://${deployment.url}`,
        message: 'Redeployed successfully!',
        timestamp,
      };
    } else {
      throw new Error(`Redeployment failed with status: ${finalStatus}`);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : 'Unknown error';

    onProgress?.({
      type: 'deploy_error',
      data: { error: errorMessage },
      timestamp: Date.now(),
    });

    return {
      success: false,
      message: `Redeployment failed: ${errorMessage}`,
      timestamp,
    };
  }
}

