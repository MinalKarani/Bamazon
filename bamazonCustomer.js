var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Min143Sag",
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
          for(var i=0;i<res.length;i++)
          {
            console.log(
                "Product id: " + res[i].item_id +
                "|| Product_Name: "+res[i].product_name +
                "|| Price: "+res[i].price
                );
          }
          
      });
      purchaseProduct();
  }

  /*The app should then prompt users with two messages.

   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.

7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

   * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
   * This means updating the SQL database to reflect the remaining quantity.
   * Once the update goes through, show the customer the total cost of their purchase.*/
function purchaseProduct(){
    inquirer.prompt([
        {
            name:"id",
            type:"input",
            message:"Please enter an Id of the product you would like to buy"
        },
        {
            name:"units",
            type:"input",
            message:"Please enter number of units of the product you would like to buy"
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
                updateRecord(quantity,units,id);
                console.log("Total Cost of your today's purchase is:  "+price);
            }
            else{
                console.log("Insufficient quantity!");
            }
        })
    })
}

function updateRecord(quantity,units,id){
    var new_stock_quantity=quantity-units;
    var query="update products set stock_quantity="+ new_stock_quantity +" where item_id = "+id;
    connection.query(query, function(err,response){
        if(err) throw err;
        //console.log("response: "+response);
    })
}

















