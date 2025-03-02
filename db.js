const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Rubino13_",
  database: "webapp-express",
});

db.getConnection()
  .then(() => console.log(" Connessione a MySQL riuscita!"))
  .catch((err) => console.error(" Errore nella connessione a MySQL:", err));

module.exports = db;
