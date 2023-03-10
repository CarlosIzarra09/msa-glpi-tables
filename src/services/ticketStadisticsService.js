import { pool } from "../database/conecctionMysql";
export class TicketStadisticsService {
  static _ticketStadisticsServiceInstance = null;
  constructor() { }
  
  static getInstance() {
    if (!TicketStadisticsService._ticketStadisticsServiceInstance) {
        TicketStadisticsService._ticketStadisticsServiceInstance = new TicketStadisticsService();
    }
    return TicketStadisticsService._ticketStadisticsServiceInstance;
  }
    
  getEvolutionTickets = async () => {
    try {
      const pool = await getConnection();
      var result = await pool.
        request().query(`SELECT * FROM ....`);
      return result.recordsets[0];
    } catch (error) {
      return error.message;
    }
  };

}