// Copyright (c) 2025 NAME.
// All rights reserved.

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const vercelToken = process.env.VERCEL_ACCESS_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID || "3000studios-next";

    if (!vercelToken) {
      return NextResponse.json({
        error: "Vercel token not configured",
        deployments: [],
        totalDeployments: 0,
      });
    }

    // Fetch deployments from Vercel API
    const response = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${vercelProjectId}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.statusText}`);
    }

    interface VercelDeployment {
      uid: string;
      url: string;
      state: string;
      created: number;
      creator?: { username?: string };
      target?: string;
    }

    interface VercelDeploymentsResponse {
      deployments: VercelDeployment[];
      pagination?: { count?: number };
    }

    const data: VercelDeploymentsResponse = await response.json();

    const deployments =
      data.deployments?.map((d: VercelDeployment) => ({
        id: d.uid,
        url: d.url,
        state: d.state,
        created: d.created,
        creator: d.creator?.username,
        target: d.target,
      })) || [];

    // Get production deployment
    const productionResponse = await fetch(
      `https://api.vercel.com/v9/projects/${vercelProjectId}`,
      {
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      },
    );

    let productionUrl = null;
    if (productionResponse.ok) {
      const projectData = await productionResponse.json();
      productionUrl =
        projectData.alias?.[0]?.domain || projectData.targets?.production?.url;
    }

    return NextResponse.json({
      deployments,
      totalDeployments: data.pagination?.count || deployments.length,
      productionUrl,
    });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error");
    }
    return NextResponse.json(
      {
        error: message,
        deployments: [],
        totalDeployments: 0,
      },
      { status: 500 },
    );
  }
}

