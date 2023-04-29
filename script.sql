DROP TABLE IF EXISTS queue;
CREATE TABLE queue (
  printer INT,
  content VARCHAR(255)
);

DROP TABLE IF EXISTS printer;
CREATE TABLE printer (
  id INT PRIMARY KEY,
  cyan FLOAT,
  yellow FLOAT,
  magenta FLOAT,
  black FLOAT
);

INSERT INTO printer (id, cyan, yellow, magenta, black) VALUES
(1, 100.00, 100.00, 100.00, 100.00),
(2, 100.00, 100.00, 100.00, 100.00),
(3, 100.00, 100.00, 100.00, 100.00);