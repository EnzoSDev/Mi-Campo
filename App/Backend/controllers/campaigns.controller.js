import { campaignModel } from "../models/campaigns.model.js";

export const CampaignController = {
  handlerGetSowings,
  handlerRegisterSowing,
  handlerGetFertilizations,
  handlerRegisterFertilization,
  handlerGetSprayings,
  handlerRegisterSpraying,
  handlerGetHarvests,
  handlerRegisterHarvest,
  handlerGetObservations,
  handlerRegisterObservation,
};

async function handlerGetSowings(req, res) {
  const { campaignId } = req.params;
  try {
    const sowings = await campaignModel.getSowingsByCampaignId(campaignId);
    res.status(200).json(sowings);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerRegisterSowing(req, res) {
  const { campaignId } = req.params;
  const { cropType, variety, sowingDate, density, rowSpacing, method, notes } =
    req.body;

  if (
    !cropType ||
    !variety ||
    !sowingDate ||
    !density ||
    !rowSpacing ||
    !method
  ) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const result = await campaignModel.registerSowing(
      campaignId,
      cropType,
      variety,
      sowingDate,
      density,
      rowSpacing,
      method,
      notes,
    );
    if (result) {
      res.status(201).json({ message: "Siembra registrada con éxito" });
    } else {
      res.status(500).json({ message: "Error al registrar la siembra" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerGetFertilizations(req, res) {
  const { campaignId } = req.params;
  try {
    const fertilizations =
      await campaignModel.getFertilizationsByCampaignId(campaignId);
    res.status(200).json(fertilizations);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerRegisterFertilization(req, res) {
  const { campaignId } = req.params;
  const { productName, dose, dateApplied, method, notes } = req.body;

  if (!productName || !dose || !dateApplied || !method) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const result = await campaignModel.registerFertilization(
      campaignId,
      productName,
      dose,
      dateApplied,
      method,
      notes,
    );
    if (result) {
      res.status(201).json({ message: "Fertilización registrada con éxito" });
    } else {
      res.status(500).json({ message: "Error al registrar la fertilización" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerGetSprayings(req, res) {
  const { campaignId } = req.params;
  try {
    const sprayings = await campaignModel.getSprayingsByCampaignId(campaignId);
    res.status(200).json(sprayings);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerRegisterSpraying(req, res) {
  const { campaignId } = req.params;
  const { productName, dose, dateApplied, target, method, notes } = req.body;

  if (!productName || !dose || !dateApplied || !target || !method) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const result = await campaignModel.registerSpraying(
      campaignId,
      productName,
      dose,
      dateApplied,
      target,
      method,
      notes,
    );
    if (result) {
      res.status(201).json({ message: "Pulverización registrada con éxito" });
    } else {
      res.status(500).json({ message: "Error al registrar la pulverización" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerGetHarvests(req, res) {
  const { campaignId } = req.params;
  try {
    const harvests = await campaignModel.getHarvestsByCampaignId(campaignId);
    res.status(200).json(harvests);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerRegisterHarvest(req, res) {
  const { campaignId } = req.params;
  const { harvestDate, totalYieldKg, moisturePercentage, notes } = req.body;

  if (!harvestDate || !totalYieldKg || !moisturePercentage) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const result = await campaignModel.registerHarvest(
      campaignId,
      harvestDate,
      totalYieldKg,
      moisturePercentage,
      notes,
    );
    if (result) {
      res.status(201).json({ message: "Cosecha registrada con éxito" });
    } else {
      res.status(500).json({ message: "Error al registrar la cosecha" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerGetObservations(req, res) {
  const { campaignId } = req.params;
  try {
    const observations =
      await campaignModel.getObservationsByCampaignId(campaignId);
    res.status(200).json(observations);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerRegisterObservation(req, res) {
  const { campaignId } = req.params;
  const { observationDate, note } = req.body;

  if (!observationDate || !note) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const result = await campaignModel.registerObservation(
      campaignId,
      observationDate,
      note,
    );
    if (result) {
      res.status(201).json({ message: "Observación registrada con éxito" });
    } else {
      res.status(500).json({ message: "Error al registrar la observación" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
