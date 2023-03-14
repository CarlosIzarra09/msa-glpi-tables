import { Router } from "express";
const ticketStadisticsRouter = Router();
import ticketStadisticsController from "../../controller/ticketStadisticsController";
import { setHeaders } from '../../middleware/index';

ticketStadisticsRouter  
  .get("/getTicketsEvolution",[setHeaders],ticketStadisticsController.getEvolutionTickets)
  .get("/getIndicators", [setHeaders], ticketStadisticsController.getIndicators);


export default ticketStadisticsRouter;
