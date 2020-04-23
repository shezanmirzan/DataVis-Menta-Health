/*
 * script.js
 * Copyright (C) 2020 Jay Panchal <jpanchal@umass.edu>
 *
 * Distributed under terms of the MIT license.
 */
// TODO: Fix legend overlap on bars
// TODO: Fix y-axis redrawing to variable scale to fixed max scale across years
var margin = {
        top: 20,
        right: 20,
        bottom: 60,
        left: 40
    },
    width = 560 - margin.left - margin.right,
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
    .range(["green", "red"]);

var svg = d3.select('body').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json", function(error, yearData) {
    drawChart(yearData[2016]);

    // SLIDER
    var slider = svg.append('g')
        .classed('slider', true)
        .attr('transform', "translate(" + (margin.left - 10) + ", " + (height + margin.bottom - 30) + ")");

    var slideScale = d3.scale.linear()
        .domain([0, 1])
        .range([0, width - margin.left - margin.right])
        .clamp(true);

    var rangeValues = [0, 1];

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

    var tickValues = [2016, 2019];

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
        var foundIndex = 0
        if (x < midPoint) {
            foundIndex = index;
        } else {
            foundIndex = index + 1;
        }

        cx = slideScale(rangeValues[foundIndex]);
        xVal = rangeValues[foundIndex];

        handle.attr('cx', cx);
        d3.selectAll("svg > g > :not(.slider)").remove();
        drawChart(yearData[tickValues[foundIndex]]);
    }
});

function drawChart(data) {
    var categoriesNames = data.map(function(d) {
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

    // svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = svg.selectAll(".slice")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
            return "translate(" + x0(d.categorie) + ",0)";
        });

    // BARS
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
            tooltip.style("display", "inline");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(d.rate));
            tooltip.style("display", "none");
        })
        .on("mousemove", function(d) {
            var transform = d3.select(this.parentElement).attr("transform");
            var translate = d3.transform(transform).translate;
            var xPosition = translate[0] + d3.mouse(this)[0] - 15;
            var yPosition = translate[1] + d3.mouse(this)[1] - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text(d.value);
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

    // TOOLTIP
    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
        
    tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);
    
    tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    // LEGEND
    var legend = svg.selectAll(".legend")
        .data(data[0].values.map(function(d) {
            return d.rate;
        }).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        })
        .style("opacity", "1");

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
