const db = require("../utils/database");

module.exports = class TAGGEDSTUDENT {
  static createTable() {
    return db.execute(`CREATE TABLE IF NOT EXISTS Taggedstudent(  
        id varchar(255) NOT NULL PRIMARY KEY,
        journal_id varchar(255) NOT NULL,
        student_id varchar(255) NOT NULL,
        FOREIGN KEY (journal_id) REFERENCES Journal(id) ON DELETE CASCADE
    )`);
  }

  static getTaggedStudents(journal_id) {
    return db.execute(
      "SELECT T.id, T.journal_id, T.student_id, U.name FROM Taggedstudent AS T INNER JOIN Users AS U ON U.id = T.student_id WHERE T.journal_id = ?",
      [journal_id]
    );
  }

  static addTag(tag) {
    return db.execute(
      "INSERT INTO Taggedstudent(id, journal_id, student_id) VALUES (?,?,?)",
      [tag.id, tag.journal_id, tag.student_id]
    );
  }

  static deleteTag(tag_id) {
    return db.execute("DELETE FROM Taggedstudent WHERE id = ?", [tag_id]);
  }
};
