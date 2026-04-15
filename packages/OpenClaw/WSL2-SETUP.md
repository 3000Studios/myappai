# OpenClaw on Windows — WSL2 Setup Guide

WSL2 is the **recommended and most stable** path for running OpenClaw on Windows. The native Windows gateway has known port-binding issues. WSL2 runs OpenClaw inside Linux with full compatibility — gateway, CLI, and tooling all work reliably.

---

## Why WSL2?

| | Native Windows | WSL2 |
|---|---|---|
| Gateway stability | ⚠️ Port binding issues | ✅ Stable |
| Systemd service | ⚠️ Scheduled Task (unreliable) | ✅ Native systemd |
| CLI commands | ✅ Works | ✅ Works |
| Headless/always-on | ❌ Requires login | ✅ loginctl linger |
| Recommended | ❌ | ✅ |

---

## Step 1 — Install WSL2 + Ubuntu

Open **PowerShell as Administrator**:

```powershell
wsl --install -d Ubuntu-24.04
```

Check available distros if needed:
```powershell
wsl --list --online
```

**Reboot Windows** when prompted.

---

## Step 2 — Enable systemd (required for gateway service)

Open your Ubuntu WSL terminal and run:

```bash
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF
```

Then shut down WSL from PowerShell:

```powershell
wsl --shutdown
```

Reopen Ubuntu, then verify systemd is running:

```bash
systemctl --user status
```

---

## Step 3 — Install OpenClaw inside WSL

```bash
# Clone the repo
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# Install dependencies
pnpm install

# Build UI (auto-installs UI deps on first run)
pnpm ui:build

# Build OpenClaw
pnpm build

# Run onboarding
openclaw onboard
```

---

## Step 4 — Install the gateway service

```bash
openclaw gateway install
```

This installs OpenClaw as a systemd user service that starts automatically.

Verify it's running:

```bash
systemctl --user status openclaw-gateway.service
```

---

## Step 5 — Keep gateway running without Windows login (headless)

```bash
sudo loginctl enable-linger "$(whoami)"
```

This keeps your user services alive even when no one is logged into Windows — essential for always-on/headless setups.

---

## Step 6 — Auto-start WSL at Windows boot (optional, headless)

From **PowerShell as Administrator**:

```powershell
# Replace "Ubuntu-24.04" with your distro name if different
schtasks /create /tn "WSL Boot" /tr "wsl.exe -d Ubuntu-24.04 --exec /bin/true" /sc onstart /ru SYSTEM
```

Check your distro name:
```powershell
wsl --list --verbose
```

---

## Step 7 — Expose gateway via Cloudflare Tunnel

The WSL gateway runs on `http://127.0.0.1:18789` inside WSL. To expose it externally at `https://openclaw.myappai.net`, you need to either:

### Option A — Run cloudflared inside WSL (simplest)

```bash
# Install cloudflared inside WSL
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/

# Run tunnel
cloudflared tunnel --url http://127.0.0.1:18789
```

### Option B — Windows portproxy + cloudflared on Windows

WSL has its own virtual network. Forward the Windows port to WSL's IP:

```powershell
# Run in PowerShell as Administrator
$Distro = "Ubuntu-24.04"
$ListenPort = 18789
$TargetPort = 18789

$WslIp = (wsl -d $Distro -- hostname -I).Trim().Split(" ")[0]
if (-not $WslIp) { throw "WSL IP not found." }

netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=$ListenPort `
connectaddress=$WslIp connectport=$TargetPort

# Allow through Windows Firewall (one-time)
New-NetFirewallRule -DisplayName "OpenClaw WSL $ListenPort" -Direction Inbound `
-Protocol TCP -LocalPort $ListenPort -Action Allow
```

Then run cloudflared on Windows pointing at `http://127.0.0.1:18789`.

**Note:** WSL IP changes after restarts. Refresh the portproxy rule after each reboot:

```powershell
netsh interface portproxy delete v4tov4 listenport=18789 listenaddress=0.0.0.0 | Out-Null
$WslIp = (wsl -d Ubuntu-24.04 -- hostname -I).Trim().Split(" ")[0]
netsh interface portproxy add v4tov4 listenport=18789 listenaddress=0.0.0.0 `
connectaddress=$WslIp connectport=18789 | Out-Null
```

---

## Verify the full stack

After setup, verify each component:

```bash
# Inside WSL — gateway service running?
systemctl --user is-enabled openclaw-gateway.service
systemctl --user status openclaw-gateway.service --no-pager

# Gateway responding?
curl http://127.0.0.1:18789/

# Ollama running? (if running inside WSL)
curl http://127.0.0.1:11434/api/tags
```

From Windows:
```powershell
# Dashboard accessible?
curl http://127.0.0.1:18789/

# Remote URL working?
curl https://openclaw.myappai.net
```

---

## Ollama — WSL vs Windows

You have two options for Ollama:

### Option A — Ollama on Windows (current setup)
Ollama runs on Windows at `http://127.0.0.1:11434`. From inside WSL, point OpenClaw at the Windows host IP:

```bash
# Get Windows host IP from WSL
cat /etc/resolv.conf | grep nameserver | awk '{print $2}'
```

Set that IP in your OpenClaw config as the Ollama host (e.g. `http://172.x.x.x:11434`).

### Option B — Ollama inside WSL (cleanest)
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve &
ollama pull llama3.2:3b
```

Then OpenClaw can use `http://127.0.0.1:11434` directly — no IP translation needed.

---

## Troubleshooting WSL2

### Gateway service not starting
```bash
journalctl --user -u openclaw-gateway.service -n 50
```

### WSL not starting at boot
Check the scheduled task exists:
```powershell
schtasks /Query /TN "WSL Boot"
```

### Port 18789 not reachable from Windows
The portproxy rule may have stale WSL IP. Re-run the portproxy refresh script above.

### Reset everything and start fresh
```bash
# Inside WSL
systemctl --user stop openclaw-gateway.service
systemctl --user disable openclaw-gateway.service
rm -rf ~/.openclaw
openclaw onboard
openclaw gateway install
```

---

## Quick Reference

| Command | What it does |
|---|---|
| `openclaw gateway install` | Install as systemd service |
| `openclaw gateway run` | Run directly (no service) |
| `openclaw gateway status --json` | Check gateway status |
| `openclaw doctor` | Diagnose and repair |
| `openclaw onboard` | Re-run onboarding |
| `systemctl --user restart openclaw-gateway` | Restart service |
| `journalctl --user -u openclaw-gateway -f` | Live logs |

---

## Links

- Ollama: https://ollama.com
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- WSL2 docs: https://learn.microsoft.com/windows/wsl/install
- OpenClaw dashboard (local): http://127.0.0.1:18789/
- OpenClaw dashboard (remote): https://openclaw.myappai.net
