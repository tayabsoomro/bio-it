// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.oh); })
    .y(function(d) { return y(d.ph); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".titrationRender").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Scale the range of the data
x.domain([0,2]);
y.domain([0,13]);

// Get the data
d3.csv("../../data/titration-dp.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.oh = +d.oh;
        d.ph = +d.ph;
    });

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    xAxis = d3.axisBottom(x)
        .tickValues([0,0.5,1,1.5,2]);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add x Axis text
    svg.append("text")
        .text("OH added (equivalents) ")
        .attr("transform", "translate(" +  width/2 + "," + (height + 40) + ")");

    yAxis = d3.axisLeft(y)
        // .tickValues([0,7,13]);

    // Add the Y Axis
    svg.append("g")
        .call(yAxis);

    // Add y Axis text
    svg.append("text")
        .text("pH")
        .attr("transform", "translate(-40," + (height /2) + ") rotate(-90)");


});

d3.json("../../data/glycine-tt.json", function(error,data){
    if(error)  throw error;

    numRegions = data.bregions.length;

    bRegions = data.bregions;

    for(var i = 0; i < numRegions; i++) {

        svg.append("text")
            .text("pKa: " + bRegions[i].pKa[1])
            .attr("x", x(bRegions[i].pKa[0]) + 10)
            .attr("y", y(bRegions[i].pKa[1]) - 10);

        svg.append("circle")
            .attr("cx", x(bRegions[i].pKa[0]))
            .attr("cy", y(bRegions[i].pKa[1]))
            .attr("r", 5);

    }

    // First region
    charges = bRegions[0].charges;
    svg.append("text")
        .text(charges[0])
        .attr("x",x(bRegions[0].pKa[0]/2))
        .attr("y",y(bRegions[0].pKa[1]- 2));

    svg.append("text")
        .text(charges[1])
        .attr("x",x(bRegions[0].pKa[0]))
        .attr("y",y(bRegions[0].pKa[1]+1));

    // Middle Region

    svg.append("text")
        .text("0")
        .attr("x",x(bRegions[1].pKa[0] - bRegions[0].pKa[0]) -20)
        .attr("y",y(bRegions[0].pKa[1]+3.5));

    // Second region

    charges = bRegions[1].charges;

    svg.append("text")
        .text(charges[0])
        .attr("x",x(bRegions[1].pKa[0]))
        .attr("y",y(bRegions[1].pKa[1]+1));

    svg.append("text")
        .text(charges[1])
        .attr("x",x(bRegions[1].pKa[0] + bRegions[1].pKa[0]/4))
        .attr("y",y(bRegions[1].pKa[1]+1));


});