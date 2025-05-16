import util from 'util';
if (!util.isNullOrUndefined) {
  util.isNullOrUndefined = (arg: unknown): arg is null | undefined => arg === null || arg === undefined;
}

if (util.isArray) {
  console.log('Substituindo util.isArray depreciado por Array.isArray');
  util.isArray = Array.isArray;
}

import '@tensorflow/tfjs-node';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import validateFacesRoute from './api/validateFaces';
import dashboardRoute from './api/dashboard';
import { loadModels } from './services/modelUtils';
import * as faceapi from '@vladmandic/face-api';
import { setupCanvas } from './utils/canvasSetup';
import { connectToDatabase } from './db/mongodb';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Conectar ao MongoDB
connectToDatabase().catch(err => {
  console.error('Falha ao conectar ao MongoDB:', err);
});

setupCanvas();

process.env.TF_CPP_MIN_LOG_LEVEL = '2';

const app = express();

// Configurar CORS
app.use(cors());

app.use(express.json());

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use('/api/validate-faces', validateFacesRoute);
app.use('/api/dashboard', dashboardRoute);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export const isModelLoaded = {
  ssdMobilenetv1: false,
  faceLandmark68Net: false,
  faceRecognitionNet: false,
};

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);

  try {
    console.log('Carregando modelos de ML...');
    const loadResult = await loadModels();

    if (loadResult.success) {
      console.log('✅ Modelos carregados com sucesso');
      isModelLoaded.ssdMobilenetv1 = true;
      isModelLoaded.faceLandmark68Net = true;
      isModelLoaded.faceRecognitionNet = true;
    } else {
      console.error('❌ Falha ao carregar modelos:', loadResult.error);
      console.warn('O sistema usará implementação alternativa em caso de falha nos modelos.');
    }
  } catch (err) {
    console.error('❌ Erro ao carregar modelos de face-api.js:', err);
    console.warn('O sistema usará implementação alternativa em caso de falha nos modelos.');
  }
});