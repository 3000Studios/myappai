# OpenClaw Troubleshooting Guide

## Common Issues & Fixes

---

### 1. HTTP 500 Error — Missing Feishu/ZaloUser Module

**Symptom:** Gateway runs but returns 500 on all requests. Logs show:
```
Cannot find module '@larksuiteoapi/node-sdk'
```

**Fix:** Disable the Feishu and ZaloUser plugins in `config.yaml`:

```yaml
plugins:
feishu:
  enabled: false
zalouser:
  enabled: false
```

Restart the gateway after saving.

---

### 2. NPM Permission Errors (EPERM)

**Symptom:**
```
EPERM: operation not permitted, unlink ...
```

**Cause:** Windows file handles are stuck on node_modules. OpenClaw reinstall loops make this worse.

**Fix (run as Administrator):**

```powershell
taskkill /F /IM node.exe 2>$null
taskkill /F /IM openclaw.exe 2>$null
Start-Sleep -Seconds 2

Remove-Item -Recurse -Force "$env:APPDATA
pm
ode_modules\openclaw" -ErrorAction SilentlyContinue
npm cache clean --force
npm install -g openclaw@latest
```

---

### 3. Gateway Process Running But Port 18789 Not Listening

**Symptom:** `netstat` shows no LISTENING on 18789. `curl http://127.0.0.1:18789` returns connection refused.

**Diagnose:**

```powershell
# Check port status
netstat -ano | findstr :18789

# Run with debug output
openclaw gateway start --debug
```

**Common causes:**
- Another process grabbed port 18789 — kill it with `taskkill /F /PID <PID>`
- Config error preventing bind — check debug output
- Daemon service conflict — stop the scheduled task and start manually

**Stop the daemon and start manually:**

```powershell
# Stop scheduled task
schtasks /End /TN "OpenClaw Gateway"

# Start manually with debug
openclaw gateway start --debug
```

---

### 4. Wrong Start Command

**Wrong:**
```powershell
openclaw gateway --port 18789   # ❌ this does nothing
```

**Correct:**
```powershell
openclaw gateway start          # ✅
```

---

### 5. Ollama Not Responding

**Check Ollama is running:**

```powershell
curl http://127.0.0.1:11434/api/tags
```

**Pull the recommended model:**

```powershell
ollama pull llama3.2:3b
```

**Restart Ollama if needed:**

```powershell
taskkill /F /IM ollama.exe 2>$null
Start-Sleep -Seconds 2
ollama serve
```

---

### 6. Cloudflare Tunnel Not Connecting

**Check tunnel status:**

```powershell
cloudflared tunnel info
```

**Restart tunnel:**

```powershell
cloudflared tunnel --url http://127.0.0.1:18789
```

Make sure OpenClaw gateway is running on 18789 BEFORE starting the tunnel.

---

### 7. Security Warnings on Startup

These warnings are expected in dev mode:

- `Small model without sandboxing` — use a larger model or enable sandboxing in config
- `Insecure auth enabled` — set `auth.insecure: false` and add a real API key
- `Unpinned plugin specs` — pin plugin versions in config for production

---

## Debug Checklist

Run through this in order:

- [ ] Ollama running? `curl http://127.0.0.1:11434/api/tags`
- [ ] OpenClaw installed? `openclaw --version`
- [ ] Gateway started with correct command? `openclaw gateway start`
- [ ] Port 18789 listening? `netstat -ano | findstr :18789`
- [ ] Feishu/ZaloUser disabled in config?
- [ ] No EPERM errors? (run as Administrator if so)
- [ ] Cloudflare tunnel running? `cloudflared tunnel info`
- [ ] Dashboard accessible locally? `http://127.0.0.1:18789/`

---

## Logs Location

```
%APPDATA%\openclaw\logs\
```

Check `gateway.log` for startup errors.
