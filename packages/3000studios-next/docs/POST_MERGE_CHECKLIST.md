# POST-MERGE AUTOMATION CHECKLIST — 3000STUDIOS

This checklist MUST be satisfied after every merge to `main`.

---

## 🔁 SYSTEM HEALTH

- [ ] CI green
- [ ] Build passes
- [ ] No runtime errors
- [ ] No debug logs in production

---

## 💰 REVENUE VERIFICATION

- [ ] ads.txt reachable
- [ ] AdSense script present in HTML
- [ ] Stripe checkout creates session
- [ ] No environment variable missing errors

---

## 🔐 SECURITY

- [ ] CSP headers intact
- [ ] No exposed secrets
- [ ] No console errors on homepage

---

## 🚀 DEPLOYMENT

- [ ] Vercel deployment successful
- [ ] Production environment variables loaded
- [ ] Redeploy completed

---

## 🧹 CLEANUP

- [ ] Dead code removed
- [ ] Redundant workflows removed
- [ ] Unused dependencies pruned

---

## 📈 PERFORMANCE

- [ ] Lighthouse ≥ 90
- [ ] Images optimized
- [ ] No blocking scripts

---

If any item fails, the merge is NOT considered complete.
