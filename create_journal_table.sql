CREATE TABLE IF NOT EXISTS Journal (
    id varchar(255) NOT NULL PRIMARY KEY,
    teacher_id varchar(255) NOT NULL,
    description text NOT NULL,
    published_at DATE NOT NULL
);
