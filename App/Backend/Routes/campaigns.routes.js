import express from 'express'
import { CampaignController } from '../Controllers/campaigns.controller.js'

const router = express.Router()

router.get('/:campaignId/sowings', CampaignController.handlerGetSowings)
router.post('/:campaignId/registerSowing', CampaignController.handlerRegisterSowing)
router.get('/:campaignId/fertilizations', CampaignController.handlerGetFertilizations)
router.post('/:campaignId/registerFertilization', CampaignController.handlerRegisterFertilization)
router.get('/:campaignId/sprayings', CampaignController.handlerGetSprayings)
router.post('/:campaignId/registerSpraying', CampaignController.handlerRegisterSpraying)
router.get('/:campaignId/harvests', CampaignController.handlerGetHarvests)
router.post('/:campaignId/registerHarvest', CampaignController.handlerRegisterHarvest)
router.get('/:campaignId/observations', CampaignController.handlerGetObservations)
router.post('/:campaignId/registerObservation', CampaignController.handlerRegisterObservation)

export default router
