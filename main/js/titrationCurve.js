//svg placeholder
var svg;

//define margins of the page, for the svg
var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


// Scale the range of the data
x.domain([0,2]);
y.domain([0,14]);

// clean SVG after each amino acid selection
function drawSVG(){
  d3.select(".mainSVG").remove();

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
    svg = d3.select(".titrationRender").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class","mainSVG")
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
}

// draw diprotic amino acid titration curve
function drawDiprotic(amino_acid){
  drawSVG();
  d3.json('./assets/data/diproticGraphData.json', function(error,data){
      if(error) throw error;

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
      var xyz = svg.append("text")
          .text("OH added (equivalents)")
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

      drawDiproticData(amino_acid);
  });

}

// Find first matched object.
// returns object or false if no matched object was found
function findFirstMatchedObjInArray(key, value, haystack) {
    for(var i = 0; i < haystack.length; i++) {
        if(haystack[i][key] === value) return haystack[i];
    }
    return false;
}

// add the data to the titration curves (pKa values and states)
function drawDiproticData(amino_acid){

  var diprotic_carboxyl_pka_pos = [0.3, 2.2];
  var diprotic_amino_pka_pos = [1.3, 9.2];
  var diprotic_pi_pos = [0.75, 5.8];

  d3.json('./assets/data/pkaValues.json', function(error, data){
    if(error) throw error;

    var aa_data = findFirstMatchedObjInArray('name', amino_acid.toLowerCase(), data);

    svg.append("text")
        .attr("class", "carboxyl_pka")
        .attr("x", x(diprotic_carboxyl_pka_pos[0]))
        .attr("y", y(diprotic_carboxyl_pka_pos[1]))
        .text(aa_data.carboxyl_pka);
    svg.append("text")
        .attr("class", "amino_pka")
        .attr("x", x(diprotic_amino_pka_pos[0]))
        .attr("y", y(diprotic_amino_pka_pos[1]))
        .text(aa_data.amino_pka);
    svg.append("text")
        .attr("class", "isoelectric_point")
        .attr("transform",
              "translate(" + x(diprotic_pi_pos[0]) + ","
                           + y(diprotic_pi_pos[1]) + ") rotate(-45)")
        .text(aa_data.pi + " (pI)");
  });
}

// draw triprotic amino acid titration curve
function drawTriprotic(amino_acid){
  drawSVG();
  d3.json('./assets/data/triproticGraphData.json', function(error,data){
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

      xAxis = d3.axisBottom(x)//.tickValues([]);

      // Add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // Add x Axis text
      svg.append("text")
          .text("OH added (equivalents) ")
          .attr("transform", "translate(" +  width/2 + "," + (height + 40) + ")");

      yAxis = d3.axisLeft(y)//.tickValues([]);

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

      drawTriproticData(amino_acid);
  });
}


// add the data to the titration curves of triprotic amino acids (pKa values and states)
function drawTriproticData(amino_acid){
  d3.json('./assets/data/pkaValues.json', function(error, data){

    var triprotic_carboxyl_pka_pos = [0.3, 2.2];
    var triprotic_amino_pka_pos = [1.625, 10.2];
    var triprotic_side_pka_pos = [0.97, 6.2];
    var triprotic_pi_pos = [0.6, 3.5];
    var triprotic_pi_pos_odd = [1.28, 7.4]

    if(error) throw error;

    var aa_data = findFirstMatchedObjInArray('name', amino_acid.toLowerCase(), data);

    if(amino_acid === "Arginine" || amino_acid === "Lysine"){
      svg.append("text")
          .attr("class", "carboxyl_pka")
          .attr("x", x(triprotic_carboxyl_pka_pos[0]))
          .attr("y", y(triprotic_carboxyl_pka_pos[1]))
          .text(aa_data.carboxyl_pka);
      svg.append("text")
          .attr("class", "side_pka")
          .attr("x", x(triprotic_amino_pka_pos[0]))
          .attr("y", y(triprotic_amino_pka_pos[1]))
          .text(aa_data.side_pka);
      svg.append("text")
          .attr("class", "amino_pka")
          .attr("x", x(triprotic_side_pka_pos[0]))
          .attr("y", y(triprotic_side_pka_pos[1]))
          .text(aa_data.amino_pka);
      svg.append("text")
          .attr("class", "isoelectric_point")
          .attr("transform",
                "translate(" + x(triprotic_pi_pos_odd[0]) + ","
                             + y(triprotic_pi_pos_odd[1]) + ") rotate(-67)")
          .text(aa_data.pi + " (pI)");
    } else{
      svg.append("text")
          .attr("class", "carboxyl_pka")
          .attr("x", x(triprotic_carboxyl_pka_pos[0]))
          .attr("y", y(triprotic_carboxyl_pka_pos[1]))
          .text(aa_data.carboxyl_pka);
      svg.append("text")
          .attr("class", "amino_pka")
          .attr("x", x(triprotic_amino_pka_pos[0]))
          .attr("y", y(triprotic_amino_pka_pos[1]))
          .text(aa_data.amino_pka);
      svg.append("text")
          .attr("class", "side_pka")
          .attr("x", x(triprotic_side_pka_pos[0]))
          .attr("y", y(triprotic_side_pka_pos[1]))
          .text(aa_data.side_pka);
      svg.append("text")
          .attr("class", "isoelectric_point")
          .attr("transform",
                "translate(" + x(triprotic_pi_pos[0]) + ","
                             + y(triprotic_pi_pos[1]) + ") rotate(-67)")
          .text(aa_data.pi + " (pI)");
    }
  });
}
