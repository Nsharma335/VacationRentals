'use strict';
var mysql = require('mysql');
var crypt = require('./crypt');
var config = require('./settings');
var db = {};

// Creating a connection object for connecting to mysql database
var pool = mysql.createPool({
    connectionLimit: config.pool_limit,
    host: config.database_host,
    port: config.database_port,
    user: config.database_user,
    password: config.database_password,
    database: config.database_name,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

//Connecting to database
pool.getConnection(function (err, connection) {
    if (err) {
        console.error('error connecting to database: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

db.createUser = function (user, successCallback, failureCallback) {
    console.log("registering users in Database..")
    pool.getConnection(function (err, connection) {
        console.log("pool connection started..")
        var passwordHash;

        crypt.createHash(user.password, function (res) {
            passwordHash = res;
            var query = "INSERT INTO UserTable (email,firstName,lastname,password) VALUES ( " + mysql.escape(user.email) + " , " +
                mysql.escape(user.firstName) + " , " + mysql.escape(user.lastName) + " , " + mysql.escape(passwordHash) + " ); "
            connection.query(query,
                function (err, result) {
                    if (err) {
                        console.log(err);
                        failureCallback(err);
                        return;
                    }
                    console.log("query", query);
                    successCallback();
                });

        }, function (err) {
            console.log(err);
            failureCallback();
        });
        connection.release();
    });

};

db.findUser = function (user, successCallback, failureCallback) {
    console.log("Finding user in database..")
    pool.getConnection(function (err, connection) {
        var sqlQuery = "SELECT * FROM `Homeaway`.`UserTable` WHERE `email` = '" + user.email + "';";
        console.log("query ", sqlQuery);
        connection.query(sqlQuery, function (err, rows) {
            if (err) {
                console.log("failure callback 1")
                failureCallback(err);
                return;
            }
            if (rows.length > 0) {
                console.log("successCallback callback 2")
                successCallback(rows[0])
            }
            else {
                console.log("failure callback 2")
                failureCallback('User not found.');
            }
            connection.release();
        });

    });
};

db.searchProperty = function (property, successCallback, failureCallback) {
    console.log(property)
    var data = {};
    pool.getConnection(function (err, connection) {
        console.log("Searching property in database");
        console.log(property)

        var sqlQuery = "SELECT * FROM `Homeaway`.`property` WHERE address = '" + property.data.location + "' and availableFrom <= '" + property.data.checkin + "' and availableTo >='" + property.data.checkout + "' ;";
        console.log(sqlQuery);
        connection.query(sqlQuery, function (err, rows) {
            if (err) {
                console.log("failure callback 1")
                failureCallback(err);
                return;
            }
            if (rows.length > 0) {
                console.log("successCallback callback 2")
                console.log("rows generated are" + rows)
                successCallback(rows)
            }
            else {
                console.log("failure callback 2")
                failureCallback('Property Match not found.');
            }
            connection.release();
        });

    });

};

db.updateProfile = function (form_values, successCallback, failureCallback) {
    console.log("Updating profile of user : " + form_values.firstName)
    pool.getConnection(function (err, connection) {
        var sql = "UPDATE UserTable SET firstName = '" + form_values.firstName + "', lastName = '" + form_values.lastName +
            "', comment='" + form_values.comment + "', country='" + form_values.country + "', company='" + form_values.company +
            "',  school='" + form_values.school + "', hometown='" + form_values.hometown + "', languages='" + form_values.languages +
            "', gender='" + form_values.gender + "' where email='" + form_values.email + "'";

        console.log(sql);
        connection.query(sql,
            function (err, result) {
                if (err) {
                    console.log(err);
                    console.log("in update failure block")
                    failureCallback(err);
                    return;
                }
                console.log("in update success block")
                console.log("result" + result);
                successCallback();
            });

    }, function (err) {
        console.log(err);
        failureCallback();  //callback of update profile
    });
    //connection.release();
};



db.submitProperty = function (property, successCallback, failureCallback) {
    console.log("Creating property inside database....")
    const insertQueryString =
        "INSERT INTO `Homeaway`.`property` (address,headline,description,bedroom,bathroom,accomodates,amenities,availableFrom,availableTo,propertyType,currency,baseRate,owner) VALUES ( " + mysql.escape(property.address) + " , " +
        mysql.escape(property.headline) + " , " +
        mysql.escape(property.description) + " , " + mysql.escape(property.bedroom) + " , " +
        mysql.escape(property.bathroom) + " , " + mysql.escape(property.accomodates) + " , " +
        mysql.escape(property.amenities) + " , " + mysql.escape(property.availableFrom) + " , " +
        mysql.escape(property.availableTo) + " , " +
        mysql.escape(property.propertyType) + " , " + mysql.escape(property.currency) + " , " +
        mysql.escape(property.baseRate) + " , " + mysql.escape(property.email) + " ); "

    pool.getConnection(function (err, connection) {
        connection.query(insertQueryString,
            function (err) {
                if (err) {
                    console.log(err);
                    failureCallback(err);
                    return;
                }
                console.log("Property Created successfully")
                console.log(insertQueryString);
                successCallback();
            },
            function (err) {
                console.log(err);
                failureCallback();
            });
        connection.release();
    });
};



db.findProperty = function (property, successCallback, failureCallback) {
    console.log("fetching properties from Database..")
    pool.getConnection(function (err, connection) {
        var sqlQuery = "SELECT * FROM `Homeaway`.`property` WHERE `propertyId` = '" + property.id + "';";
        console.log("query result " + sqlQuery);
        connection.query(sqlQuery, function (err, rows) {
            if (err) {
                console.log("failure callback 1")
                failureCallback(err);
                return;
            }
            if (rows.length > 0) {
                successCallback(rows[0])
            }
            else {
                console.log("failure callback 2")
                failureCallback('Property not found.');
            }
            connection.release();
        });

    });
};


db.findOwnersListedPropertyperty = function (property, successCallback, failureCallback) {
    console.log("owner id " + property.ownerid)
    pool.getConnection(function (err, connection) {
        var sqlQuery = "SELECT * FROM `Homeaway`.`property` WHERE `owner` = '" + property.ownerid + "';";
        console.log("query result " + sqlQuery);
        connection.query(sqlQuery, function (err, rows) {
            if (err) {
                console.log("failure callback 1")
                failureCallback(err);
                return;
            }
            if (rows.length > 0) {
                successCallback(rows)
            }
            else {
                console.log("failure callback 2")
                failureCallback('Property not found.');
            }
            connection.release();
        });

    });
};

db.findTravelerBookings = function (property, successCallback, failureCallback) {
    console.log("searching booked properties indatabase..")
    pool.getConnection(function (err, connection) {

        var sqlQuery = "Select * from booking INNER JOIN Property on (booking.propertyId = property.propertyId) where TravelerEmail = '"
            + property.travelerId + "'";

        console.log("query result " + sqlQuery);
        connection.query(sqlQuery, function (err, rows) {
            if (err) {
                console.log("failure callback 1")
                failureCallback(err);
                return;
            }
            if (rows.length > 0) {
                successCallback(rows)
            }
            else {
                console.log("failure callback 2")
                failureCallback('Booking not found.');
            }
            connection.release();
        });

    });
};


db.BookProperty = function (property, successCallback, failureCallback) {
    console.log("storing to database...")
    const insertQueryString =
        "INSERT INTO `Homeaway`.`booking` (propertyId,TravelerEmail,checkIn,checkOut) VALUES ( " + mysql.escape(property.propertyId) + " , " +
        mysql.escape(property.travelerId) + " , " +
        mysql.escape(property.checkin) + " , " + mysql.escape(property.checkout) + " ); "
    console.log(insertQueryString);
    pool.getConnection(function (err, connection) {
        connection.query(insertQueryString,
            function (err) {
                if (err) {
                    console.log(err);
                    failureCallback(err);
                    return;
                }
                successCallback();
            },
            function (err) {
                console.log(err);
                failureCallback();
            });
        connection.release();
    });
};








module.exports = db;