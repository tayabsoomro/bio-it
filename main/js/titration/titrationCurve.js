// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


// Scale the range of the data
x.domain([0,2]);
y.domain([0,20]);


// Global Amination Variables
var clickStackNum = 0;

// disable all buttons button
d3.select("#btn-rev").attr("disabled","");
d3.select("#btn-fwd").attr("disabled","");

var path1,path2,path3,path4;

function titrationGlycine(){

    d3.select(".mainSVG").remove();

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

    d3.json("https://tayabsoomro.github.io/interactive-biochemistry-module/main/data/glycine-tt.json", function(error, data) {

        if (error) throw error;


        data.axis.forEach(function(d){
           d.forEach(function(m){
               m.pH = +m.pH;
               m.eOH = +m.eOH;
           });
        });

        var vline = d3.line()
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

        d3.select("#btn-fwd").attr("disabled",null);


        d3.select("#btn-fwd").on("click",function(){
            d3.select("#btn-fwd").attr("disabled","");
            d3.select("#btn-rev").attr("disabled",null);
            drawStage();
            clickStackNum++;
        });

        d3.select("#btn-rev").on("click",function(){
            d3.select("#btn-rev").attr("disabled","");
            clickStackNum--;
            undrawStage();
        });


        function drawStage(){

            if(clickStackNum == 0) { // Stage 1

                // Draw Curve
                path1 = drawCurve(path1,data);

            } else if (clickStackNum == 1){

                path2 = drawCurve(path2,data);
            } else if(clickStackNum == 2){
                path3 = drawCurve(path3,data);
            } else if(clickStackNum == 3){
                path4 = drawCurve(path4,data);
            }
        }

        function undrawStage(){
            if(clickStackNum == 0){
                    unDrawCurve(path1);
            }
            else if(clickStackNum == 1){

                unDrawCurve(path2);
            } else if (clickStackNum == 2){
                unDrawCurve(path3);
            } else if (clickStackNum == 3){
                unDrawCurve(path4);
            }
        }

        function drawCurve(path,data){
            path = svg.append("path")
                .attr("d", vline(data.axis[clickStackNum]))
                .attr("class", "line");

            var totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .on("end",function(){

                    br = clickStackNum == 1 || clickStackNum == 2 ? 0 : 1;
                    charges = data.bregions[br].charges;

                    if(clickStackNum == 2){
                        svg.append("text")
                            .text("0")
                            .attr("class","charge0")
                            .attr("x",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) -20)
                            .attr("y",y(data.bregions[0].pKa[1]+3.5));


                        svg.append("text")
                            .text("pI: " + data.pI)
                            .attr("class","pIValue")
                            .attr("x",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]))
                            .attr("y",y(data.bregions[0].pKa[1]+3.5) + 15);

                        svg.append("circle")
                            .attr("class","pIValue")
                            .attr("cx",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) - 5)
                            .attr("cy", y(data.bregions[0].pKa[1]+3.5) + 15)
                            .attr("r", 5);


                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/glycine2.png")
                            .attr("class","eqtn2")
                            .attr("x", x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) -50)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);
                    }

                    if(clickStackNum == 1){

                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/glycine1.png")
                            .attr("class","eqtn1")
                            .attr("x", x(data.bregions[br].pKa[0]/2) -20)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);


                        svg.append("text")
                            .text("pKa: " + data.bregions[0].pKa[1])
                            .attr("class","pka1text")
                            .attr("x", x(data.bregions[0].pKa[0]) + 10)
                            .attr("y", y(data.bregions[0].pKa[1]) - 10);

                        svg.append("circle")
                            .attr("class","pka1circle")
                            .attr("cx", x(data.bregions[0].pKa[0]))
                            .attr("cy", y(data.bregions[0].pKa[1]))
                            .attr("r", 5);
                    }

                    if(clickStackNum == 4){

                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/glycine3.png")
                            .attr("class","eqtn3")
                            .attr("x",x(data.bregions[br].pKa[0]) -10)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);

                    }

                    if(clickStackNum == 3){
                        svg.append("text")
                            .text("pKa: " + data.bregions[1].pKa[1])
                            .attr("class","pka2text")
                            .attr("x", x(data.bregions[1].pKa[0]) + 10)
                            .attr("y", y(data.bregions[1].pKa[1]) - 10);

                        svg.append("circle")
                            .attr("class","pka2circle")
                            .attr("cx", x(data.bregions[1].pKa[0]))
                            .attr("cy", y(data.bregions[1].pKa[1]))
                            .attr("r", 5);

                    }


                    svg.append("text")
                        .text(charges[(clickStackNum-1)%2])
                        .attr("class","charge" + clickStackNum)
                        .attr("x", function() {
                            if(clickStackNum == 1){
                                return x(data.bregions[br].pKa[0]/2);
                            } else if(clickStackNum == 2) {
                                return x(data.bregions[br].pKa[0]);
                            } else if(clickStackNum ==3){
                                return x(data.bregions[br].pKa[0]);
                            } else if(clickStackNum ==4){
                                return x(data.bregions[br].pKa[0]-2);
                            }
                        })
                        .attr("y",function(){
                            if(clickStackNum == 1){
                                return y(data.bregions[br].pKa[1]- 2);
                            } else if(clickStackNum == 2){
                                return y(data.bregions[br].pKa[1]+1);
                            } else if(clickStackNum == 3){
                                return y(data.bregions[br].pKa[1]+1);
                            } else if(clickStackNum ==4) {
                                return y(data.bregions[br].pKa[0] + 15);
                            }
                        });

                    if(clickStackNum < 4) d3.select("#btn-fwd").attr("disabled",null);

                });

            return path;
        }

        function unDrawCurve(path){

            var totalLength = path.node().getTotalLength();

            path
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", totalLength)
                .on("end",function(){
                    if(clickStackNum == 0){
                        d3.selectAll(".charge1").remove();
                        d3.selectAll(".eqtn1").remove();

                        d3.selectAll(".pka1text").remove();
                        d3.selectAll(".pka1circle").remove();

                    } else if(clickStackNum == 1){
                        d3.selectAll(".charge2").remove();
                        d3.selectAll(".eqtn2").remove();
                        d3.selectAll(".charge0").remove();
                        d3.selectAll(".pIValue").remove();
                    } else if(clickStackNum == 2){

                        d3.selectAll(".charge3").remove();


                        d3.selectAll(".pka2text").remove();
                        d3.selectAll(".pka2circle").remove();
                    } else if(clickStackNum == 3){
                        d3.selectAll(".eqtn3").remove();
                    }

                    if(clickStackNum > 0) d3.select("#btn-rev").attr("disabled",null);
                });

        }


    });
}


