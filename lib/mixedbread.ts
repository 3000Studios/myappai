import { Mixedbread } from "@mixedbread/sdk";
import type { Store } from "@mixedbread/sdk/resources/stores/stores.js";

export async function getStores(): Promise<{
  stores: Store[];
  error?: string;
}> {
  if (!process.env.MXBAI_API_KEY) {
    return {
      stores: [],
      error: "No MXBAI_API_KEY environment variable",
    };
  }

  try {
    const client = new Mixedbread({
      apiKey: process.env.MXBAI_API_KEY,
    });

    const response = await client.stores.list();
    const stores: Store[] = [];

    for await (const store of response) {
      stores.push(store);
    }

    return { stores };
  } catch (error) {
    console.error("Error fetching stores:", error);
    return {
      stores: [],
      error: "Failed to connect to Mixedbread API",
    };
  }
}
