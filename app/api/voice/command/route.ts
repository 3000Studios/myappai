import { writeToLiveSite } from "@/lib/github-writer";

export async function POST(req: Request) {
    const { command } = await req.json();

    // TEMP: hard proof that the pipeline works
    const content = `
export default function Home() {
  return <h1>Updated by VIP voice: ${command}</h1>;
}
`;

    await writeToLiveSite({
        path: "app/page.tsx",
        content,
    });

    return Response.json({
        ok: true,
        message: "Committed to live site. Vercel deploying.",
    });
}
