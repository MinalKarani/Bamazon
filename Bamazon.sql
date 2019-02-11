DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  stock_quantity integer(45) NULL,
  price decimal(10,4),
  PRIMARY KEY (item_id)
);
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs decimal(10,4),
  PRIMARY KEY (department_id)
);

select * from bamazon;

INSERT INTO products(product_name,department_name,stock_quantity,price)
VALUES ("Mixed Nut","Food",10,10), ("Quaker Oats","Food",10,15), ("Kellogss Honey Almond","Food",15,8),("Honey","Food",8,12),("Basil leaves dry","Food",10,5),("Mr Clean all purpose cleaner","Home",20,8),("Parchment Paper","Home",18,6),("Aluminium Foil","Home",10,10),("Pamolive dish wash","Home",15,10),("Soft Soap","Home",10,5);
