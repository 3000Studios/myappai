/**
 * Custom Hooks for API Integration
 * Client-side hooks for interacting with backend services
 */

'use client';

import { useState } from 'react';

// Voice-to-Code Hook
export function useVoiceToCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async (prompt: string, action: 'preview' | 'apply' | 'deploy') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/voice-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate code');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transcribeAndGenerate = async (
    audioBase64: string,
    action: 'preview' | 'apply' | 'deploy'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/voice-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: audioBase64, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process audio');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateCode, transcribeAndGenerate, loading, error };
}

// PayPal Checkout Hook
export function usePayPalCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (items: any[], userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const captureOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture order');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, captureOrder, loading, error };
}

// Analytics Hook
export function useAnalytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (timeRange: 'day' | 'week' | 'month' = 'day') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAnalytics, loading, error };
}

// Content Generation Hook
export function useContentGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBlog = async (topic: string, keywords?: string[], publishToWordPress?: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/content/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords, publishToWordPress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate blog post');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateProductDescription = async (
    productName: string,
    features?: string[],
    productId?: string,
    autoSave?: boolean
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/content/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, features, productId, autoSave }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate product description');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateBlog, generateProductDescription, loading, error };
}

// Streaming Hook
export function useStreaming() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async (title: string, description?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/streaming/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamTitle: title, streamDescription: description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start stream');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const stopStream = async (streamId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/streaming/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to stop stream');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStreamStatus = async (streamId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = streamId ? `/api/streaming/status?streamId=${streamId}` : '/api/streaming/status';
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get stream status');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { startStream, stopStream, getStreamStatus, loading, error };
}

// Deployment Hook
export function useDeployment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerDeploy = async (branch?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/deployment/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger deployment');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDeploymentStatus = async (deploymentId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = deploymentId
        ? `/api/deployment/status?deploymentId=${deploymentId}`
        : '/api/deployment/status';
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get deployment status');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { triggerDeploy, getDeploymentStatus, loading, error };
}

// Products Hook
export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? err instanceof Error
              ? err.message
              : 'Unknown error'
            : 'Unknown error'
          : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProducts, loading, error };
}

