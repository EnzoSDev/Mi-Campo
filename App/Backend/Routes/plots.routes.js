import express from 'express'
import plotsController from '../Controllers/plots.controller.js'

const router = express.Router()

router.get('/:plotId/campaigns', plotsController.handleGetCampaigns)
router.post('/:plotId/campaigns', plotsController.handleCreateCampaign)

router.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

export default router
