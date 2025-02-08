import mysql from "mysql";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "loginuser",
});

db.query("SELECT 1 + 1 AS solution", (err, rows, fields) => {
  if (err) throw err;

  console.log("The solution is: ", rows[0].solution);
});

export default db;
