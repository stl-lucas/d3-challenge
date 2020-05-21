var svgWidth = 800;
var svgHeight = 500;

var margin = {
top: 30,
right: 30,
bottom: 30,
left: 30
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);

    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.poverty), d3.max(censusData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.healthcare), d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.selectAll(".dot")
        .data(censusData)
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("stroke", "white")
        .text(d => d.abbr);

    var toolTip = d3.select("body").append("div")
        .attr("class", "tooltip");

    chartGroup.on("mouseover", function(d, i) {
        toolTip.style("display", "block");
        toolTip.html(`Healthcare: <strong>${censusData[i].healthcare}</strong><hr/>Poverty: <strong>${censusData[i].poverty}</strong>`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
        .on("mouseout", function() {
        toolTip.style("display", "none");
        });

}).catch(function(error) {
    console.log(error);
});