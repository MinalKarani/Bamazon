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
  
  display();
  //connection.end();
  })

  function display(){
      var query="select * from products"
      connection.query(query, function(err,res){
          if(err) throw err;
          
            console.log("\n| Product_id    |             Product_name            |     Price       | ");
              console.log("| ------------- |    -------------------------------- | --------------- | ");
              for(var i=0;i<res.length;i++)
              {
                console.log(
                  "| " + res[i].item_id + addSpaces(res[i].item_id,"| --------  |") +
                  "| " + res[i].product_name + addSpaces(res[i].product_name,"      --------------------------- |") +
                  "| " + res[i].price + addSpaces(res[i].price," ------------ |") + "|" 
                  );
                  console.log("| ------------- |    -------------------------------- | --------------- | ");
          }
          purchaseProduct();
      });
     
  }

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
        })
        
    });
    
}

function updateRecord(quantity,units,id,price){
    var new_stock_quantity=quantity-units;
    var query="update products set stock_quantity="+ new_stock_quantity +",product_sales = " + price + " where item_id = "+id;
    connection.query(query, function(err,response){
        if(err) throw err;
        //console.log("response: "+response);
    });
    connection.end();
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