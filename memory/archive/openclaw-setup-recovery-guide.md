# 🛠️ OpenClaw Setup Recovery Guide

**Purpose:** Never spend 12 hours on setup again. Clear steps to get OpenClaw running on any device.

---

## 🚨 Emergency Recovery (You're Locked Out)

### MacBook Recovery
```bash
# 1. Check if gateway is running
ps aux | grep gateway

# 2. Restore config from backup  
cp ~/.openclaw/openclaw.json.bak ~/.openclaw/openclaw.json

# 3. Restart gateway
openclaw gateway restart

# 4. Verify token
openclaw status
```

### Surface Book Recovery (Windows)
1. **Get hardware first:** USB-C hub + USB drive for file transfer
2. **Boot from USB:** Use another computer to create Windows recovery media
3. **Access files:** Boot to recovery, access files via command prompt
4. **Reset password:** Use built-in password reset tools

---

## 📋 Complete Setup Checklist

### Phase 1: Core Installation
- [ ] **Install Node.js** (latest LTS version)
- [ ] **Install OpenClaw:** `npm install -g openclaw`  
- [ ] **Verify install:** `openclaw --version`
- [ ] **Initialize:** `openclaw init`

### Phase 2: Configuration  
- [ ] **Set up gateway:** `openclaw gateway start`
- [ ] **Get status:** `openclaw status` (note the gateway token)
- [ ] **Backup config:** `cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak`
- [ ] **Test basic functionality:** `openclaw help`

### Phase 3: File Access Setup
- [ ] **Verify workspace path:** Check `~/.openclaw/workspace` exists
- [ ] **Test file operations:** Create test file, read with OpenClaw
- [ ] **Permission check:** Ensure OpenClaw can read/write all needed directories

### Phase 4: Obsidian Integration  
- [ ] **Install Obsidian Sync** (if using cloud sync)
- [ ] **Verify vault path:** `/Users/iamperris/Local Documents/Main Second Brain (Local)/`
- [ ] **Test vault access:** OpenClaw should be able to read vault files
- [ ] **Sync check:** Ensure sync works across devices

### Phase 5: Mobile Integration
- [ ] **Gateway URL:** Note the gateway URL for mobile access
- [ ] **Test from phone:** Verify can connect to local gateway
- [ ] **Network check:** Ensure devices are on same network/VPN if needed

---

## 🔧 Device-Specific Notes

### MacBook Air (Primary)
- **Config location:** `~/.openclaw/`
- **Workspace:** `~/.openclaw/workspace`  
- **Obsidian vault:** `/Users/iamperris/Local Documents/Main Second Brain (Local)/`
- **Backup strategy:** Time Machine + manual config backups

### Surface Book 2 (Mobile)
- **Goal:** Full OpenClaw + Obsidian access for mobile productivity
- **OS:** Windows 11
- **Sync method:** Obsidian Sync for vault, manual config for OpenClaw
- **Recovery tools:** USB-C hub + Windows recovery USB

### VPS Alternative (If Needed)
- **When to use:** If local setup repeatedly fails
- **Limitation:** Can't access local files (Obsidian vault, personal documents)
- **Best for:** API-only operations, temporary fallbacks
- **Current:** Hetzner VPS ($5/month) - evaluate if still needed after local setup works

---

## ⚡ Quick Fixes

### Gateway Won't Start
```bash
# Kill existing processes
pkill -f gateway

# Clear locks
rm ~/.openclaw/*.lock 2>/dev/null

# Restart fresh
openclaw gateway start
```

### Can't Access Files
```bash
# Check permissions
ls -la ~/.openclaw/
ls -la ~/.openclaw/workspace/

# Fix permissions if needed
chmod -R 755 ~/.openclaw/
```

### Config Corrupted
```bash
# Restore from backup
cp ~/.openclaw/openclaw.json.bak ~/.openclaw/openclaw.json

# If no backup, reinitialize
openclaw init --force
```

---

## 📱 Mobile Setup (The Real Goal)

### What You Want To Achieve
- Use phone to talk to OpenClaw anywhere
- Access all files, notes, and workspace
- Not chained to laptop in room
- Productive from coffee shops, parks, anywhere

### Architecture  
- **Surface Book:** Local OpenClaw gateway running 24/7
- **Phone:** Connects to Surface Book's gateway URL
- **Obsidian:** Synced vault accessible on both devices  
- **Backup:** MacBook as fallback if Surface Book issues

### Network Requirements
- Surface Book connected to stable internet
- Phone can reach Surface Book (same network or VPN)
- Gateway URL accessible from phone's location

---

## 🚫 What NOT To Do (Learned The Hard Way)

### VPS Mistakes
- ❌ **Don't use VPS for file-heavy operations** - can't access local Obsidian vault
- ❌ **Don't move everything to cloud** - defeats purpose of local-first setup
- ✅ **VPS is for API-only fallbacks only**

### Windows Recovery  
- ❌ **Don't try complex fixes without hardware** - need USB-C hub for recovery
- ❌ **Don't panic when locked out** - recovery USB can save everything
- ✅ **Get USB-C hub + recovery drive BEFORE experimenting**

### Config Management
- ❌ **Don't skip backups** - always backup before major changes
- ❌ **Don't edit configs directly** - use openclaw commands when possible  
- ✅ **Backup early, backup often**

---

## 🎯 Success Metrics

### Setup Complete When:
- [ ] OpenClaw status shows gateway running on target device
- [ ] Can execute commands from phone using gateway URL
- [ ] File operations work (read, write, edit workspace files)
- [ ] Obsidian vault accessible and syncing
- [ ] Backup configs exist and are tested

### Mobile Freedom Achieved When:
- [ ] Can capture reflections from phone anywhere
- [ ] Can access and edit all notes remotely
- [ ] Can execute automated tasks without laptop
- [ ] System remains stable for 24+ hours unattended

---

## 📞 Emergency Contacts

If all else fails and you're completely stuck:
1. **OpenClaw Discord:** Community support for technical issues
2. **GitHub Issues:** Bug reports and feature requests
3. **Local backup:** MacBook setup as known-working fallback

---

*Created after the March 1, 2026 Setup Hell incident. Never again.*