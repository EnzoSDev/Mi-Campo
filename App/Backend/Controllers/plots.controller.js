import plotsModel from '../Models/plots.model.js'

export default {
  handleGetCampaigns,
  handleCreateCampaign,
}

async function handleGetCampaigns(req, res) {
  const { plotId } = req.params
  try {
    const campaigns = await plotsModel.getCampaignsByPlotId(plotId)
    // La fecha de fin que este en null sera la que se ponga como "Current"
    res.status(200).json({ campaigns })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

async function handleCreateCampaign(req, res) {
  const { plotId } = req.params
  const { campaignName, startDate, endDate, description } = req.body

  if (!campaignName || !startDate || !endDate || !description) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' })
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      message: 'La fecha de inicio no puede ser posterior a la fecha de fin',
    })
  }

  try {
    const result = await plotsModel.createCampaign({
      plotId,
      campaignName,
      startDate,
      endDate,
      description,
    })
    if (result) {
      res.status(201).json({ message: 'Campaña creada exitosamente' })
    } else {
      res.status(500).json({ message: 'No se pudo crear la campaña' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