function titrationHistidine(){

    d3.select(".mainSVG > *").remove();

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


    d3.json("http://localhost/BMSCApp/main/data/histidine-tt.json", function(error, data) {

        data.axis.forEach(function(d){
            d.forEach(function(m){
                m.pH = +m.pH;
                m.eOH = +m.eOH;
            });
        });

        var vline = d3.line()
            .curve(d3.curveBasis)
            .x(function(d){ return x(d.eOH); })
            .y(function(d){ return y(d.pH); });

        x.domain([0,3]);
        y.domain([0,14]);

        xAxis = d3.axisBottom(x)
            .tickValues([0,1,2,3]);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add x Axis text
        svg.append("text")
            .text("OH added (equivalents) ")
            .attr("transform", "translate(" +  width/2 + "," + (height + 40) + ")");

        yAxis = d3.axisLeft(y)
            .tickValues([0,2,4,6,8,10]);

        // Add the Y Axis
        svg.append("g")
            .call(yAxis);

        // Add y Axis text
        svg.append("text")
            .text("pH")
            .attr("transform", "translate(-40," + (height /2) + ") rotate(-90)");


        d3.select("#btn-fwd").attr("disabled",null);


        d3.select("#btn-fwd").on("click",function(){
            d3.select("#btn-fwd").attr("disabled","");
            d3.select("#btn-rev").attr("disabled",null);
            drawStage();
            clickStackNum++;
        });

        d3.select("#btn-rev").on("click",function(){
            d3.select("#btn-rev").attr("disabled","");
            d3.select("#btn-fwd").attr("disabled",null);
            clickStackNum--;
            undrawStage();
        });

        function drawStage(){

            if(clickStackNum == 0) { // Stage 1
                path1 = drawCurve(path1,data);
            } else if (clickStackNum == 1){

                path2 = drawCurve(path2,data);
            } else if(clickStackNum == 2){
                path3 = drawCurve(path3,data);
            } else if(clickStackNum == 3){
                path4 = drawCurve(path4,data);
            }
        }

        function undrawStage(){
            if(clickStackNum == 0){
              unDrawCurve(path1);
            } else if(clickStackNum == 1){
              unDrawCurve(path2);
            } else if(clickStackNum == 2){
              unDrawCurve(path3);
            } else if(clickStackNum == 3){
              unDrawCurve(path4);
            }
        }

        function drawCurve(path,data){

          console.log(clickStackNum);

            path = svg.append("path")
                .attr("d", vline(data.axis[clickStackNum]))
                .attr("class", "line");

            var totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .on("end",function(){

                    br = clickStackNum == 1 || clickStackNum == 2 ? 0 : 1;
                    charges = data.bregions[br].charges;

                    if(clickStackNum == 2){
                        svg.append("text")
                            .text("0")
                            .attr("class","charge0")
                            .attr("x",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) -20)
                            .attr("y",y(data.bregions[0].pKa[1]+3.5));


                        svg.append("text")
                            .text("pI: " + data.pI)
                            .attr("class","pIValue")
                            .attr("x",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]))
                            .attr("y",y(data.bregions[0].pKa[1]+3.5) + 15);

                        svg.append("circle")
                            .attr("class","pIValue")
                            .attr("cx",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) - 5)
                            .attr("cy", y(data.bregions[0].pKa[1]+3.5) + 15)
                            .attr("r", 5);

                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/histidine2.png")
                            .attr("class","eqtn2")
                            .attr("x", x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) -50)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);

                    }

                    if(clickStackNum == 1){

                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/histidine1.png")
                            .attr("class","eqtn1")
                            .attr("x", x(data.bregions[br].pKa[0]/2) -20)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);


                        svg.append("text")
                            .text("pKa: " + data.bregions[0].pKa[1])
                            .attr("class","pka1text")
                            .attr("x", x(data.bregions[0].pKa[0]) + 10)
                            .attr("y", y(data.bregions[0].pKa[1]) - 10);

                        svg.append("circle")
                            .attr("class","pka1circle")
                            .attr("cx", x(data.bregions[0].pKa[0]))
                            .attr("cy", y(data.bregions[0].pKa[1]))
                            .attr("r", 5);
                    }

                    if(clickStackNum == 4){

                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/histidine4.png")
                            .attr("class","eqtn3")
                            .attr("x",x(data.bregions[br].pKa[0]+0.7))
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);

                    }

                    if(clickStackNum == 3){
                        svg.append("text")
                            .text("pKa: " + data.bregions[1].pKa[1])
                            .attr("class","pka2text")
                            .attr("x", x(data.bregions[1].pKa[0]) + 10)
                            .attr("y", y(data.bregions[1].pKa[1]) - 10);

                        svg.append("circle")
                            .attr("class","pka2circle")
                            .attr("cx", x(data.bregions[1].pKa[0]))
                            .attr("cy", y(data.bregions[1].pKa[1]))
                            .attr("r", 5);

                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/histidine3.png")
                            .attr("class","eqtn3")
                            .attr("x",x(data.bregions[br].pKa[0]) -10)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);

                    }

                    if(clickStackNum == 4){
                        svg.append("text")
                            .text("pKa: " + data.bregions[2].pKa[1])
                            .attr("class","pka3text")
                            .attr("x", x(data.bregions[2].pKa[0]) + 10)
                            .attr("y", y(data.bregions[2].pKa[1]) - 10);

                        svg.append("circle")
                            .attr("class","pka3circle")
                            .attr("cx", x(data.bregions[2].pKa[0]))
                            .attr("cy", y(data.bregions[2].pKa[1]))
                            .attr("r", 5);

                    }


                    svg.append("text")
                        .text(charges[(clickStackNum-1)%2])
                        .attr("class","charge" + clickStackNum)
                        .attr("x", function() {
                            if(clickStackNum == 1){
                                return x(data.bregions[br].pKa[0]/2);
                            } else if(clickStackNum == 2) {
                                return x(data.bregions[br].pKa[0]) + 25;
                            } else if(clickStackNum ==3){
                                return x(data.bregions[br].pKa[0]);
                            } else if(clickStackNum ==4){
                                return x(data.bregions[br].pKa[0]-2);
                            }
                        })
                        .attr("y",function(){
                            if(clickStackNum == 1){
                                return y(data.bregions[br].pKa[1]);
                            } else if(clickStackNum == 2){
                                return y(data.bregions[br].pKa[1]+1);
                            } else if(clickStackNum == 3){
                                return y(data.bregions[br].pKa[1]+1);
                            } else if(clickStackNum ==4) {
                                return y(data.bregions[br].pKa[0] + 15);
                            }
                        });

                    if(clickStackNum < 4) d3.select("#btn-fwd").attr("disabled",null);

                });

            return path;
        }


        function unDrawCurve(path){

            var totalLength = path.node().getTotalLength();

            path
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", totalLength)
                .on("end",function(){
                    if(clickStackNum == 0){
                        d3.selectAll(".charge1").remove();
                        d3.selectAll(".eqtn1").remove();

                        d3.selectAll(".pka1text").remove();
                        d3.selectAll(".pka1circle").remove();

                    } else if(clickStackNum == 1){
                        d3.selectAll(".charge2").remove();
                        d3.selectAll(".eqtn2").remove();
                        d3.selectAll(".charge0").remove();
                        d3.selectAll(".pIValue").remove();
                    } else if(clickStackNum == 2){

                        d3.selectAll(".charge3").remove();


                        d3.selectAll(".pka2text").remove();
                        d3.selectAll(".pka2circle").remove();
                    } else if(clickStackNum == 3){
                        d3.selectAll(".pka3text").remove();
                        d3.selectAll(".pka3circle").remove();
                        d3.selectAll(".eqtn3").remove();
                    }

                    if(clickStackNum > 0) d3.select("#btn-rev").attr("disabled",null);
                });

        }


    });
}



