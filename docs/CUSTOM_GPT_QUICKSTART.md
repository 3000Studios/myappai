# 🚀 Custom GPT Quick Start

## 1. Generate Your Token

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - this is your `GPT_BRIDGE_TOKEN`

---

## 2. Add to Vercel

1. Go to: <https://vercel.com/dashboard>
2. Select your project
3. Settings → Environment Variables
4. Add:
   - **Name:** `GPT_BRIDGE_TOKEN`
   - **Value:** [paste your token]
   - **Environments:** All (Production, Preview, Development)
5. Save

---

## 3. Create Custom GPT

### Go to: <https://chat.openai.com/gpts/editor>

### Name

```
3000 Studios Site Manager
```

### Instructions

```
You are the 3000 Studios Site Manager. You translate natural language into API calls.

Commands you support:
- UPDATE_TEXT: Change text content
- ADD_SECTION: Add new sections
- ADD_MEDIA: Add images/videos (auto-searches Pexels)
- CHANGE_STYLE: Modify CSS/theme
- PUBLISH_BLOG: Create blog posts

When user says "add a truck video", you call ADD_MEDIA with mediaType: "video" and url: "truck".

Always confirm the command, execute it, and report results clearly.

Brand: Luxury aesthetic, gold/sapphire/platinum theme.
```

### Conversation Starters

```
1. Add a cinematic video to the homepage
2. Publish a blog post about AI innovation
3. Change the theme to dark mode with gold accents
4. Add a new section showcasing our services
```

---

## 4. Configure Actions

In Custom GPT → Configure → Actions:

### Authentication

- **Type:** API Key
- **Auth Type:** Bearer
- **API Key:** [paste your GPT_BRIDGE_TOKEN]

### Schema

Copy the entire OpenAPI schema from `docs/CUSTOM_GPT_SETUP.md` (lines 200-400)

**Quick version:**

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "3000 Studios API",
    "version": "1.0.0"
  },
  "servers": [{ "url": "https://3000studios.com/api/gpt-bridge" }],
  "paths": {
    "/": {
      "post": {
        "operationId": "executeVoiceCommand",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "type": { "type": "string" },
                  "transcript": { "type": "string" }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "BearerAuth": { "type": "http", "scheme": "bearer" }
    }
  },
  "security": [{ "BearerAuth": [] }]
}
```

---

## 5. Test It

### Test the endpoint first

```bash
curl -X POST https://3000studios.com/api/gpt-bridge \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"transcript": "switch to dark theme"}'
```

### Then test in ChatGPT

Open your Custom GPT and say:

```
"Add a sunset video to the homepage"
```

---

## 6. Example Commands

```
✅ "Add a cinematic city video to the homepage"
✅ "Change the main headline to 'Welcome to 3000 Studios'"
✅ "Switch to dark theme with gold accents"
✅ "Publish a blog post about AI innovation"
✅ "Add a new section about our services"
✅ "Put a professional headshot image in the about section"
```

---

## Troubleshooting

### "Unauthorized" error

→ Check token matches in Vercel and Custom GPT

### "Bridge failed" error

→ Check Vercel logs: `vercel logs`

### GPT not calling API

→ Verify Actions schema is valid JSON

---

## Your Credentials

**GPT Bridge Endpoint:**

```
https://3000studios.com/api/gpt-bridge
```

**Voice API Endpoint (internal):**

```
https://3000studios.com/api/voice
```

**Token Location:**

- Vercel: Environment Variables → `GPT_BRIDGE_TOKEN`
- Custom GPT: Actions → Authentication → API Key

**Documentation:**

- Full guide: `docs/CUSTOM_GPT_SETUP.md`
- This quick start: `docs/CUSTOM_GPT_QUICKSTART.md`

---

## Security Checklist

- [ ] Token is 32+ characters
- [ ] Token is in Vercel environment variables
- [ ] Token is NOT in git/code
- [ ] Custom GPT Actions authentication is configured
- [ ] Tested with curl
- [ ] Tested in ChatGPT

---

**Ready to go! 🎉**

Open ChatGPT on your phone, talk to your Custom GPT, and watch your site update in real-time.
