import { TicketStadisticsService } from "../services/ticketStadisticsService";
const ticketStadisticsService = TicketStadisticsService.getInstance();
import { Response } from "../lib/Response";
const response = new Response();

const getEvolutionTickets = async (req, res) => {
    try {
        const result = await ticketStadisticsService.getEvolutionTickets();
        console.log(result);
        return res.status(200).send({
            messages: ["Success"],
            code: ["0000"],
            success: true,
            data: result
        });
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            return res.status(408).send({
                messages: ['Tiempo de consulta excedido'],
                code: "4008",
            });
        }
        return res.status(500).send({ messages: 'Error interno de servidor' })
        // return res.status(500).send({messages : `${error.message}`})
    }
};
const getIndicators = async (req, res) => {
    try {   
        const result = await ticketStadisticsService.listIndicators();
        return res.status(200).send({
          messages: ["Success"],
          code: ["0000"],
          success: true,
          data: result
        });
      } catch (error) {
        if (error.code === 'ETIMEDOUT') {
          return res.status(408).send({
            messages: ['Tiempo de consulta excedido'],
            code: "4008",
          });
        }
        console.info(error);
        return res.status(400).send({messages : []})
        
      }
};

const getStateChart = async (req, res) => {
  try {   
      const result = await ticketStadisticsService.getStateChart();
      return res.status(200).send({
        messages: ["Success"],
        code: ["0000"],
        success: true,
        data: result
      });
    } catch (error) {
      if (error.code === 'ETIMEDOUT') {
        return res.status(408).send({
          messages: ['Tiempo de consulta excedido'],
          code: "4008",
        });
      }
      console.info(error);
      return res.status(400).send({messages : []})
      
    }
};

const getLastSevenDays = async (req, res) => {
  try {   
      const result = await ticketStadisticsService.getLastSevenDays();
      return res.status(200).send({
        messages: ["Success"],
        code: ["0000"],
        success: true,
        data: result
      });
    } catch (error) {
      if (error.code === 'ETIMEDOUT') {
        return res.status(408).send({
          messages: ['Tiempo de consulta excedido'],
          code: "4008",
        });
      }
      console.info(error);
      return res.status(400).send({messages : []})
      
    }
};

const getTicketsByDay = async (req, res) => {
  try {   
      const result = await ticketStadisticsService.getTicketsByDay();
      return res.status(200).send({
        messages: ["Success"],
        code: ["0000"],
        success: true,
        data: result
      });
    } catch (error) {
      if (error.code === 'ETIMEDOUT') {
        return res.status(408).send({
          messages: ['Tiempo de consulta excedido'],
          code: "4008",
        });
      }
      console.info(error);
      return res.status(400).send({messages : []})
      
    }
};

const getListByRequestTypeDashboard = async (req, res) => {
  try {   
      const result = await ticketStadisticsService.listByRequestTypeDashboard();
      return res.status(200).send({
        messages: ["Success"],
        code: ["0000"],
        success: true,
        data: result
      });
    } catch (error) {
      if (error.code === 'ETIMEDOUT') {
        return res.status(408).send({
          messages: ['Tiempo de consulta excedido'],
          code: "4008",
        });
      }
      console.info(error);
      return res.status(400).send({messages : []})
      
    }
};

const getOpenTicketsAgeDashboard = async (req, res) => {
  try {   
      const result = await ticketStadisticsService.getOpenTicketsAge();
      return res.status(200).send({
        messages: ["Success"],
        code: ["0000"],
        success: true,
        data: result
      });
    } catch (error) {
      if (error.code === 'ETIMEDOUT') {
        return res.status(408).send({
          messages: ['Tiempo de consulta excedido'],
          code: "4008",
        });
      }
      console.info(error);
      return res.status(400).send({messages : []})
      
    }
};

const getUsersOnline = async (req, res) => {
  try {   
    const result = await ticketStadisticsService.usersOnline();
    return res.status(200).json({
      messages: ["Success"],
      code: ["0000"],
      success: true,
      data: result
    });
  } catch (error) {
    if (error.code === 'ETIMEDOUT') {
      return res.status(408).send({
        messages: ['Tiempo de consulta excedido'],
        code: "4008",
      });
    }
    console.info(error);
    return res.status(400).send({messages : []})
    
  }
};

export default { 
    getEvolutionTickets,
    getIndicators,
    getStateChart,
    getLastSevenDays,
    getOpenTicketsAgeDashboard,
    getTicketsByDay,
    getListByRequestTypeDashboard,
    getUsersOnline
  };
