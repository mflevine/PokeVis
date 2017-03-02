var svgB = d3.select("#bubblechart"),
				width = +svgB.attr("width");

				var div = d3.select("body").append("div")
						.attr("class", "tooltipbubble")
						.style("opacity", .25);

				function mouseover() {
					div.transition()
						.duration(500)
						.style("opacity", 1).style("display", "inline-block");
				}


				function mouseout() {
					div.transition()
						.duration(50).style("display", "none");
				}


				var h = [];
				//var color = d3.scaleOrdinal(d3.schemeCategory20);
				var color = d3.scaleOrdinal()
										.range(["#ff8c00","#7b6888", "#6b486b","#8a89a6","#d0743c", "#98abc5", "#a05d56"]);
							//generation7, generation3,g4, g2, g6, g1, g5
				var pack = d3.pack()
					.size([width * 3/5, width * 3 /5])
					.padding(1.5);


					
				d3.csv("Pokeweight1-1.csv", function(d) {
					d.weight = +d.weight;

					if (d.weight) return d;
				}, function(error, classes) {
					if (error) throw error;
					var root = d3.hierarchy({children: classes})
						.sum(function(d) { return d.weight; })
						.each(function(d) {
							if (id = d.data.id) {
								var id; 
								d.id = id;
								d.package = d.data.generation;
								d.class = d.data.identifier;
								if (d.data.webid.slice(0,4) == "http") {
									//console.log("dengyu");
									h.push(d.data.webid);
								} else {
									h.push("http://"+"pokeunlock.com/wp-content/uploads/2015/01/"+d.data.webid+".png");
								}
							}
						})
						.sort(function(a, b) { return b.value - a.value;});
					var focus = root;
					var    view;
					var node = svgB.selectAll(".node")
						.data(pack(root).leaves())
						.enter().append("g")
						.attr("class", "node")
						.attr("transform", function(d) { return "translate(" + (d.x+12)  + "," + (d.y + 10) + ")"; });

					node.append("circle")
						.attr("id", function(d) { return d.id; })
						.attr("r", function(d) { return d.r; })
						.on("mouseover", mouseover)
						.on("mousemove", function(d) {
							//console.log(d.id, h[d.id]);
							div
								.html("<span style='color:red; opacity: 1;'><img src="+h[d.id]+" width = '120px' height = '120px' style = 'z-index: 20'></span> <span style='-webkit-text-stroke: 2.5px #000000;color: white;font-weight: 900'><font size = '6' >"+ d.data.identifier +"</font></span>")
								.style("left", (d3.event.pageX + 52) + "px" )
								.style("top", (d3.event.pageY + 20) + "px" );
						})
						.on("mouseout", mouseout)
						.style("fill", function(d) { return color(d.package); });

					node.append("clipPath")
						.attr("id", function(d) { return "clip-" + d.id; })
						.append("use")
						.attr("xlink:href", function(d) { return "#" + d.id; });
                    node.append("title")
                        .text(function(d) {
                            return "Weight: " +　d.data.weight/10 + " kg";
                        })
					var colorArray = ["#98abc5","#8a89a6", "7b6888","#6b486b","#a05d56", "#d0743c", "#ff8c00"]; 
					var legend = svgB.selectAll(".legend")
						.data(colorArray)
						.enter().append("g")
						.attr("class", "legend")
							.attr("transform", function(d, i) {
									return "translate(" +(width * 8 / 11   ) + "," + (70 + i * 20)+ ")";
								});
						legend.append("circle")
								.attr("r", 6)
								.style("fill", function(d) {
									return d;
								});
						legend.append("text")
							.attr("dy", ".25em")
							.attr("dx", "4em")
							.attr("fill","rgba(255, 255, 255, 0.75)")
							.text(function(d, i) {
								return "Generation " + (i + 1);
							});
						

				});