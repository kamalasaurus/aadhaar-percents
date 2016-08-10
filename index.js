function drawScale(svg, percents) {
  var scale = svg.append('g');

  var gradient = svg.append('defs')
    .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '100%')
      .attr('x2', '100%')
      .attr('y1', '100%')
      .attr('y2', '0%')
      .attr('spreadMethod', 'pad');

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', 'brown')
    .attr('stop-opacity', 0);

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', 'brown')
    .attr('stop-opacity', 1);

  var rect = scale.append('rect')
    .attr('x', '30')
    .attr('width', '20')
    .attr('height', '600')
    .style('fill', 'url(#gradient)')

  scale.append('text')
    .attr('x', '1')
    .attr('y', '600')
    .text('0%');

  scale.append('text')
    .attr('x', '1')
    .attr('y', '8')
    .text('100%');

  var appended = [];
  // this is to label percents as they are attached,
  // an x-offset can be added if there is overlap with
  // existing elements

  Object.keys(percents)
    .sort(function(a,b) {
      return percents[a] - percents[b];
    })
    .forEach(function(key) {
      var cent = 600 - (percents[key]/100) * 600 + 8;
      var xoffset = appended.filter(function(val) {
        return +percents[key] - +val < 2;
      }).length

      scale.append('text')
        .attr('x', function(d) { return xoffset * 80 + 55  })
        .attr('y', cent)
        .text(key);

      appended.push(percents[key])
    });
}

function createMap(percents) {
  var width, height;
  width = 1000;
  height = 600;

  var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

  var states = svg
        .append('g')
        .attr('class', 'states');

  var projection = d3.geo.mercator()
        .center([83, 23.5])
        .scale(890);

  var path = d3.geo.path()
        .projection(projection)
        .pointRadius(2);

  d3.json('./india.json', function(data) {
    states.selectAll('path')
        .data(topojson.object(data, data.objects.states).geometries)
      .enter().append('path')
        .attr('class', function(d) { return d.properties.name })
        .attr('d', path)
        .attr('fill', 'brown')
        .attr('opacity', function(d) {
          var name = d.properties.name;
          name == 'Orissa' ? lookup = 'Odisha' : lookup = name;
          return percents[lookup.replace(/ /g, '')] / 100 || 0;
        });
  });

  drawScale(svg, percents);
}

function get(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

(function initialize() {
  get('./percents.json', createMap);
})();

