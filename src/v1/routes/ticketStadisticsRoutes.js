import { Router } from "express";
const ticketStadisticsRouter = Router();
import ticketStadisticsController from "../../controller/ticketStadisticsController";
import { setHeaders } from '../../middleware/index';

ticketStadisticsRouter  
  .get("/evolution",[setHeaders],ticketStadisticsController.getEvolutionTickets);

export default ticketStadisticsRouter;
