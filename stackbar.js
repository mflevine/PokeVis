var tooltip = d3.select("body").append("div").attr("class", "toolTip").attr('id','stackbartoolTip');
var svg = d3.select("#stackbar"),
    margin = {top: 20, right: 80, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var colortogen = {"#98abc5":'1', "#8a89a6":'2', "#7b6888":'3', "#6b486b":'4', "#a05d56":'5', "#d0743c":'6', "#ff8c00":'7'}

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

d3.csv("norStackData.csv", type, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return a[data.columns[1]] / a.total - b[data.columns[1]] / b.total; });

  x.domain(data.map(function(d) { return d.type; }));
  z.domain(data.columns.slice(1));

  var serie = g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); });

  var tooltip = d3.select("body").append("div").attr("class", "StacktoolTip").attr("style", "z-index: 30");
	  
  serie.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.type); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
	  .on("mouseover", function(d,i) {
                  tooltip
                        .style("left", d3.event.pageX - 95 + "px")
                        .style("top", d3.event.pageY - 120 + "px")
                        .style("display", "inline-block")
						.attr("fill", "black")
                        .html("<font>"+"Generation: " + colortogen[this.parentNode.getAttribute('fill')] + "<br>Type: "+d.data.type+"<br>"+"Number of Pokemon: "+ Math.round((d[1] - d[0])*d.data.total) + "</font>" );
              }) 
      .on("mouseout", function(d) {
                  tooltip.style("display", "none");});

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (1*height) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text").attr("fill", "white").style('font-size',10);

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
      .selectAll("text").attr("fill", "white").style('font-size',12);

  var legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.type) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });

  legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "white");

  legend.append("text")
      .attr("x", 9)
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .style("font", "10px sans-serif")
      .text(function(d) { return 'Generation ' + d.key.split('gen')[1]; });
});

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}