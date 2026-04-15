# 📚 Custom GPT Documentation

Complete guide for setting up voice-controlled site management through OpenAI Custom GPT.

---

## 📖 Documentation Files

### 🚀 [Quick Start Guide](./CUSTOM_GPT_QUICKSTART.md)

**Start here!** Step-by-step instructions to get your Custom GPT running in 10 minutes.

- Generate your token
- Add to Vercel
- Create Custom GPT
- Configure Actions
- Test it out

### 📘 [Complete Setup Guide](./CUSTOM_GPT_SETUP.md)

Comprehensive documentation covering:

- Architecture overview
- Detailed setup instructions
- OpenAPI schema explanation
- Security best practices
- Troubleshooting guide
- Alternative deployment options (Cloudflare, Fly.io)
- Monitoring and analytics

### 🔐 [Credentials](./CREDENTIALS.md)

**⚠️ DO NOT COMMIT TO GIT**

Contains your generated `GPT_BRIDGE_TOKEN` and instructions for:

- Vercel environment variables
- Local development setup
- Custom GPT authentication
- Test commands (cURL, PowerShell)

### 📋 [OpenAPI Schema](./openapi-schema.json)

Ready-to-use OpenAPI 3.0 schema for Custom GPT Actions configuration.

Copy-paste this into your Custom GPT's Actions settings.

---

## 🎯 Quick Reference

### Your Endpoints

```
GPT Bridge:  https://3000studios.com/api/gpt-bridge
Voice API:   https://3000studios.com/api/voice
```

### Authentication

```
Authorization: Bearer YOUR_GPT_BRIDGE_TOKEN
```

### Supported Commands

| Command        | Description         | Example                        |
| -------------- | ------------------- | ------------------------------ |
| `UPDATE_TEXT`  | Change text content | "Change headline to 'Welcome'" |
| `ADD_SECTION`  | Add new sections    | "Add a services section"       |
| `ADD_MEDIA`    | Add images/videos   | "Add a sunset video"           |
| `CHANGE_STYLE` | Modify CSS/theme    | "Switch to dark mode"          |
| `PUBLISH_BLOG` | Create blog posts   | "Publish a post about AI"      |

---

## 🧪 Testing

### Test Script

```bash
# Run the automated test suite
node scripts/test-gpt-bridge.js
```

### Manual Test (cURL)

```bash
curl -X POST https://3000studios.com/api/gpt-bridge \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"transcript": "switch to dark theme"}'
```

### Manual Test (PowerShell)

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN"
    "Content-Type" = "application/json"
}
$body = '{"transcript": "switch to dark theme"}' | ConvertFrom-Json | ConvertTo-Json
Invoke-RestMethod -Uri "https://3000studios.com/api/gpt-bridge" -Method Post -Headers $headers -Body $body
```

---

## 📱 Usage Examples

Once your Custom GPT is set up, you can use natural language:

```
✅ "Add a cinematic city video to the homepage"
✅ "Change the main headline to 'Welcome to 3000 Studios'"
✅ "Switch to dark theme with gold accents"
✅ "Publish a blog post about AI innovation in 2026"
✅ "Add a new section showcasing our services"
✅ "Put a professional headshot image in the about section"
```

The Custom GPT will:

1. Understand your intent
2. Convert it to the appropriate API call
3. Execute the command
4. Report the results

---

## 🔒 Security

### Token Management

- ✅ Token is 64 characters (256-bit security)
- ✅ Stored in Vercel environment variables
- ✅ Never committed to git
- ✅ Used with Bearer authentication

### Best Practices

1. **Rotate tokens periodically** (every 90 days recommended)
2. **Monitor usage** in Vercel logs
3. **Use HTTPS only** (enforced)
4. **Validate all commands** (automatic)
5. **Log all actions** (audit trail)

---

## 🐛 Troubleshooting

### Common Issues

| Issue                  | Solution                                     |
| ---------------------- | -------------------------------------------- |
| "Unauthorized" error   | Check token matches in Vercel and Custom GPT |
| "Bridge failed" error  | Check Vercel logs: `vercel logs`             |
| GPT not calling API    | Verify Actions schema is valid JSON          |
| Commands not executing | Test `/api/voice` endpoint directly          |

### Debug Steps

1. **Test the bridge endpoint** with cURL
2. **Check Vercel logs** for errors
3. **Verify environment variables** are set
4. **Validate OpenAPI schema** in Custom GPT
5. **Run test script** for automated diagnostics

---

## 📊 Architecture

```
┌─────────────────────┐
│  Phone (ChatGPT)    │
│  Custom GPT         │
└──────────┬──────────┘
           │
           │ HTTPS + Bearer Token
           ▼
┌─────────────────────┐
│  GPT Bridge         │
│  /api/gpt-bridge    │
│  - Auth check       │
│  - Logging          │
└──────────┬──────────┘
           │
           │ Internal forward
           ▼
┌─────────────────────┐
│  Voice API          │
│  /api/voice         │
│  - Parse command    │
│  - Execute mutation │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Site Updates       │
│  - Content changes  │
│  - Style updates    │
│  - Media additions  │
└─────────────────────┘
```

---

## 🚀 Deployment Checklist

- [ ] Generated secure token
- [ ] Added `GPT_BRIDGE_TOKEN` to Vercel
- [ ] Deployed bridge endpoint (`app/api/gpt-bridge/route.ts`)
- [ ] Created Custom GPT in ChatGPT
- [ ] Configured Custom GPT Instructions
- [ ] Added OpenAPI schema to Actions
- [ ] Configured Bearer authentication
- [ ] Tested with cURL/PowerShell
- [ ] Tested in ChatGPT
- [ ] Verified commands execute correctly

---

## 📞 Support

### Documentation

- **Quick Start:** `CUSTOM_GPT_QUICKSTART.md`
- **Full Guide:** `CUSTOM_GPT_SETUP.md`
- **Credentials:** `CREDENTIALS.md` (not in git)
- **Schema:** `openapi-schema.json`

### Code

- **Bridge Endpoint:** `app/api/gpt-bridge/route.ts`
- **Voice API:** `app/api/voice/route.ts`
- **Voice Router:** `voice/router.ts`
- **Command Types:** `voice/commands.ts`
- **Test Script:** `scripts/test-gpt-bridge.js`

### Logs

```bash
# View Vercel logs
vercel logs

# Or in dashboard
https://vercel.com/dashboard → Your Project → Logs
```

---

## 🎉 You're Ready

Your Custom GPT is now set up to manage your 3000Studios.com website through voice commands on your phone.

**Next steps:**

1. Open ChatGPT on your phone
2. Navigate to your Custom GPT
3. Start talking: "Add a sunset video to the homepage"
4. Watch your site update in real-time!

---

**Last Updated:** 2026-01-04
**Version:** 1.0.0
**Status:** ✅ Production Ready
