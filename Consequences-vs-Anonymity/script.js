var margin = {
        top: 20,
        right: 20,
        bottom: 60,
        left: 40
    },
    width = 460 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.ordinal()
    .range(["green", "red","yellow"]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//SVG for slider
var svgSlider = d3.select("body").append("svg")
    .attr("width", 100)
    .attr("height", height + margin.top + margin.bottom)
    //.attr("height", 100)
    .append("g")
    .attr("transform", "translate(" + margin.left+"," + margin.top + ")");

var svgImage = d3.select("body").append("svg")
    .attr("width", 400)//width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left +"," + margin.top + ")");

var foundIndex = 0
var curDrop = "Mental";
var curDropIndex = 0;
d3.json("data.json", function(error, yearData) {
    console.log(yearData[2014][0])
    drawChart(yearData[2014][curDropIndex][curDrop]);


    // SLIDER
    var slider = svgSlider.append('g')
        .classed('slider', true)
        //.attr('transform', "translate(" + (margin.left-10) + ", " + (height + margin.bottom - 30) + ")", "rotate(-90)");
        //.attr('transform', "translate(" + (width + margin.left - 300) + ")",  "rotate(90)");
        .attr('transform', "rotate(90)","translate(" + (width + margin.left +300)+")");

    var slideScale = d3.scale.linear()
        .domain([0, 2])
        //.range([0, width - margin.left - margin.right])
        .range([0, height - margin.top - margin.bottom+50])
        .clamp(true);

    var rangeValues = [0, 1, 2];

    slideScale.clamp(true);

    var drag = d3.behavior.drag();
    drag.origin(Object)
        .on("dragend", function() {
            dragged(d3.mouse(this)['0']);
        });

    var track = slider.append('line')
        .attr("class", "track")
        .attr('x1', slideScale.range()[0])
        .attr('x2', slideScale.range()[1]);

    var tickValues = [2014, 2016, 2019];

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0, 15)")
        .selectAll("text")
        .data(slideScale.ticks(2))
        .enter()
        .append("text")
        .attr("x", slideScale)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function(d) {
            return tickValues[d];
        });

    var handle = slider.append('circle')
        .classed('handle', true)
        .attr('r', 8);

    var trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode()))
        .attr('class', "track-overlay").call(drag);

    

    function dragged(value) {
        var x = slideScale.invert(value),
            index = null,
            midPoint, cx, xVal;
        for (var i = 0; i < rangeValues.length - 1; i++) {
            if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                index = i;
                break;
            }
        }
        midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
        foundIndex = 0
        if (x < midPoint) {
            foundIndex = index;
        } else {
            foundIndex = index + 1;
        }

        cx = slideScale(rangeValues[foundIndex]);
        xVal = rangeValues[foundIndex];

        handle.attr('cx', cx);
        d3.selectAll("svg > g > :not(.slider)").remove();
        console.log(foundIndex);


    

        drawChart(yearData[tickValues[foundIndex]][curDropIndex][curDrop]);

    }


     //Dropdown
    //Ation on selection
    var dropdownChange = function() {
        curDrop = d3.select(this).property('value');
        console.log(curDrop)
        if (curDrop=="Physical") {
            curDropIndex=1;
        }
        if (curDrop=="Mental") {
            curDropIndex=0;
        }
            var newData   = yearData[tickValues[foundIndex]][curDropIndex];
           console.log(tickValues[foundIndex])
            //d3.selectAll("svg > g > :not(.dropdown)").remove();
            svg.selectAll("svg > g > :not(.dropdown)").remove();
            drawChart(newData[curDrop]);
    };
    //Option for drop down menu
    var menu = ["Mental", "Physical"];
    //Make drop down
    var dropdown = d3.select("body")
                    .insert("select", "svg")
                    .attr("style", "position:relative; left:" + (margin.left+300) + "px;")
                    .on("change", dropdownChange);
                
    dropdown.selectAll("option")
            .data(menu)
            .enter().append("option")
            .attr("value", function (d) { return d; })
            .text(function (d) {
                 return d//d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
                    }); 

});
function changeImage(){

    svgImage.selectAll("*").remove();
    var filename = "None"
    console.log(foundIndex)
    console.log(curDrop)
    if(foundIndex==0 && curDropIndex==0){
        filename="2014-Mental.png"}
    if(foundIndex==0 && curDropIndex==1){
        filename="2014-Physical.png"}
    if(foundIndex==1 && curDropIndex==0){
        filename="2016-Mental.png"}
    if(foundIndex==1 && curDropIndex==1){
        filename="2016-Physical.png"}
    if(foundIndex==2 && curDropIndex==0){
        filename="hmap20.png"}
    if(foundIndex==2 && curDropIndex==1){
        filename="hmap21.png"}
    
    myimg = svgImage.append('image')
        .attr('xlink:href', filename)
        .attr('width', 300)
        .attr('height', 300)
    }

function drawChart(data) {

    changeImage();
    //Change Image

    console.log(data)
    var categoriesNames = data.map(function(d) {
        console.log(d.categorie)
        return d.categorie;
    });
    var rateNames = data[0].values.map(function(d) {
        return d.rate;
    });

    x0.domain(categoriesNames);
    x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(categorie) {
        return d3.max(categorie.values, function(d) {
            return d.value;
        });
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style('opacity', '1')
        .call(yAxis)

    //label x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Anonymity Status")
      .style("font-weight","bold");

    //label y-axis    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("No of people")
        .style("font-weight","bold"); 
    // svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = svg.selectAll(".slice")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
            return "translate(" + x0(d.categorie) + ",0)";
        });

    slice.selectAll("rect")
        .data(function(d) {
            return d.values;
        })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) {
            return x1(d.rate);
        })
        .style("fill", function(d) {
            return color(d.rate)
        })
        .attr("class", function(d) {
            return "bar-" + color(d.rate)
        })
        .attr("y", function(d) {
            return y(0);
        })
        .attr("height", function(d) {
            return height - y(0);
        })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(d.rate));
        });

    slice.selectAll("rect")
        .transition()
        .delay(function(d) {
            return Math.random() * 1000;
        })
        .duration(1000)
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("height", function(d) {
            return height - y(d.value);
        });

    // LEGEND
    var legend = svg.selectAll(".legend")
        .data(data[0].values.map(function(d) {
            return d.rate;
        }).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i *20 + ")";
        })
        .style("opacity", "1")
        .style("font-weight","bold");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
            return color(d);
        })
        .on("mouseover", function(d) {
            d3.selectAll("[class^=bar-]").style("opacity", "0.1");
            d3.selectAll(".bar-" + color(d)).style("opacity", "1");
        })
        .on("mouseout", function(d) {
            d3.selectAll("[class^=bar-]").style("opacity", "1");
        });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        })
        .on("mouseover", function(d) {
            d3.selectAll("[class^=bar-]").style("opacity", "0.1");
            d3.selectAll(".bar-" + color(d)).style("opacity", "1");
        })
        .on("mouseout", function(d) {
            d3.selectAll("[class^=bar-]").style("opacity", "1");
        });

    // legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
}
