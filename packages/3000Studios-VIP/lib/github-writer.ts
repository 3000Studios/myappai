const OWNER = "3000Studios";
const REPO = "3000studios-next";
const BRANCH = "main";

export async function writeToLiveSite({
    path,
    content,
}: {
    path: string;
    content: string;
}) {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
    };

    const existing = await fetch(url, { headers });
    const json = existing.ok ? await existing.json() : null;

    const res = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify({
            message: "VIP Voice Command Update",
            content: Buffer.from(content).toString("base64"),
            sha: json?.sha,
            branch: BRANCH,
        }),
    });

    if (!res.ok) {
        throw new Error(`GitHub write failed: ${await res.text()}`);
    }
}
