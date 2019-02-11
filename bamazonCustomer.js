var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
require("dotenv").config();

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.password,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
    
  runSearch();
  })

  //Main Menu
  function runSearch() {
    inquirer
      .prompt({
        name: "menu",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "Purchase Product",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.menu) {
        case "View Products for Sale":
          display();
          break;
  
        case "Purchase Product":
          purchaseProduct();
          break;
    
        case "Exit":
          connection.end();
          break;
        }
      });
  }

  //Display products available for sale
  function display(){
      var query="select * from products"
      connection.query(query, function(err,res){
          if(err) throw err;
         //Table object 
          var table = new Table({
            head: ['Id', 'Product_name', 'price']
          , colWidths: [4, 30, 10]
          });
          for(i=0;i<res.length;i++){
            table.push(
              [res[i].item_id, res[i].product_name,  res[i].price]
            );
          }
            if (err) throw err;
            console.log(table.toString());
          runSearch();
  });

  }

//lest customer purchase the product
  function purchaseProduct(){
    inquirer.prompt([
        {
            name:"id",
            type:"input",
            message:"\nPlease enter an Id of the product you would like to buy"
        },
        {
            name:"units",
            type:"input",
            message:"\nPlease enter number of units of the product you would like to buy"
        }
    ]).then(function(answer){
        var query="select * from products where item_id=" + answer.id;
        connection.query(query,function(err,res){
            if(err) throw err;
            //console.log(res);
            var quantity=res[0].stock_quantity;
            var units=answer.units;
            var id=answer.id;
            var price=res[0].price*units;
            if(quantity>=units)
            {
                updateRecord(quantity,units,id,price);
                console.log("\nTotal Cost of your today's purchase is:  "+price);
            }
            else{
                console.log("\nInsufficient quantity!");
            }
           runSearch();
        })
        
    });
    
    
}

//update database if customer purchased the product
function updateRecord(quantity,units,id,price){
    var new_stock_quantity=quantity-units;
    var query="update products set stock_quantity="+ new_stock_quantity +",product_sales = " + price + " where item_id = "+id;
    connection.query(query, function(err,response){
        if(err) throw err;
        //console.log("response: "+response);
    });
       ;
}

