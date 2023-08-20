CREATE TABLE IF NOT EXISTS Users (
    id varchar(255) NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    phno varchar(10) NOT NULL,
    password varchar(255) NOT NULL,
    role ENUM('student', 'teacher') NOT NULL
);