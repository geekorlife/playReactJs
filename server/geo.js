var fs = require('fs')
  , _ = require('underscore');

var filename = process.argv[2];
if (!filename) {
  console.log('File not found');
  process.exit(1);
}

var cities = fs.readFileSync(filename).toString().split("\n");
cities.pop(); // empty element
var processedCities = _.map(cities, function(city) {
  var data = city.split('\t');
  return {
    _id: Number(data[1]), //Zipcode
    nm: data[2], // City name
    st: data[4], // State acronym
    cty: data[5], // County
    pos: [Number(data[9]), Number(data[10])] // [ latitude, longitude ]
  }
});

fs.writeFileSync('cities.json', JSON.stringify(processedCities));