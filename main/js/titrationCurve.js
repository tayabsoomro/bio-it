var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;



// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


// Scale the range of the data
x.domain([0,2]);
y.domain([0,14]);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".titrationRender").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class","mainSVG")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json('./assets/data/diproticGraphData.json', function(error,data){
    if(error) throw error;
    console.log(data);

    data.forEach(function(d){
           d.y_pH = +d.y_pH;
           d.x_OH = +d.x_OH;
    });

    var vline = d3.line()
        .curve(d3.curveLinear)
        .x(function(d){ return x(d.x_OH); })
        .y(function(d){ return y(d.y_pH); });


    xAxis = d3.axisBottom(x).tickValues([]);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add x Axis text
    svg.append("text")
        .text("OH added (equivalents) ")
        .attr("transform", "translate(" +  width/2 + "," + (height + 40) + ")");


    yAxis = d3.axisLeft(y).tickValues([]);

    // Add the Y Axis
    svg.append("g")
        .call(yAxis);

    // Add y Axis text
    svg.append("text")
        .text("pH")
        .attr("transform", "translate(-40," + (height /2) + ") rotate(-90)");


    path = svg.append("path")
        .attr("d", vline(data))
        .attr("class", "line");
});
