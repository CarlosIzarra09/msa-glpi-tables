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

  listIndicators = async () => {
    let conn;
    try {
      var date = new Date();
      //Arrays de datos:
      let mes = this.getMonthName(date.getMonth());// nombre del mes   
      var pdm = this.formatDate(new Date(date.getFullYear(), date.getMonth(), 1)); //  primer dia del mes
      var pdmy = this.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)); //  primer dia del mes
      // console.info(pdmy);

      conn = await pool.getConnection();
      // numero total de tickets  
      const Txt = await conn.query(`SELECT count(*) t FROM glpi_tickets WHERE is_deleted = 0  `);

      //  tickets por dia
      const Txd = await conn.query(`SELECT count(*) d FROM glpi_tickets 
      WHERE is_deleted = 0   AND (DATE(date_creation) = Date_format(now(),'%Y-%m-%d')); `);
      //  tickets por dia
      const Txd_yesterday = await conn.query(`SELECT count(*) d FROM glpi_tickets 
      WHERE is_deleted = 0 AND ( DATE(date_creation) = '${pdmy}' ); `);
      // console.info(Txd_yesterday);

      //  tickets del Mes
      const Txm = await conn.query(`SELECT count(*) m FROM glpi_tickets 
      WHERE is_deleted = 0 AND DATE(date_creation) BETWEEN '${pdm}' AND Date_format(now(),'%Y-%m-%d');`);
     
      const l = await conn.query(`SELECT DISTINCT COUNT(glpi_tickets.id) AS total
      FROM glpi_tickets
      WHERE glpi_tickets.status NOT IN (5,6)
      AND glpi_tickets.is_deleted = 0
      AND glpi_tickets.time_to_resolve IS NOT NULL
      AND glpi_tickets.time_to_resolve < NOW()
      AND glpi_tickets.entities_id IN (0,1,2);`);

      return {
        txt: { total: parseInt(Txt[0].t) },
        txd: { total: parseInt(Txd[0].d) },
        txdy: { total: parseInt(Txd_yesterday[0].d) },
        txm: { total: parseInt(Txm[0].m), name: mes },
        tl: { total: parseInt(l[0].total) }
      };
    } catch (error) {
      console.info(error);
      if (conn) conn.release()
      // conn.end();
    } finally {
      if (conn) conn.release()
      // conn.end();
    }
  };

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
              name: `${property}`,
              data: m
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

  getStateChart = async () => {
    let conn;
    try {
      const STATUS = ['Nuevo', 'En curso (asignado)', 'En curso (planificada)', 'En espera']
      conn = await pool.getConnection();
      // numero total de tickets  
      const result = await conn.query(`SELECT status, count(*) total FROM glpi_tickets   
      WHERE status < 5 GROUP BY status`);
      var new_array = [];
      for (let i = 0; i < result.length; i++) {
        const el = result[i];
        new_array.push([STATUS[el.status - 1], parseInt(el.total), false]);
      }
      return new_array;
    } catch (error) {
      console.info(error);
      if (conn) conn.release()
    } finally {
      if (conn) conn.release()
      // conn.end();
    }
  };

  getLastSevenDays = async () => {
    let conn;
    try {
      let date = new Date();
      conn = await pool.getConnection();
      var TYPES = [1, 2]
      //  CONSULTAS
      const d1 = this.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6));
      console.info(d1);
      // TIPO INCIDENCIA
      const res1 = await conn.query(`SELECT DATE(date_creation) as fecha, count(*) r FROM glpi_tickets 
      WHERE DATE(date_creation) BETWEEN '${d1}' AND Date_format(now(),'%Y-%m-%d') AND type = 1 
      GROUP BY fecha;`);

      // TIPO SOLICITUD
      const res2 = await conn.query(`SELECT DATE(date_creation) as fecha, count(*) r FROM glpi_tickets 
      WHERE DATE(date_creation) BETWEEN '${d1}' AND Date_format(now(),'%Y-%m-%d') AND type = 2 
      GROUP BY fecha;`);

      var data1 = [];
      for (let i = 0; i < res1.length; i++) {
        const el = res1[i];
        data1.push({
          fecha: this.formatDate(new Date(el.fecha)),
          total: parseInt(el.r)
        });
      }
      var data2 = [];
      for (let i = 0; i < res2.length; i++) {
        const el = res2[i];
        data2.push({
          fecha: this.formatDate(new Date(el.fecha)),
          total: parseInt(el.r)
        });
      }

      ////
      var DATA1 = [];
      var DATA2 = [];

      var ARRAY_DATE = []

      for (let j = 6; j >= 0; j--) {
        const dia = this.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - j));
        const res1 = data1.filter(el => el.fecha == dia);
        const res2 = data2.filter(el => el.fecha == dia);
        ARRAY_DATE.push(dia);

        if (res1.length == 0) {
          DATA1.push(0);
        } else {
          DATA1.push(res1[0].total);
        }
        if (res2.length == 0) {
          DATA2.push(0);
        } else {
          DATA2.push(res2[0].total);
        }
      }

      var array = [
        {
          name: 'Incidente',
          data: DATA1
        },
        {
          name: 'Solicitud',
          data: DATA2
        }
      ];

      return {
        series: array,
        categories: ARRAY_DATE
      };

    } catch (error) {
      console.info(error);
      if (conn) conn.release()
      // conn.end();
    } finally {
      if (conn) conn.release()
      // conn.end();
    }
  };

  getOpenTicketsAge = async () => {
    let conn;
    try {
      let date = new Date();
      conn = await pool.getConnection();
      // #####
      // #Edades de tickets de tipo solicitud e incidentes entre los rangos
      // #####**********************************************************************************************
      // #type--> 1 --> Incidente
      // #type--> 2 --> Solicitud
      // #1ª 7 días, 
      // #7 a 15 días, 
      // #15 a 30 días, 
      // #mayor a 30 días y menor o igual a 60, 
      // #mayor a 60 días

      var sql = `     
      select 'Grupo1',  type, COUNT(id) as total from  glpi_tickets
      WHERE glpi_tickets.is_deleted = 0
      AND CAST(date AS DATE) BETWEEN (CURDATE() - INTERVAL 6 DAY) AND CURDATE()      
      AND status NOT IN (5,6)
      GROUP BY type
      UNION ALL 
      
      select 'Grupo2',  type, COUNT(id) as total from  glpi_tickets
      WHERE glpi_tickets.is_deleted = 0
      AND CAST(date AS DATE) BETWEEN  (CURDATE() - INTERVAL 14 DAY) AND (CURDATE() - INTERVAL 7 DAY)      
      AND status NOT IN (5,6)
      GROUP BY type
      UNION ALL 
      
      select 'Grupo3',  type, COUNT(id) as total from  glpi_tickets
      WHERE glpi_tickets.is_deleted = 0
      AND CAST(date AS DATE) BETWEEN (CURDATE() - INTERVAL 29 DAY) AND (CURDATE() - INTERVAL 15 DAY)      
      AND status NOT IN (5,6)
      GROUP BY type
      UNION ALL
      
      select 'Grupo4',  type, COUNT(id) as total from  glpi_tickets
      WHERE glpi_tickets.is_deleted = 0
      AND CAST(date AS DATE) BETWEEN (CURDATE() - INTERVAL 59 DAY) AND (CURDATE() - INTERVAL 30 DAY)      
      AND status NOT IN (5,6)
      GROUP BY type
      UNION ALL
      
      select 'Grupo5',  type, COUNT(id) as total from  glpi_tickets
      WHERE glpi_tickets.is_deleted = 0
      AND CAST(date AS DATE) BETWEEN ( CURDATE() - INTERVAL 1 YEAR) AND (CURDATE() - INTERVAL 60 DAY)      
      AND status NOT IN (5,6)
      GROUP BY type;
      `;

      var result = [];
      result = await conn.query(sql);
      // console.info(result);
      var categories = ['1-7', '7-15', '15-30', '>30', '>60'];

      var data1 = [];
      var data2 = [];

      for (let i = 0; i < 5; i++) {
        var rt1 = result.find(el => el.type == 1 && el.Grupo1 == `Grupo${i + 1}`);
        var rt2 = result.find(el => el.type == 2 && el.Grupo1 == `Grupo${i + 1}`);
        // console.info(rt1);
        // console.info(rt2);
        if (rt1 == undefined) {
          data1.push(0);
        } else {
          data1.push(parseInt(rt1.total));
        }
        if (rt2 == undefined) {
          data2.push(0);
        } else {
          data2.push(parseInt(rt2.total));
        }
      }

    
      var series = [
        {name: 'Solicitudes',data: data2},
        {name: 'Incidentes',data: data1},
      ];


      return { categories, series };
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

  getTicketsByDay = async () => {
    let conn;
    try {
      let date = new Date();
      conn = await pool.getConnection();
      var sql = `     
        SELECT SUM(total) total, days FROM(
        SELECT total, CASE WHEN days >=8 THEN '8+' ELSE days END days FROM(
        SELECT count( id ) AS total , DATEDIFF( solvedate, date ) AS days
        FROM glpi_tickets
        WHERE solvedate IS NOT NULL
        AND is_deleted = 0
        GROUP BY days) t) t2 GROUP by days; 
      `;
      
      const result = await conn.query(sql);
      // console.info(result);
      var DATA = [];
      var total = 0;

      for (let j = 0; j < result.length; j++) {
        const el = result[j];
        total = total + parseInt(el.total);
      }

      for (let k = 0; k < 9; k++) {
        if(k == 0){
          var rt1 = result.find(el => el.days  == k);
          // console.info(rt1);
          if (rt1 == undefined) {          
            DATA.push([`< 1 día 0%`, 0, false]);
          } else {
            const percent = (parseInt(rt1.total) * 100) / parseInt(total);
            DATA.push([`< 1 día ${percent.toFixed(2)}%`, parseInt(rt1.total), false]);
          } 
        }
        
        if(k>= 1 && k <=  7){
          var rt1 = result.find(el => el.days  == k);
          // console.info(rt1);
          if (rt1 == undefined) {          
            DATA.push([` ${k} día 0%`, 0, false]);
          } else {
            const percent = (parseInt(rt1.total) * 100) / parseInt(total);
            DATA.push([` ${k} día ${percent.toFixed(2)}%`, parseInt(rt1.total), false]);
          } 
        }
        if(k == 8){
          var rt1 = result.find(el => el.days  == `${k}+`);
          // console.info(rt1);
          if (rt1 == undefined) {          
            DATA.push([` ${k}+ día 0%`, 0, false]);
          } else {
              const percent = (parseInt(rt1.total) * 100) / parseInt(total);
            DATA.push([` ${k}+ día ${percent.toFixed(2)}%`, parseInt(rt1.total), false]);
          } 
        }
      }

      
      return DATA;
    } catch (error) {
      console.info(error);
      if (conn) conn.release()
      throw error;
      // conn.end();
    } finally {
      if (conn) conn.release()
      // conn.end();
    }
  };

  listByRequestTypeDashboard = async () => {
    let conn;
    try {
      let date = new Date();
      conn = await pool.getConnection();

      var sql = `
      
      SELECT tt.*, (Closed + Opened + Solved) as Tickets FROM(
        SELECT
          fuente_solicitud, fuente_solicitud_id,
          COUNT(CASE WHEN status_desc = "Closed" THEN status END) "Closed",
          COUNT(CASE WHEN status_desc = "Opened" THEN status END) "Opened",
          COUNT(CASE WHEN status_desc = "Solved" THEN status END) "Solved",
          ((COUNT(CASE WHEN status_desc = "Closed" THEN status END) * 100)/(COUNT(CASE WHEN status_desc = "Closed" THEN status END) + COUNT(CASE WHEN status_desc = "Opened" THEN status END) + COUNT(CASE WHEN status_desc = "Solved" THEN status END)) ) AS porcentaje_Cerrado
        FROM (
        SELECT glpi_requesttypes.id AS fuente_solicitud_id,  glpi_requesttypes.name AS fuente_solicitud, glpi_tickets.status,
            CASE WHEN glpi_tickets.status = 5 THEN 'Solved'
                WHEN glpi_tickets.status = 6 THEN 'Closed'
                ELSE 'Opened' END status_desc
            FROM glpi_tickets
            INNER JOIN glpi_requesttypes ON glpi_requesttypes.id = glpi_tickets.requesttypes_id
            WHERE glpi_tickets.is_deleted = 0 
          
            AND glpi_tickets.entities_id IN (0,1,2)  
                ) t
        GROUP BY fuente_solicitud_id) tt
        ORDER BY Tickets DESC;

`;
      var array = await conn.query(sql);

      var categories = [];

      var data = [];

      for (let i = 0; i < array.length; i++) {
        const el = array[i];
        categories.push(el.fuente_solicitud);
        data.push(parseInt(el.Tickets));
      }

      return { data: data, categories: categories };
    } catch (error) {
      console.info(error);
      if (conn) conn.release()
      // conn.end();
    } finally {
      if (conn) conn.release()
      // conn.end();
    }
  };

  usersOnline = async () => {
    let conn;
    try {
      let date = new Date();
      conn = await pool.getConnection();
      var sql = `     
        SELECT * FROM glpi_events
        ORDER BY glpi_events.id DESC
        LIMIT 10;
      `;
      const result = await conn.query(sql);

      for (let i = 0; i < result.length; i++) {
        const el = result[i];
        el.date = new Date(el.date);
        
      }
      
      const formatResult = result.map((item) => {
        const { level, message } = item;
        if (level != 3) {
          return item;
        }
        const newMessage = message.split(' desde')[0];
        return {
          ...item,
          message: newMessage,
        }
      });

      return formatResult;
    } catch (error) {
      console.info(error);
      if (conn) conn.release()
      throw error;
      // conn.end();
    } finally {
      if (conn) conn.release()
      // conn.end();
    }
  };

  formatDate = (date) => {
    try {
      var year = date.getFullYear().toString();
      var month = (date.getMonth() + 101).toString().substring(1);
      var day = (date.getDate() + 100).toString().substring(1);
      return year + "-" + month + "-" + day;
    } catch (error) {
      throw error;
    }
  }


  getMonthName = (month) => {
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const lasemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const diassemana = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
    return meses[month];
  }

}