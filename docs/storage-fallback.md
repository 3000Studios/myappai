# Storage Fallback Plan — campdreamga.com

Firebase Storage is not initialized on the no-cost Spark plan.

Do not enable billing automatically.

Approved no-billing options:
1. Store static site assets in the repo/public folder.
2. Store text metadata in Firestore only.
3. Disable uploads until a storage decision is approved.
4. Prepare Cloudflare R2 only as a draft if free-tier use is acceptable and separately approved.

Never store large binary uploads directly in Firestore.
Never commit user-uploaded private files.
