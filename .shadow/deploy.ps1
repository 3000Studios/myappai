& .\.shadow\validate.ps1
npm run build || exit 1
vercel --prod --yes
