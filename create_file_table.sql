CREATE TABLE IF NOT EXISTS File (
    id varchar(255) NOT NULL PRIMARY KEY,
    journal_id varchar(255) NOT NULL,
    file_name text,
    file_path varchar(255),
    mimetype varchar(255),
    FOREIGN KEY (journal_id) REFERENCES Journal(id) ON DELETE CASCADE
);