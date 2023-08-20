const db = require("../utils/database");

module.exports = class USER {
  static createTable() {
    return db.execute(`CREATE TABLE IF NOT EXISTS Users(  
        id varchar(255) NOT NULL PRIMARY KEY,
        name varchar(255) NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        phno varchar(10) NOT NULL,
        password varchar(255) NOT NULL,
        role ENUM('student', 'teacher') NOT NULL
    )`);
  }

  static findUser(user) {
    return db.execute(
      "SELECT id, name, email, phno, password, role FROM users WHERE email = ?",
      [user.email]
    );
  }
  static findUserById(id) {
    return db.execute(
      "SELECT id, name, email, phno, password, role FROM users WHERE id = ?",
      [id]
    );
  }

  static findUserByTag(tags) {
    console.log(tags, "tagsd");
    return db.execute(
      `SELECT id, name, email, phno, password, role FROM Users WHERE id IN (${tags
        .map((tag) => `'${tag}'`)
        .join(",")})`
    );
  }

  static getAllStudents() {
    return db.execute(
      "SELECT id, name, email, phno FROM users WHERE role = 'student'"
    );
  }

  static addUser(user) {
    return db.execute(
      "INSERT INTO users(id, name, email, phno, password, role) VALUES (?,?,?,?,?,?)",
      [user.id, user.name, user.email, user.phno, user.password, user.role]
    );
  }
};
