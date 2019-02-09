var mysql = require("mysql");
var inquirer = require("inquirer");
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
  console.log("connected as id " + connection.threadId);
  
 runSearch();
  
})

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
              console.log("\n| Item_id       |             Product_name            |     Price       | stock_quantity | ");
              console.log("| ------------- |    -------------------------------- | --------------- | -------------  |");
              for(var i=0;i<res.length;i++)
              {
                console.log(
                  "| " + res[i].item_id + addSpaces(res[i].item_id,"| --------  |") +
                  "| " + res[i].product_name + addSpaces(res[i].product_name,"      --------------------------- |") +
                  "| " + res[i].price + addSpaces(res[i].price," ------------ |") +
                  "| " + res[i].stock_quantity + addSpaces(res[i].stock_quantity," -----------  ") + "|" 
                  );
                  console.log("| ------------- |    -------------------------------- | --------------- | -------------  |");
            }
            
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
            message: "\nEnter an Id of an Item for which you would like to add more quantity?"
          },
          {
            name: "itemquantity",
            type: "input",
            message: "\nHow much quantity?"
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
                    console.log(res[0].stock_quantity);
                    console.log(item_quantity);
                    var query1="update products set stock_quantity ="+ item_quantity +" where item_id = "+answer1.itemid;
                    connection.query(query1, function(err,response){
                    if(err) throw err;
                });
                runSearch();               }
      
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
            message: "\nEnter Product Name"
          },
          {
            name: "productDept",
            type: "input",
            message: "\nEnter Product Department"
          },
          {
            name: "stockquantity",
            type: "input",
            message: "\nEnter Product Quantity"
          },
          {
            name: "price",
            type: "input",
            message: "\nEnter Product Price"
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

      function addSpaces(string1,str2){
        var str="";
        var str1=string1.toString();
        for(var i=0;i<=(str2.length-str1.length);i++)
        {
          str+=" ";
        }
        return str;
      }