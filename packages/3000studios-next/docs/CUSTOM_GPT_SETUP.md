# 🤖 Custom GPT Setup for 3000 Studios Site Management

## Overview

This guide will help you create a Custom GPT in ChatGPT that can update your 3000Studios.com website through voice commands on your phone.

---

## Architecture

```text
Phone (ChatGPT Custom GPT)
        ↓
OpenAI Actions / Webhook
        ↓
Vercel Edge Function (Control Endpoint)
        ↓
Voice API (/api/voice)
        ↓
Site Updates (Auto-commit)
```

---

## Part 1: Create the Custom GPT

### Step 1: Access Custom GPT Builder

1. Open ChatGPT (web or mobile app)
2. Click your profile → "My GPTs"
3. Click "Create a GPT"

### Step 2: Configure GPT Instructions

**Name:**

```text
3000 Studios Site Manager
```

**Description:**

```text
Voice-controlled site management for 3000Studios.com. Updates content, media, styles, and publishes blog posts through natural language commands.
```

**Instructions:**

```text
You are the 3000 Studios Site Manager, an autonomous assistant that translates natural language commands into precise API calls to update the 3000Studios.com website.

## Your Capabilities

You can execute the following commands:

1. **UPDATE_TEXT** - Change text content on pages
2. **ADD_SECTION** - Add new sections to pages
3. **ADD_MEDIA** - Add images, videos, or audio from Pexels or URLs
4. **CHANGE_STYLE** - Modify CSS properties and theme settings
5. **PUBLISH_BLOG** - Create and publish new blog posts

## Command Translation Rules

When the user says something like:
- "Add a truck video to the homepage" → ADD_MEDIA command with Pexels search
- "Change the headline to [text]" → UPDATE_TEXT command
- "Publish a blog about [topic]" → PUBLISH_BLOG command
- "Make the accent color gold" → CHANGE_STYLE command
- "Add a new section about [topic]" → ADD_SECTION command

## Response Format

Always:
1. Confirm what you understood
2. Execute the API call
3. Report the result clearly
4. Suggest related actions if relevant

## Safety Rules

- Never delete content without explicit confirmation
- Always confirm destructive actions
- Preserve existing functionality
- Follow brand guidelines (gold/sapphire/platinum theme)

## Brand Context

3000 Studios is a premium digital media company. The site features:
- Luxury aesthetic (gold, sapphire, platinum accents)
- Video-rich content
- Blog/news section
- Media streaming capabilities
- Voice-controlled interface
```

### Step 3: Configure Conversation Starters

Add these suggested prompts:

```text
1. "Add a cinematic video to the homepage"
2. "Publish a blog post about AI innovation"
3. "Change the theme to dark mode with gold accents"
4. "Add a new section showcasing our services"
```

---

## Part 2: Set Up OpenAI Actions (Webhook)

### Step 1: Create the Control Endpoint

Create a new file: `app/api/gpt-bridge/route.ts`

```typescript
import { NextResponse } from 'next/server';

/**
 * GPT BRIDGE ENDPOINT
 * Receives commands from Custom GPT and forwards to voice API
 */

export async function POST(req: Request) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.GPT_BRIDGE_TOKEN;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Forward to voice API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3000studios.com';
    const voiceApiUrl = `${baseUrl}/api/voice`;

    const response = await fetch(voiceApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GPT Bridge error:', error);
    return NextResponse.json(
      {
        error: 'Bridge failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'GPT Bridge Online',
    version: '1.0.0',
    endpoints: {
      POST: 'Send voice commands from Custom GPT',
    },
  });
}
```

### Step 2: Add Environment Variable

Add to your `.env.local` and Vercel environment variables:

```bash
GPT_BRIDGE_TOKEN=your-secure-random-token-here
```

**Generate a secure token:**

