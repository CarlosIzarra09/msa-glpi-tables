// import compression from "compression";
import express from "express";
import xss from 'xss-clean';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import throttler from 'express-rate-limit';

// import RUTAS
import ticketStadisticsRouter from "./v1/routes/ticketStadisticsRoutes";

const app = express();
// Options CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN_URL || '*',
    methods: process.env.ALLOWED_REQUEST_METHODS,
};

// Opciones de throttler
const throttlerOptions = {
    windowMs: 1000 * 60 * Number(process.env.THROTTLER_WINDOW_MINUTES || 1), // N° minutos 
    max: Number(process.env.THROTTLER_MAX_CONSULTS || 1000), // Limita cada IP a 100 solicitudes por `ventana` (aquí, por 15 minutos) 
  };
  
app.use(cors(corsOptions));
app.use(xss());// Data Sanitization  against XSS
  app.use(throttler(throttlerOptions)); // limita las conexiones
app.use(express.json());// parsea todas la rutas
app.use(express.urlencoded({extended: false}));// parsea todas la rutas
app.use(morgan('common'));
  // app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));
app.use(helmet());

app.get('/',(req, res)=>{
    res.send('INTEGRACION GLPI - DASHBOARD');
});

app.use("/api/v1/ticketstadistics", ticketStadisticsRouter);

export default app;