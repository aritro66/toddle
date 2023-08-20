CREATE TABLE IF NOT EXISTS Taggedstudent (
    id varchar(255) NOT NULL PRIMARY KEY,
    journal_id varchar(255) NOT NULL,
    student_id varchar(255) NOT NULL,
    FOREIGN KEY (journal_id) REFERENCES Journal(id) ON DELETE CASCADE
);
