import { Router } from 'express'
import {
  getAdminSessionState,
  postAdminLogin,
  postAdminLogout,
} from '../controllers/adminAuthController.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()

router.post('/login', postAdminLogin)
router.get('/session', adminAuth, getAdminSessionState)
router.post('/logout', adminAuth, postAdminLogout)

export default router
