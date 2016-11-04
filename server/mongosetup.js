db.reactShop.drop();

db.users.drop();
db.createCollection("users");

db.articles.drop();
db.createCollection("articles");


db.cities.drop();
db.createCollection("cities");

//mongoimport -d kidsndeals -c cities cities.json --jsonArray
// Add usr : db.createUser({user: "geekorlifedb",pwd: "18091979pB",roles: [ { role: "readWrite", db: "reactShop" } ]})
// Add admin : db.createUser({ user: "geekorlife", pwd: "18091979pB", roles: ["userAdminAnyDatabase"] })
