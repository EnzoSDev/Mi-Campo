import { campaignModel } from "../models/campaigns.model.js";
import lotsModel from "../models/lots.model.js";
import utilModel from "../models/util.model.js";

export const CampaignController = {
  handlerUnlinkLotFromCampaign,
  handlerCompleteCampaign,
  handlerGetActivities,
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

async function handlerUnlinkLotFromCampaign(req, res) {
  const { campaignId } = req.params;
  const { unlinkDate, unlinkReason, lotId } = req.body;

  try {
    const result = await campaignModel.unlinkLotFromCampaign(campaignId, lotId);
    if (result) {
      const lot = await lotsModel.getLotById(lotId);
      const text =
        (lot.lot_name.startsWith("Lote") ? "" : "Lote ") +
        lot.lot_name +
        " desvinculado de la campaña.";
      await campaignModel.registerObservation(
        campaignId,
        new Date(unlinkDate).toISOString().split("T")[0],
        text + " Motivo: " + unlinkReason,
      );
      await utilModel.registerActivity(
        req.user.id,
        "observation",
        text + " desvinculado",
        "campaign",
        campaignId,
        new Date(unlinkDate).toISOString().split("T")[0],
      );
      res.status(200).json({ message: "Lote desvinculado con éxito" });
    } else {
      res.status(500).json({ message: "Error al desvincular el lote" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerCompleteCampaign(req, res) {
  const { campaignId } = req.params;
  try {
    const result = await campaignModel.completeCampaign(campaignId);
    if (result) {
      const { completeDate, completeReason } = req.body;
      await campaignModel.registerObservation(
        campaignId,
        new Date(completeDate).toISOString().split("T")[0],
        "Campaña finalizada. Motivo: " + completeReason,
      );
      res.status(200).json({ message: "Campaña finalizada con éxito" });
    } else {
      res.status(500).json({ message: "Error al finalizar la campaña" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function handlerGetActivities(req, res) {
  const { campaignId } = req.params;
  const userId = req.user.id;
  try {
    const activities = await utilModel.getActivities(
      userId,
      ["sowing", "fertilization", "spraying", "harvest", "observation"],
      "campaign",
      campaignId,
      4,
      "desc",
    );
    console.log("Activities retrieved from DB:", activities);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

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
  const userId = req.user.id;
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
    // Formatear la fecha a YYYY-MM-DD para MySQL
    const date = new Date(sowingDate);
    const formattedDate = date.toISOString().split("T")[0];

    const result = await campaignModel.registerSowing(
      campaignId,
      cropType,
      variety,
      formattedDate,
      density,
      rowSpacing,
      method,
      notes,
    );
    if (result) {
      await utilModel.registerActivity(
        userId,
        "sowing",
        `Siembra de ${variety} - ${cropType}`,
        "campaign",
        campaignId,
        formattedDate,
      );
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
  const userId = req.user.id;
  const { productName, dose, dateApplied, method, notes } = req.body;

  if (!productName || !dose || !dateApplied || !method) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // Formatear la fecha a YYYY-MM-DD para MySQL
    const date = new Date(dateApplied);
    const formattedDate = date.toISOString().split("T")[0];

    const result = await campaignModel.registerFertilization(
      campaignId,
      productName,
      dose,
      formattedDate,
      method,
      notes,
    );
    if (result) {
      await utilModel.registerActivity(
        userId,
        "fertilization",
        `Fertilización con ${productName} - ${dose}`,
        "campaign",
        campaignId,
        formattedDate,
      );
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
  const userId = req.user.id;
  const { productName, dose, dateApplied, target, method, notes } = req.body;

  if (!productName || !dose || !dateApplied || !target || !method) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // Formatear la fecha a YYYY-MM-DD para MySQL
    const date = new Date(dateApplied);
    const formattedDate = date.toISOString().split("T")[0];

    const result = await campaignModel.registerSpraying(
      campaignId,
      productName,
      dose,
      formattedDate,
      target,
      method,
      notes,
    );
    if (result) {
      await utilModel.registerActivity(
        userId,
        "spraying",
        `Pulverización con ${productName} contra ${target}`,
        "campaign",
        campaignId,
        formattedDate,
      );
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
  const userId = req.user.id;
  const { harvestDate, totalYieldKg, moisturePercentage, notes } = req.body;

  if (!harvestDate || !totalYieldKg || !moisturePercentage) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // Formatear la fecha a YYYY-MM-DD para MySQL
    const date = new Date(harvestDate);
    const formattedDate = date.toISOString().split("T")[0];

    const result = await campaignModel.registerHarvest(
      campaignId,
      formattedDate,
      totalYieldKg,
      moisturePercentage,
      notes,
    );
    if (result) {
      await utilModel.registerActivity(
        userId,
        "harvest",
        `Cosecha: ${totalYieldKg} kg (Humedad: ${moisturePercentage}%)`,
        "campaign",
        campaignId,
        formattedDate,
      );
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
  const userId = req.user.id;
  const { observationDate, note } = req.body;

  if (!observationDate || !note) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // Formatear la fecha a YYYY-MM-DD para MySQL
    const date = new Date(observationDate);
    const formattedDate = date.toISOString().split("T")[0];

    const result = await campaignModel.registerObservation(
      campaignId,
      formattedDate,
      note,
    );
    if (result) {
      await utilModel.registerActivity(
        userId,
        "observation",
        note,
        "campaign",
        campaignId,
        formattedDate,
      );
      res.status(201).json({ message: "Observación registrada con éxito" });
    } else {
      res.status(500).json({ message: "Error al registrar la observación" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
