const db = require("../utils/database");

module.exports = class FILE {
  static createTable() {
    return db.execute(`CREATE TABLE IF NOT EXISTS File(  
        id varchar(255) NOT NULL PRIMARY KEY,
        journal_id varchar(255) NOT NULL,
        file_name text NOT NULL,
        file_path varchar(255) NOT NULL,
        mimetype varchar(255) NOT NULL,
        FOREIGN KEY (journal_id) REFERENCES Journal(id) ON DELETE CASCADE
    )`);
  }
  static getFileById(id) {
    return db.execute("SELECT * FROM File WHERE id = ?", [id]);
  }

  static addFile(file) {
    return db.execute(
      "INSERT INTO File(id, journal_id, file_name, file_path, mimetype) VALUES (?,?,?,?,?)",
      [file.id, file.journal_id, file.file_name, file.file_path, file.mimetype]
    );
  }

  static updateFile(id, file) {
    let updateFields = [];
    let values = [];

    if (file.file_name) {
      updateFields.push("file_name = ?");
      values.push(file.file_name);
    }

    if (file.file_path) {
      updateFields.push("file_path = ?");
      values.push(file.file_path);
    }
    if (file.mimetype) {
      updateFields.push("mimetype = ?");
      values.push(file.mimetype);
    }

    values.push(id);

    return db.execute(
      `UPDATE File SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );
  }

  static deleteFile(file_id) {
    return db.execute("DELETE FROM File WHERE id = ?", [file_id]);
  }
};
