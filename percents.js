var fs = require('fs');

var csv = fs.readFileSync('totals.csv', 'utf-8');

csv
  .split('\n')
  .splice(1)
  .forEach(function(line) {
    var attrs = line.split(', ');
    if (attrs.length > 1) {
      console.log(attrs[0], String(Math.round(+attrs[1]/+attrs[2] * 100)) + "%");
    }
  });

var json = csv
  .split('\n')
  .splice(1)
  .reduce(function(obj, line) {
    var attrs = line.split(', ');
    if (attrs.length > 1) {
      obj[attrs[0].replace(/ /g, '')] = String(Math.round(+attrs[1]/+attrs[2] * 100));
    }
    return obj;
  }, {});

fs.writeFileSync('percents.json', JSON.stringify(json, null, 2));

