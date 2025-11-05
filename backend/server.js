import jsonServer from "json-server";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Diretório uploads criado:", uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens e vídeos são permitidos!"), false);
    }
  },
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

server.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = router.db;

  console.log("Tentativa de login:", email, password);

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const user = db.get("users").find({ email, password }).value();

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token: "dummy-token-" + user.id,
    });
  } else {
    console.log("Credenciais inválidas para:", email);
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

server.post("/upload", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
      console.error("Erro no upload:", err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const mediaItem = {
      id: Date.now(),
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype,
      size: req.file.size,
      uploadedBy: 1,
      uploadedAt: new Date().toISOString(),
    };

    const db = router.db;
    db.get("media").push(mediaItem).write();

    res.json(mediaItem);
  });
});

server.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  },
  (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }

      res.sendFile(filePath);
    });
  }
);

server.use(router);

server.use((error, req, res, next) => {
  console.error("Erro no servidor:", error);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("✅ JSON Server running on http://localhost:" + PORT);
  console.log("📁 Uploads directory:", uploadsDir);
  console.log("📊 Rotas disponíveis:");
  console.log("   - POST /login");
  console.log("   - POST /upload");
  console.log("   - GET /uploads/*");
  console.log("   - Rotas automáticas do JSON Server");
});
