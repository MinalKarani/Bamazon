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
              "View Low Inventory",
              "Add to Inventory",
              "Add New Product",
              "Exit"
            ]
          })
          .then(function(answer) {
            switch (answer.menu) {
            case "View Products for Sale":
              listItems();
              break;
      
            case "View Low Inventory":
              lowInventory();
              break;
      
            case "Add to Inventory":
              addInventory();
              break;
      
            case "Add New Product":
              addProduct();
              break;
      
            case "Exit":
              connection.end();
              break;
            }
          });
      }
      
      //function list every available item: the item IDs, names, prices, and quantities
      function listItems(){
        var query="select * from products"
        connection.query(query, function(err,res){
            if(err) throw err;
            //if no record found
            if(res.length<=0)
            {
                console.log("\nNo Records found!!\n");
            }
            else
            {
            //Table object
            var table = new Table({
              head: ['Id', 'Product_name', 'price','stock_quantity']
            , colWidths: [4, 30, 10,20]
            });
            for(i=0;i<res.length;i++){
              table.push(
                [res[i].item_id, res[i].product_name,  res[i].price,res[i].stock_quantity]
              );
            }
              
              console.log(table.toString());
            
        }

        runSearch();
        });
      }

      //list all items with an inventory count lower than five
      function lowInventory(){
        var query="select * from products where stock_quantity < 5"
        connection.query(query, function(err,res){
            if(err) throw err;
            //if no record found
            if(res.length<=0)
            {
                console.log("\nNo Records found!!\n");
            }
            else
            {
            console.log();
            for(var i=0;i<res.length;i++)
            {
               
                console.log(
                  "Product id: " + res[i].item_id +
                  "|| Product_Name: "+res[i].product_name +
                  "|| Price: "+res[i].price +
                  "|| Quantity: "+res[i].stock_quantity
                  );
            }
            console.log();
        }
        runSearch();
        });
      }

      //lets the manager "add more" of any item currently in the store
      function addInventory(){
        inquirer
          .prompt([{
            name: "itemid",
            type: "input",
            message: "\nEnter an Id of an Item for which you would like to add more quantity?",
            validate: function (input) {
              // Declare function as asynchronous, and save the done callback
              var done = this.async();
              validation(input,"n",done)}
          },
          {
            name: "itemquantity",
            type: "input",
            message: "\nHow much quantity?",
            validate: function (input) {
               // Declare function as asynchronous, and save the done callback
               var done = this.async();
               validation(input,"n",done)}
          }
        ]).then(function(answer1){
              var query="select * from products where item_id = "+answer1.itemid;
              connection.query(query, function(err,res){
                if(err) throw err;
                //if no record found
                if(res.length<=0)
                {
                    console.log("\nNo Records found!!\n");
                }
                else
                {
                    var item_quantity=0;
                    item_quantity=parseInt(res[0].stock_quantity)+parseInt(answer1.itemquantity);
                    var query1="update products set stock_quantity ="+ item_quantity +" where item_id = "+answer1.itemid;
                    connection.query(query1, function(err,response){
                    if(err) throw err;
                });
                runSearch();  }
      
          });
        });
        
      }

      //lets the manager to add a completely new product to the store
      function addProduct(){

        console.log("\nEnter details of new item to be added to the store\n");
        inquirer
          .prompt([{
            name: "productname",
            type: "input",
            message: "\nEnter Product Name",
            validate: function(input){
              // Declare function as asynchronous, and save the done callback
              var done = this.async();
            validation(input,"t",done)}
          },
          {
            name: "productDept",
            type: "input",
            message: "\nEnter Product Department",
            validate: function(input){
              var done = this.async();
              validation(input,"t",done)}
          },
          {
            name: "stockquantity",
            type: "input",
            message: "\nEnter Product Quantity",
            validate: function(input){
              var done = this.async();
              validation(input,"n",done)}
          },
          {
            name: "price",
            type: "input",
            message: "\nEnter Product Price",
            validate: function(input){
              var done = this.async();
              validation(input,"n",done)}
          }
        ]).then(function(answer){
              
                    var query="INSERT INTO products(product_name,department_name,stock_quantity,price)" +
                    "VALUES ('" + answer.productname + "','" + answer.productDept + "'," + answer.stockquantity + "," + answer.price + ")";
                    
                    connection.query(query, function(err,response){
                    if(err) throw err;
                });
                runSearch();               
      
          });
        
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
      