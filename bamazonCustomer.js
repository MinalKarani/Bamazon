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

  var totalRows=0;
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
          totalRows=table.length;
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
            message:"\nPlease enter an Id of the product you would like to buy",
            /* Legacy way: with this.async */
            validate: function (input) {
                // Declare function as asynchronous, and save the done callback
                var done = this.async();
                validation(input,"n",done)}
            },
        {
            name:"units",
            type:"input",
            message:"\nPlease enter number of units of the product you would like to buy",
            /* Legacy way: with this.async */
            validate: function (input) {
                // Declare function as asynchronous, and save the done callback
                var done = this.async();
                validation(input,"n",done)}
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

function validation(input,type,done){
                        
    // Do async stuff
    setTimeout(function() {
      if(type==="t")
      {
        if (!input) {
            // Pass the return value in the done callback
            done('You need to provide Name');
            return;
        }
    }
    else if (type==="n")     
    {
      if((!input)||isNaN(input)){
        // Pass the return value in the done callback
        done('You need to provide number');
        return;
      }
    }
    
    // Pass the return value in the done callback
    done(null, true);
    }, 1000);
}