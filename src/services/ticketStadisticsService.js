import { pool } from "../database/connectionMySql";
export class TicketStadisticsService {
  static _ticketStadisticsServiceInstance = null;
  constructor() { }
  
  static getInstance() {
    if (!TicketStadisticsService._ticketStadisticsServiceInstance) {
        TicketStadisticsService._ticketStadisticsServiceInstance = new TicketStadisticsService();
    }
    return TicketStadisticsService._ticketStadisticsServiceInstance;
  }
    
  /*getEvolutionTickets = async () => {
    let conn;
    try {
      conn = await pool.getConnection();//  MARIADB
      const sqlYears = `SELECT DISTINCT DATE_FORMAT( date, '%Y' ) AS year
      FROM glpi_tickets
      WHERE glpi_tickets.is_deleted = '0'
      AND date IS NOT NULL
      ORDER BY year ASC`;
      var rowsYears = await conn.query(sqlYears);
      
      let tableData = [];

      //console.log(rowsYears);
      for (let i = 0; i < rowsYears.length; i++) {

        let year = rowsYears[i].year;

        const query_m = `
        SELECT DISTINCT DATE_FORMAT( date, '%Y' ) AS year, COUNT( id ) AS nb, DATE_FORMAT( date, '%m' ) AS month
        FROM glpi_tickets
        WHERE glpi_tickets.is_deleted = '0'
        AND DATE_FORMAT( date, '%Y' ) = ${year}
        GROUP BY month
        ORDER BY month`;

        let groupedTicketsByMonth = await conn.query(query_m);
        conn.release();
        //console.log(groupedTicketsByMonth)

        const arr1 = [];

        
        tableData.push({
          year: `${year}`,
          data: JSON.stringify(groupedTicketsByMonth, (key, value) =>
          typeof value === 'bigint'
              ? value.toString()
              : value // return everything else unchanged)
          )
        });

          
      }

      //console.log(tableData);   
      return tableData;
    } catch (error) {
      return error.message;
    }
  };*/

  getEvolutionTickets = async () => {
    let conn;
    try {
     
      conn = await pool.getConnection();
      var sql = `     
        SELECT DISTINCT DATE_FORMAT( date, '%Y' ) AS year, COUNT( id ) AS nb, DATE_FORMAT( date, '%m' ) AS month
        FROM glpi_tickets
        WHERE glpi_tickets.is_deleted = '0'
        GROUP BY year, month
        ORDER BY year, month;
      `;


      const result = await conn.query(sql);

      var month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      var data = [];
      for (let i = 0; i < result.length; i++) {
        const el = result[i];
        el.nb = parseInt(el.nb);
      }
      const reducedResult = result.reduce((acc, { year, nb, month }) => (
        {
          ...acc,
          [year]: acc[year] ? [...acc[year], { nb, month }] : [{ nb, month }],
        }
      ), {});
      for (const property in reducedResult) {
        const array = reducedResult[property];
        var m = [];
        for (let i = 0; i < month.length; i++) {
          const el = month[i];
          let res = array.filter(elem => elem.month == el);
          if (res.length >= 1) {
            m.push(res[0].nb);
          } else {
            m.push(0);
          }
          if (month.length == i + 1) {
            data.push({
              year: `${property}`,
              ticketsPerMonth: m
            });
          }
        }
      }

      return data;
    } catch (error) {
      console.info(error);
      if (conn) conn.release();
      throw error;
      // conn.end();
    } finally {
      if (conn) conn.release()
      // conn.end();
    }
  };

}