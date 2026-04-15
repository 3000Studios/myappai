/**
 * Vercel Deployment Service
 * Handles automatic deployments via Vercel API
 */

import axios from 'axios';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_API = 'https://api.vercel.com';
const PROJECT_NAME = '3000studios-next'; // Update with actual project name
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

// Validation regex for deployment IDs to prevent SSRF
const DEPLOYMENT_ID_REGEX = /^[A-Za-z0-9\-_]{1,64}$/;

function validateDeploymentId(id: string): void {
  if (!id || !DEPLOYMENT_ID_REGEX.test(id)) {
    throw new Error('Invalid deployment ID format');
  }
}

export interface DeploymentResponse {
  id: string;
  url: string;
  readyState: string;
  createdAt: number;
}

export async function triggerDeployment(branch: string = 'main'): Promise<DeploymentResponse> {
  try {
    const response = await axios.post(
      `${VERCEL_API}/v13/deployments`,
      {
        name: PROJECT_NAME,
        gitSource: {
          type: 'github',
          ref: branch,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      id: response.data.id,
      url: response.data.url,
      readyState: response.data.readyState,
      createdAt: response.data.createdAt,
    };
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to trigger deployment');
  }
}

export async function getDeploymentStatus(deploymentId: string): Promise<string> {
  validateDeploymentId(deploymentId);

  try {
    validateDeploymentId(deploymentId);

    const response = await axios.get(`${VERCEL_API}/v13/deployments/${deploymentId}`, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    return response.data.readyState;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to check deployment status');
  }
}

export async function getLatestDeployment(): Promise<DeploymentResponse | null> {
  try {
    if (!PROJECT_ID) {
      throw new Error('VERCEL_PROJECT_ID is required to fetch deployments');
    }

    const response = await axios.get(
      `${VERCEL_API}/v6/deployments?projectId=${PROJECT_NAME}&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    const deployments = response.data.deployments;
    if (deployments && deployments.length > 0) {
      const latest = deployments[0];
      return {
        id: latest.uid,
        url: latest.url,
        readyState: latest.readyState,
        createdAt: latest.createdAt,
      };
    }

    return null;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to get latest deployment');
  }
}

export async function cancelDeployment(deploymentId: string): Promise<void> {
  validateDeploymentId(deploymentId);

  try {
    validateDeploymentId(deploymentId);

    await axios.patch(
      `${VERCEL_API}/v12/deployments/${deploymentId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to cancel deployment');
  }
}

