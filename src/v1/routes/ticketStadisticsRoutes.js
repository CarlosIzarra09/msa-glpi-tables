import { Router } from "express";
const ticketStadisticsRouter = Router();
import ticketStadisticsController from "../../controller/ticketStadisticsController";
import { setHeaders } from '../../middlewares';

ticketStadisticsRouter  
  .get("/",[setHeaders],ticketStadisticsController.getEvolutionTickets);

export default ticketStadisticsRouter;