```bash
# Run this in terminal to generate a secure token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Configure OpenAI Actions Schema

In your Custom GPT settings, go to "Actions" and add this schema:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "3000 Studios Site Management API",
    "version": "1.0.0",
    "description": "API for managing 3000Studios.com content through voice commands"
  },
  "servers": [
    {
      "url": "https://3000studios.com/api/gpt-bridge"
    }
  ],
  "paths": {
    "/": {
      "post": {
        "operationId": "executeVoiceCommand",
        "summary": "Execute a voice command to update the site",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "enum": ["UPDATE_TEXT"]
                      },
                      "text": {
                        "type": "string",
                        "description": "The new text content"
                      },
                      "file": {
                        "type": "string",
                        "description": "Target file path (optional)"
                      },
                      "search": {
                        "type": "string",
                        "description": "Text to search for (optional)"
                      },
                      "replace": {
                        "type": "string",
                        "description": "Text to replace with (optional)"
                      }
                    },
                    "required": ["type"]
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "enum": ["ADD_SECTION"]
                      },
                      "title": {
                        "type": "string",
                        "description": "Section title"
                      },
                      "content": {
                        "type": "string",
                        "description": "Section content"
                      },
                      "page": {
                        "type": "string",
                        "description": "Target page (optional)"
                      }
                    },
                    "required": ["type"]
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "enum": ["ADD_MEDIA"]
                      },
                      "url": {
                        "type": "string",
                        "description": "Media URL or search query for Pexels"
                      },
                      "mediaType": {
                        "type": "string",
                        "enum": ["video", "image", "audio"],
                        "description": "Type of media"
                      },
                      "page": {
                        "type": "string",
                        "description": "Target page (optional)"
                      }
                    },
                    "required": ["type", "mediaType"]
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "enum": ["CHANGE_STYLE"]
                      },
                      "property": {
                        "type": "string",
                        "description": "CSS property or theme setting"
                      },
                      "value": {
                        "type": "string",
                        "description": "New value"
                      },
                      "target": {
                        "type": "string",
                        "description": "Target element (optional)"
                      }
                    },
                    "required": ["type", "property", "value"]
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "enum": ["PUBLISH_BLOG"]
                      },
                      "title": {
                        "type": "string",
                        "description": "Blog post title"
                      },
                      "body": {
                        "type": "string",
                        "description": "Blog post content (markdown supported)"
                      },
                      "slug": {
                        "type": "string",
                        "description": "URL slug (optional, auto-generated if not provided)"
                      },
                      "topic": {
                        "type": "string",
                        "description": "Blog topic/category (optional)"
                      }
                    },
                    "required": ["type", "title", "body"]
                  },
                  {
                    "type": "object",
                    "properties": {
                      "transcript": {
                        "type": "string",
                        "description": "Natural language command for parsing"
                      }
                    },
                    "required": ["transcript"]
                  }
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Command executed successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    },
                    "mutationId": {
                      "type": "string"
                    },
                    "result": {
                      "type": "object"
                    }
                  }
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
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer"
      }
    }
  },
  "security": [
    {
      "BearerAuth": []
    }
  ]
}
```

### Step 4: Configure Authentication

In the Custom GPT Actions settings:

1. **Authentication Type:** API Key
2. **Auth Type:** Bearer
3. **API Key:** `[Your GPT_BRIDGE_TOKEN from .env]`

---

## Part 3: Deploy and Test

### Step 1: Deploy the Bridge Endpoint

```bash
# Add the new file to git
git add app/api/gpt-bridge/route.ts

# Commit
git commit -m "Add GPT bridge endpoint for Custom GPT integration"

# Push to deploy
git push origin main
```

### Step 2: Add Environment Variable to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Key:** `GPT_BRIDGE_TOKEN`
   - **Value:** `[Your generated token]`
   - **Environments:** Production, Preview, Development
3. Click "Save"
4. Redeploy if needed

### Step 3: Test the Endpoint

```bash
# Test the bridge endpoint
curl -X POST https://3000studios.com/api/gpt-bridge \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"transcript": "switch to dark theme"}'
```

