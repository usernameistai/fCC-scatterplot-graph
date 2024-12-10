let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();
// let res;
let values = [];

req.open('GET', url, true);
req.onload = () => {
  // console.table(req.responseText);
  values = JSON.parse(req.response);
  console.log(values, "values");
  console.table(values, "values");
 
  drawCan();
  generateSc();
  drawPoints();
  generateAxes();

}
req.send();

let ySc;
let xSc;
let xAxisSc;
let yAxisSc;

let w = 850;
let h = 600;
let pad = 40;

let svg = d3.select('svg');

let drawCan = () => {
  svg.attr('width', w);
  svg.attr('height', h);
}

let generateSc = () => {

  xSc = d3.scaleLinear()
          .domain([
            d3.min(values, item => item['Year'] - 1), // change scale so scqatterpoints aren't on axes
            d3.max(values, item => item['Year'] + 1)// change scale so scqatterpoints aren't on axes
          ])
          .range([pad, w - pad])

  ySc = d3.scaleLinear()
          .domain([
            d3.min(values, item => new Date(item['Seconds'] * 1000 - 10000)), // change scale so scqatterpoints aren't on axes
            d3.max(values, item => new Date(item['Seconds'] * 1000 + 9900)) // change scale so scqatterpoints aren't on axes
          ])
          .range([pad, h - pad])
}

let drawPoints = () => {

  let tooltip = d3.select('#tooltip')
                  // .append('div')
                  // .attr('id', 'tooltip')
                  // .style('visibility', 'hidden')
                  // .style('width', '400px')
                  // .style('height', '100px')
                  // .attr('background-position-x', '200px')

  svg.selectAll('circle')
     .data(values)
     .enter()
     .append('circle')
     .attr('class', 'dot')
     .attr('r', '7')
     .attr('fill', item => item['Doping'] === "" ? 'Orange' : 'rgb(78, 144, 230)')
     .attr('stroke', '#0a0a23')
     .attr('data-xvalue', item => item['Year'])
     .attr('data-yvalue', item => new Date(item['Seconds'] * 1000))
     .attr('cx', item => xSc(item['Year']))
     .attr('cy', item => ySc(new Date(item['Seconds'] * 1000)))
     .on('mouseover', item => {
        tooltip.transition().style('visibility', 'visible');
        item['Doping'] 
          ? tooltip.text(item['Name'] + ':' + item['Nationality'] + ' ' +
          'Year:' + item['Year'] + ' Time:' + item['Time'] + ' ' + item['Doping'] )
          : tooltip.text(item['Name'] + ':' + item['Nationality'] + ' ' +
          'Year:' + item['Year'] + ' Time:' + item['Time']);
        tooltip.attr('data-year', item['Year']);
      })
     .on('mouseout', item => tooltip.transition().style('visibility', 'hidden'));
}

 
let generateAxes = () => {

  let xAxis = d3.axisBottom(xSc)
                .tickFormat(d3.format('d'));//  d stands for decimal
  svg.append('g')
     .call(xAxis)
     .attr('id', 'x-axis')
     .attr('transform', 'translate(0, ' + (h - pad) + ')')
     .style('color', 'darkslategrey');

  let yAxis = d3.axisLeft(ySc)
                .tickFormat(d3.timeFormat('%M:%S'));
  svg.append('g')
     .call(yAxis)
     .attr('id', 'y-axis')
     .attr('transform', 'translate(' + pad + ', 0)' )
     .style('color', 'darkslategrey');
}