PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
INSERT INTO users VALUES(1,'akshithatarigoppula@gmail.com','$2b$10$ohlJvt21nu6SVTZ2ektZ5euOp6FUsTrKjRPe3KUriBrz.w7y9.LPO');
INSERT INTO users VALUES(2,'akshaytarigoppula@gmail.com','$2b$10$91v4Jp2Vs.tla1LKrHjrJOi8vpBo3kQGmg6TmXTeIYzg24P3SjFM6');
INSERT INTO users VALUES(3,'akshitha@gmail.com','$2b$10$vftq2ZJUep9k1DBKnJBr4OiuXICZasYmuLegwyuKuhMYRfyWiBiEi');
INSERT INTO users VALUES(4,'tillu123@gmail.com','$2b$10$86ZIajdrrVjltHHCP2P26OWPPupetOCii0NPfZ7QicwS9uALQlVne');
INSERT INTO sqlite_sequence VALUES('users',4);
COMMIT;
