import express from 'express';
const router = express.Router();

import CheckAuth from '../helpers/auth.js'
const checkAuth = CheckAuth.checkAuth

import ThoughtController from '../controllers/ThoughtController.js'

router.get('/add', checkAuth, ThoughtController.createThought)
router.post('/add', checkAuth, ThoughtController.createThoughtSave)
router.get('/edit/:id', checkAuth, ThoughtController.updateThought)
router.post('/edit/', checkAuth, ThoughtController.updateThoughtSave)
router.get('/dashboard', checkAuth, ThoughtController.dashboard)
router.post('/remove', checkAuth, ThoughtController.removeThought)
router.get('/', checkAuth, ThoughtController.showThoughts)

export default router