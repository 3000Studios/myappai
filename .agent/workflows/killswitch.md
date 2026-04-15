---
description: Emergency hard-stop workflow that immediately freezes all autonomous execution, deployments, mutations, and monetization changes while preserving current production state.
---

# KILLSWITCH — EMERGENCY HARD STOP

## PURPOSE

This workflow immediately halts all autonomous operations when activated.
Use when:

- Critical production issue detected
- Unauthorized changes occurring
- System stability compromised
- User explicitly requests full stop

## IMMEDIATE ACTIONS

1. **STOP ALL PENDING OPERATIONS**
   - Cancel any running builds
   - Halt any in-progress deployments
   - Stop all file mutations

2. **PRESERVE CURRENT STATE**
   - Do NOT commit any pending changes
   - Do NOT push to remote
   - Do NOT modify production

3. **LOG FREEZE EVENT**
   - Write freeze timestamp to `.freeze-log.txt`
   - Document reason for freeze if provided

4. **NOTIFY**
   - Report freeze status to user
   - List any operations that were cancelled

## RECOVERY

To resume autonomous operations after killswitch:

1. User must explicitly confirm safe to proceed
2. Run `/globalworkflow` to resume normal operations
3. Delete `.freeze-log.txt` to clear freeze state

## RETURN

Return immediately with:

```
{
  "status": "FROZEN",
  "timestamp": "<current_time>",
  "message": "All autonomous operations halted. Manual review required."
}
```
