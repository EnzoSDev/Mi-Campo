import multer from "multer";
import path from "path";
import crypto from "crypto";

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generar un nombre único sin usar el nombre original (Por que por ahora no lo necesito)
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(file.originalname);
    const uniqueName = `${uniqueId}${extension}`;
    cb(null, uniqueName);
  },
});

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Solo se permiten imágenes");
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
