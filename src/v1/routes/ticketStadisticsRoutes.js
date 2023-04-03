import { Router } from "express";
const ticketStadisticsRouter = Router();
import ticketStadisticsController from "../../controller/ticketStadisticsController";
import { setHeaders } from '../../middleware/index';

ticketStadisticsRouter  
  .get("/getTicketsEvolution",[setHeaders],ticketStadisticsController.getEvolutionTickets)
  .get("/getIndicators", [setHeaders], ticketStadisticsController.getIndicators)
  .get("/getStateChart", [setHeaders], ticketStadisticsController.getStateChart)
  .get("/getOpenTicketsAge", [setHeaders], ticketStadisticsController.getOpenTicketsAgeDashboard)
  .get("/getTicketsByDay", [setHeaders], ticketStadisticsController.getTicketsByDay)
  .get("/getListByRequestType", [setHeaders], ticketStadisticsController.getListByRequestTypeDashboard)
  .get("/getLastSevenDays", [setHeaders], ticketStadisticsController.getLastSevenDays)
  .get("/getUsersOnline",[setHeaders], ticketStadisticsController.getUsersOnline);


export default ticketStadisticsRouter;
