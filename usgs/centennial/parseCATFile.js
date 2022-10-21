// This script transforms the original data .CAT file into a CSV file.
var fs = require('fs');

// This utility converts an array of objects to CSV.
var toCSV = require('../../util/toCSV');

// Read the original data file.
var data = fs.readFileSync('centennial_Y2K.CAT', 'utf8');

// Split by newlines.
var lines = data.split('\n');

// Parse the data based on fixed spacing
var rows = lines.map(function(line){

  var year = +line.substring(12, 16),
      month = +line.substring(16, 20),
      day = +line.substring(20, 22),
      hour = +line.substring(24, 26),
      minute = +line.substring(27, 29),
      date = new Date(
        year,
        month - 1, // JS Date uses months where 0 = January
        day,
        hour,
        minute
      );
  return {
    date: date.toISOString(),
    latitude:  +line.substring(37, 44),
    longitude: +line.substring(44, 52),
    depth:     +line.substring(53, 58),
    magnitude: +line.substring(67, 71)
  }
});

// This file has 13542 rows.
fs.writeFileSync('earthquakes.csv', toCSV(rows));

// Filter out smaller earthquakes.
rows = rows.filter(function (d) {
  return d.magnitude > 7;
});

// This file has 1290 rows.
fs.writeFileSync('earthquakes_larger_than_7_magnitude.csv', toCSV(rows));

// Filter to include only the largest.
rows = rows.filter(function (d) {
  return d.magnitude > 8.3;
});

// This file has 20 rows.
fs.writeFileSync('earthquakes_largest_20.csv', toCSV(rows));
