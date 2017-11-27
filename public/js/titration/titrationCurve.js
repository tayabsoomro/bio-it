// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


// append the svg object to the body of the page
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
y.domain([0,20]);


// Global Amination Variables
var curveDrawn = false;
var pointsShown = false;


var clickStackNum = 0;
var clickStack = [
    ["Erase Curve","Draw Curve"],
    ["Erase pKa","Show pKa"]
];

var path;

function titrationGlycine(){

    d3.json("../../data/glycine-tt.json", function(error, data) {

        if (error) throw error;



        data.axis.forEach(function(d){
            d.pH = +d.pH;
            d.eOH = +d.eOH;
        });

        // define the line
        var valueline = d3.line()
            .curve(d3.curveBasis)
            .x(function(d){ return x(d.eOH); })
            .y(function(d){ return y(d.pH); });


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

        yAxis = d3.axisLeft(y);

        // Add the Y Axis
        svg.append("g")
            .call(yAxis);

        // Add y Axis text
        svg.append("text")
            .text("pH")
            .attr("transform", "translate(-40," + (height /2) + ") rotate(-90)");



        d3.select("#btn-fwd").on("click",function(){
            switch(clickStackNum){
                case 0: // draw the curve
                    drawCurve();
                    clickStackNum++;
                    break;
                case 1:
                    showpKa();
                    clickStackNum++;
                    break;
                case 2:
                    clickStackNum++;
                    break;
                case 3:
                    clickStackNum++;
                    break;
                default:
                    clickStackNum++;
                    break;
            }
            drawCurve();
        });

        d3.select("#btn-rev").on("click",function(){
            unDrawCurve();

        });

        function showpKa(){
            // First region
            charges = data.bregions[0].charges;
            svg.append("text")
                .text(charges[0])
                .attr("x",x(data.bregions[0].pKa[0]/2))
                .attr("y",y(data.bregions[0].pKa[1]- 2));

            svg.append("text")
                .text(charges[1])
                .attr("x",x(data.bregions[0].pKa[0]))
                .attr("y",y(data.bregions[0].pKa[1]+1));

            // Middle Region

            svg.append("text")
                .text("0")
                .attr("x",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) -20)
                .attr("y",y(data.bregions[0].pKa[1]+3.5));

            // Second region

            charges = data.bregions[1].charges;

            svg.append("text")
                .text(charges[0])
                .attr("x",x( data.bregions[1].pKa[0]))
                .attr("y",y( data.bregions[1].pKa[1]+1));

            svg.append("text")
                .text(charges[1])
                .attr("x",x( data.bregions[1].pKa[0] +  data.bregions[1].pKa[0]/4))
                .attr("y",y( data.bregions[1].pKa[1]+1));
        }


        function unDrawCurve(){

            curveDrawn = false;

            var totalLength = path.node().getTotalLength();

            path
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", totalLength);
        }

        function drawCurve(){


            curveDrawn = true;

            // Add the value line path.
            path = svg.append("path")
                .attr("d", valueline(data.axis))
                .attr("class", "line");

            var totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(3000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

            return path;
        }


    });
}

function titrationTriprotic(){ // Draw the triprotic titration curve
    d3.csv("../../data/titration-dp.csv", function(error, data) {

        if (error) throw error;

        svg.selectAll("*").remove();

        // format the data
        data.forEach(function(d) {
            d.oh = +d.oh;
            d.ph = +d.ph;
        });

        var path;

        // define the line
        var valueline = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.oh); })
            .y(function(d) { return y(d.ph); });

        d3.select("#btn-fwd").on("click",function(){
            if(!curveDrawn){
                drawCurve()
            }else{
            }
        });

        d3.select("#btn-rev").on("click",function(){
            if(curveDrawn){
                unDrawCurve()
            } else{
            }
        });

        function unDrawCurve(){

            curveDrawn = false;

            var totalLength = path.node().getTotalLength();

            path
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", totalLength);
        }

        function drawCurve(){


            curveDrawn = true;

            // Add the valueline path.
            path = svg.append("path")
                .attr("d", valueline(data))
                .attr("stroke","red")
                .attr("class", "line");

            var totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(3000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

            return path;
        }

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
};

// Get the data