function titrationAlanine(){

    d3.select(".mainSVG").remove();

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


    d3.json("https://tayabsoomro.github.io/interactive-biochemistry-module/main/data/alanine-tt.json", function(error, data) {

        if (error) throw error;


        data.axis.forEach(function(d){
            d.forEach(function(m){
                m.pH = +m.pH;
                m.eOH = +m.eOH;
            });
        });

        var vline = d3.line()
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

        d3.select("#btn-fwd").attr("disabled",null);


        d3.select("#btn-fwd").on("click",function(){
            d3.select("#btn-fwd").attr("disabled","");
            d3.select("#btn-rev").attr("disabled",null);
            drawStage();
            clickStackNum++;
        });

        d3.select("#btn-rev").on("click",function(){
            d3.select("#btn-rev").attr("disabled","");
            clickStackNum--;
            undrawStage();
        });


        function drawStage(){

            if(clickStackNum == 0) { // Stage 1

                // Draw Curve
                path1 = drawCurve(path1,data);

            } else if (clickStackNum == 1){

                path2 = drawCurve(path2,data);
            } else if(clickStackNum == 2){
                path3 = drawCurve(path3,data);
            } else if(clickStackNum == 3){
                path4 = drawCurve(path4,data);
            }
        }

        function undrawStage(){
            if(clickStackNum == 0){
                unDrawCurve(path1);
            }
            else if(clickStackNum == 1){

                unDrawCurve(path2);
            } else if (clickStackNum == 2){
                unDrawCurve(path3);
            } else if (clickStackNum == 3){
                unDrawCurve(path4);
            }
        }

        function drawCurve(path,data){
            path = svg.append("path")
                .attr("d", vline(data.axis[clickStackNum]))
                .attr("class", "line");

            var totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .on("end",function(){

                    br = clickStackNum == 1 || clickStackNum == 2 ? 0 : 1;
                    charges = data.bregions[br].charges;

                    if(clickStackNum == 2){
                        svg.append("text")
                            .text("0")
                            .attr("class","charge0")
                            .attr("x",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) -20)
                            .attr("y",y(data.bregions[0].pKa[1]+3.5));


                        svg.append("text")
                            .text("pI: " + data.pI)
                            .attr("class","pIValue")
                            .attr("x",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]))
                            .attr("y",y(data.bregions[0].pKa[1]+3.5) + 15);

                        svg.append("circle")
                            .attr("class","pIValue")
                            .attr("cx",x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) - 5)
                            .attr("cy", y(data.bregions[0].pKa[1]+3.5) + 15)
                            .attr("r", 5);


                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/alanine2.png")
                            .attr("class","eqtn2")
                            .attr("x", x(data.bregions[1].pKa[0] - data.bregions[0].pKa[0]) -50)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);
                    }

                    if(clickStackNum == 1){

                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/alanine1.png")
                            .attr("class","eqtn1")
                            .attr("x", x(data.bregions[br].pKa[0]/2) -20)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);


                        svg.append("text")
                            .text("pKa: " + data.bregions[0].pKa[1])
                            .attr("class","pka1text")
                            .attr("x", x(data.bregions[0].pKa[0]) + 10)
                            .attr("y", y(data.bregions[0].pKa[1]) - 10);

                        svg.append("circle")
                            .attr("class","pka1circle")
                            .attr("cx", x(data.bregions[0].pKa[0]))
                            .attr("cy", y(data.bregions[0].pKa[1]))
                            .attr("r", 5);
                    }

                    if(clickStackNum == 4){

                        svg.append("svg:image")
                            .attr("xlink:href", "http://localhost/BMSCApp/main/images/alanine3.png")
                            .attr("class","eqtn3")
                            .attr("x",x(data.bregions[br].pKa[0]) -10)
                            .attr("y",20)
                            .attr("height", 100)
                            .attr("width", 100);

                    }

                    if(clickStackNum == 3){
                        svg.append("text")
                            .text("pKa: " + data.bregions[1].pKa[1])
                            .attr("class","pka2text")
                            .attr("x", x(data.bregions[1].pKa[0]) + 10)
                            .attr("y", y(data.bregions[1].pKa[1]) - 10);

                        svg.append("circle")
                            .attr("class","pka2circle")
                            .attr("cx", x(data.bregions[1].pKa[0]))
                            .attr("cy", y(data.bregions[1].pKa[1]))
                            .attr("r", 5);

                    }


                    svg.append("text")
                        .text(charges[(clickStackNum-1)%2])
                        .attr("class","charge" + clickStackNum)
                        .attr("x", function() {
                            if(clickStackNum == 1){
                                return x(data.bregions[br].pKa[0]/2);
                            } else if(clickStackNum == 2) {
                                return x(data.bregions[br].pKa[0]);
                            } else if(clickStackNum ==3){
                                return x(data.bregions[br].pKa[0]);
                            } else if(clickStackNum ==4){
                                return x(data.bregions[br].pKa[0]-2);
                            }
                        })
                        .attr("y",function(){
                            if(clickStackNum == 1){
                                return y(data.bregions[br].pKa[1]- 2);
                            } else if(clickStackNum == 2){
                                return y(data.bregions[br].pKa[1]+1);
                            } else if(clickStackNum == 3){
                                return y(data.bregions[br].pKa[1]+1);
                            } else if(clickStackNum ==4) {
                                return y(data.bregions[br].pKa[0] + 15);
                            }
                        });

                    if(clickStackNum < 4) d3.select("#btn-fwd").attr("disabled",null);

                });

            return path;
        }

        function unDrawCurve(path){

            var totalLength = path.node().getTotalLength();

            path
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", totalLength)
                .on("end",function(){
                    if(clickStackNum == 0){
                        d3.selectAll(".charge1").remove();
                        d3.selectAll(".eqtn1").remove();

                        d3.selectAll(".pka1text").remove();
                        d3.selectAll(".pka1circle").remove();

                    } else if(clickStackNum == 1){
                        d3.selectAll(".charge2").remove();
                        d3.selectAll(".eqtn2").remove();
                        d3.selectAll(".charge0").remove();
                        d3.selectAll(".pIValue").remove();
                    } else if(clickStackNum == 2){

                        d3.selectAll(".charge3").remove();


                        d3.selectAll(".pka2text").remove();
                        d3.selectAll(".pka2circle").remove();
                    } else if(clickStackNum == 3){
                        d3.selectAll(".eqtn3").remove();
                    }

                    if(clickStackNum > 0) d3.select("#btn-rev").attr("disabled",null);
                });

        }


    });
}
