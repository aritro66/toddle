const db = require("../utils/database");

// DATE - format YYYY-MM-DD

module.exports = class JOURNAL {
  static createTable() {
    return db.execute(`CREATE TABLE IF NOT EXISTS Journal(  
        id varchar(255) NOT NULL PRIMARY KEY,
        teacher_id varchar(255) NOT NULL,
        description text NOT NULL,
        published_at DATE NOT NULL
    )`);
  }

  static getJournalForTeacher(id) {
    return db.execute(
      "SELECT J.id AS journal_id, J.teacher_id, U.name, J.description, J.published_at, F.id AS file_id  FROM Journal AS J LEFT JOIN File F ON J.id = F.journal_id INNER JOIN Users AS U ON U.id = J.teacher_id  WHERE J.teacher_id = ?",
      [id]
    );
  }

  static getJournalForStudent(id) {
    return db.execute(
      "SELECT J.id AS journal_id, J.teacher_id, U.name, J.description, J.published_at,F.id AS file_id  FROM Journal AS J INNER JOIN Taggedstudent T ON J.id = T.journal_id LEFT JOIN File F ON J.id = F.journal_id INNER JOIN Users AS U ON U.id = J.teacher_id WHERE J.published_at <= DATE_FORMAT(NOW(), '%Y-%m-%d') AND T.student_id = ?",
      [id]
    );
  }

  static addJournal(journal) {
    return db.execute(
      "INSERT INTO Journal(id, teacher_id, description, published_at) VALUES (?,?,?,?)",
      [
        journal.id,
        journal.teacher_id,
        journal.description,
        journal.published_at,
      ]
    );
  }

  static updateJournal(journal_id, journal) {
    let updateFields = [];
    let values = [];
    if (journal.description) {
      updateFields.push("description = ?");
      values.push(journal.description);
    }

    if (journal.published_at) {
      updateFields.push("published_at = ?");
      values.push(journal.published_at);
    }

    values.push(journal_id);

    return db.execute(
      `UPDATE Journal SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );
  }

  static deleteJournal(journal_id) {
    return db.execute("DELETE FROM Journal WHERE id = ?", [journal_id]);
  }
};