Expected response:

```json
{
  "success": true,
  "result": {
    "actions": [{ "type": "setTheme", "value": "dark" }],
    "summary": "Switched to dark theme"
  },
  "timestamp": "2026-01-04T06:55:18Z"
}
```

### Step 4: Test with Custom GPT

1. Open your Custom GPT in ChatGPT
2. Try a command: "Add a sunset video to the homepage"
3. The GPT should:
   - Confirm the command
   - Call the API
   - Report success

---

## Part 4: Usage Examples

### Example Commands

**Add Media:**

```text
"Add a cinematic city video to the homepage"
"Put a professional headshot image in the about section"
"Show me a sunset photo"
```

**Update Text:**

```text
"Change the main headline to 'Welcome to 3000 Studios'"
"Update the tagline to 'Innovation Meets Excellence'"
```

**Change Styles:**

```text
"Switch to dark theme with gold accents"
"Make the accent color sapphire"
"Change to light mode"
```

**Publish Blog:**

```text
"Publish a blog post about AI innovation in 2026"
"Write a blog titled 'The Future of Web Development' about Next.js and AI"
```

**Add Sections:**

```text
"Add a new section about our services"
"Create a testimonials section"
```

---

## Security Best Practices

1. **Token Security:**
   - Never commit `GPT_BRIDGE_TOKEN` to git
   - Use a strong, random token (32+ characters)
   - Rotate tokens periodically

2. **Rate Limiting:**
   - Consider adding rate limiting to the bridge endpoint
   - Monitor usage in Vercel Analytics

3. **Logging:**
   - Log all GPT commands for audit trail
   - Monitor for suspicious activity

4. **Validation:**
   - The bridge validates all commands before forwarding
   - Invalid commands are rejected with clear error messages

---

## Troubleshooting

### "Unauthorized" Error

- Check that `GPT_BRIDGE_TOKEN` is set in Vercel
- Verify the token matches in Custom GPT Actions settings
- Ensure you're using `Bearer` authentication

### "Bridge failed" Error

- Check Vercel logs for detailed error
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly
- Test the `/api/voice` endpoint directly

### Commands Not Executing

- Check that the voice API is working: `GET https://3000studios.com/api/voice`
- Verify command format matches schema
- Check browser console for errors

### GPT Not Calling API

- Verify Actions schema is valid JSON
- Check that authentication is configured
- Test the endpoint with curl first

---

## Advanced: Alternative Deployment Options

### Option A: Cloudflare Worker (Faster, Global Edge)

```javascript
// worker.js
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.GPT_BRIDGE_TOKEN}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const response = await fetch('https://3000studios.com/api/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return response;
  },
};
```

Deploy:

```bash
npm install -g wrangler
wrangler login
wrangler secret put GPT_BRIDGE_TOKEN
wrangler publish
```

### Option B: Fly.io (More Control)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Monitoring and Analytics

### Track GPT Usage

Add analytics to the bridge endpoint:

```typescript
// In app/api/gpt-bridge/route.ts
import { track } from '@/lib/analytics';

export async function POST(req: Request) {
  // ... auth code ...

  await track('gpt_command', {
    type: body.type || 'transcript',
    timestamp: new Date().toISOString(),
  });

  // ... rest of code ...
}
```

### View Logs

```bash
# Vercel logs
vercel logs

# Or in Vercel Dashboard → Your Project → Logs
```

---

## Next Steps

1. ✅ Create the Custom GPT
2. ✅ Deploy the bridge endpoint
3. ✅ Configure authentication
4. ✅ Test with sample commands
5. 🚀 Start managing your site by voice!

---

## Support

If you encounter issues:

1. Check Vercel logs
2. Test endpoints with curl
3. Verify environment variables
4. Review OpenAI Actions logs in Custom GPT settings

---

**Last Updated:** 2026-01-04
**Version:** 1.0.0
