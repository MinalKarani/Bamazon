
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
              "View Product Sales by Department",
              "Create New Department",
              "Exit"
            ]
          })
          .then(function(answer) {
            switch (answer.menu) {
            case "View Product Sales by Department":
              productsales();
              break;
      
            case "Create New Department":
              newDept();
              break;
      
              case "Exit":
              connection.end();
              break;
            }
          });
}

//Display product sales and total Profit for department 
function productsales(){

  var query="select departments.department_id,departments.department_name,departments.over_head_costs,sum(products.product_sales) as productsales from departments " 
  + "left join products on departments.department_name=products.department_name where products.product_sales is not null "
  + "group by products.department_name";
  connection.query(query, function(err,res){
      if(err) throw err;
      //if no record found
      if(res.length<=0)
      {
          console.log("\nNo Records found!!\n");
      }
      else
      {
     
      var table = new Table({
        head: ['Id', 'department_name', 'over_head_costs','product_sales','total_profit']
      , colWidths: [4, 20, 17, 15, 15]
      });
      for(i=0;i<res.length;i++){
        var total_profit=((res[i].productsales)-(res[i].over_head_costs));
        table.push(
          [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].productsales,total_profit]
        );
      }
      
        console.log(table.toString());
  }
  runSearch();
  });
}

//lets Supervisor add new Department to the store
function newDept(){
        console.log("\nEnter details of new Department to be added.\n");
        inquirer
          .prompt([{
            name: "deptname",
            type: "input",
            message: "\nEnter Department Name"
          },
          {
            name: "overhead",
            type: "input",
            message: "\nEnter Over_head Cost"
          }
          
        ]).then(function(answer){
              
                    var query="INSERT INTO departments(department_name,over_head_costs)" +
                    "VALUES ('" + answer.deptname + "'," + answer.overhead  + ")";
                    
                    connection.query(query, function(err,response){
                    if(err) throw err;
                });
                runSearch();               
      
          });
        
      }