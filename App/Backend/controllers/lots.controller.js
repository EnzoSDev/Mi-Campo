import lotsModel from "../models/lots.model.js";

export default {
  handleDeleteLot,
  handleGetCampaigns,
  handleCreateCampaign,
};

async function handleDeleteLot(req, res) {
  const { lotId } = req.params;
  try {
    const result = await lotsModel.deleteLot(lotId);
    if (result) {
      res.status(200).json({ message: "Lote borrado exitosamente" });
    } else {
      res.status(404).json({ message: "Lote no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleGetCampaigns(req, res) {
  const { lotId } = req.params;
  try {
    const campaigns = await lotsModel.getCampaignsByLotId(lotId);
    // La fecha de fin que este en null sera la que se ponga como "Current"
    res.status(200).json({ campaigns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handleCreateCampaign(req, res) {
  const { lotId } = req.params;
  const { campaignName, startDate, endDate, description } = req.body;

  if (!campaignName || !startDate || !endDate || !description) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      message: "La fecha de inicio no puede ser posterior a la fecha de fin",
    });
  }

  try {
    const result = await lotsModel.createCampaign({
      lotId,
      campaignName,
      startDate,
      endDate,
      description,
    });
    if (result) {
      res.status(201).json({ message: "Campaña creada exitosamente" });
    } else {
      res.status(500).json({ message: "No se pudo crear la campaña" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
