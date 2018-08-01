var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
});


function start() {
    inquirer.prompt({
        name: "id",
        type: "input",
        message: "Welcome to Bamazon! What is the item number you would like to purchase?"

    }).then(function (answer) {
        connection.query("SELECT * FROM products WHERE id = ?", answer.id, function (error, results, fields) {
            // console.log("error", error);
            console.log("Product Name: " + results[0].product_name);
            // howMuch();
            inquirer.prompt({
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?"
            }).then(function (amount) {
                connection.query("SELECT * FROM products WHERE id = ?", answer.id, function (error, res, fields) {
                    if (amount.quantity > res[0].stock_quantity) {
                        console.log("Not enough in stock!");
                        console.log("Your order cannot be processed.");

                    }
                    else {
                        var sale = res[0].stock_quantity - amount.quantity;
                        var cost = amount.quantity * res[0].price;
                        console.log("There are " + sale + " " + results[0].product_name + " " + "left in inventory.");
                        console.log("You have purchased " + amount.quantity + " " + results[0].product_name + ".");
                        console.log("Thanks for the " + " " + "$" + cost + "!");
                        connection.query("UPDATE products SET stock_quantity = ? WHERE id= ?", [sale, answer.id], function (error, res, fields) {
                            if (error === null) {
                                console.log("success");

                            }
                        })

                    }
                    // function newAmount () {
                    //     connection.query("UPDATE products SET stock_quantity = ? WHERE id= ?", sale, answer.id, function (error, res, fields) {
                    //         console.log(res);
                            

                    //     });
                    // };
                })
            }
            )



        });

    });

}
start();
connection.connect(function (err) { //THIS IS WHERE WE ARE CONNECTING TO THE DB. IT IS A GLOBAL FUNCTION THAT WE CAN USE LATER.
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, result, fields) {
        console.log("connected as id " + connection.threadId);
        console.log(result);


    });
})

// function howMuch() {
//     inquirer.prompt({
//         name: "quantity",
//         type: "input",
//         message: "How many would you like to purchase?"
//     }).then(function (amount) {
//         connection.query("SELECT * FROM products WHERE id = ?", answer, function (error, res, fields) {
//             if (amount.quantity > res[0].stock_quantity) {
//                 console.log("You're too poor!");

//             }
//         })
//     }
//     )
// }


// function confirm() {`
//     inquirer.prompt({
//         name: "product_name",
//         type: "rawlist",
//         message: "You would like to purchase the [answer.product_name]? Is that correct?",
//         choices: ["Yes", "No"]

//     })
//     .then(function(answer) {
//         console.log(answer)
//     }
// )
// }


// function confirm() {
//     console.log(answer.product_name);
//}



