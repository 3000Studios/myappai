Project: myappai

Commands:

install:
npm install

dev:
npm run dev

build:
npm run build

test:
npm test

lint:
npm run lint

pages deploy:
npm run pages:deploy

Optional environment variables:
NODE_ENV=development
PYTHONUNBUFFERED=1
AI_PROJECT_NAME=myappai

Secrets loading order for local repo work:

1. `.secrets/myappai.local.env`
2. `.secrets/shared.local.env`
3. `.env.local`
4. `.env`
5. `.dev.vars.local`
6. `.dev.vars`
