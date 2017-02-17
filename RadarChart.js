var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
     radius: 5,
     w: 600,
     h: 600,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.3,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 100,
     ExtraWidthY: 100,
     color: d3.scaleOrdinal(d3.schemeCategory10)
    };
	
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    function compare(a,b) {
      if (a.total > b.total)
        return -1;
      if (a.total < b.total)
        return 1;
      return 0;
    }
    var unsorted = d
    d = d.sort(compare)
    var data = d
    cfg.maxValue = 160;
    
    // var allAxis = (d[0].map(function(i, j){return i.area}));
    //console.log(d[0])
    var allAxis = (d[0].axis.map(function(i, j){return i.stat}));
    //console.log(allAxis)
    var total = allAxis.length;
    //console.log(total)
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    //d3.select(id).select("svg").remove();

    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

	  //var tooltip;
    var tooltip = d3.select("body").append("div").attr("class", "toolTip").attr('id','toolTip');
    //Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text((j+1)*cfg.maxValue/cfg.levels);
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

    for (var key in d) {
      // d.forEach(function(y, x){
        // d[key].axis.forEach(function(y, x){
        // console.log(y,x)
        dataValues = [];
        //g.selectAll(".nodes")
        //.data(y, function(j, i){
        for (var ax in d[key].axis){
          var j = d[key].axis[ax]
          var i = ax
          //console.log(j)
          // console.log(j,i)
          dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
        }//);
        //console.log(dataValues)
        dataValues.push(dataValues[0]);
        g.selectAll(".stat")
               .data([dataValues])
               .enter()
               .append("polygon")
               .attr("class", "radar-chart-serie"+series)
               .attr('id',key)
               .style("stroke-width", "2px")
               .style("stroke",function(j,i){
                return data[this.id].color
               })
               .attr("points",function(d) {
                  //console.log(data[this.id].color)
                 var str="";
                 for(var pti=0;pti<d.length;pti++){
                   str=str+d[pti][0]+","+d[pti][1]+" ";
                 }
                 return str;
                })
               .style("fill", function(j, i){
                return data[this.id].color
                // return cfg.color(series)
              })
               .style("fill-opacity", cfg.opacityArea)
               .on('mouseover', function (d){
                        z = "polygon."+d3.select(this).attr("class");
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", 0.1); 
                        g.selectAll(z)
                         .transition(200)
                         .style("fill-opacity", .7);
                         })
               .on('mousemove', function(){
                          tooltip
                          // .style("left", d3.mouse(this)[0]-(tooltip.width/2)+125 + "px")
                          // .style("top", d3.mouse(this)[1]+40+ "px")
                          // .style("left", d3.event.pageX -80 + "px")
                          // .style("top", d3.event.pageY-50 + "px")
                          .style("display", "inline-block")
                         .html((data[this.id].name))
                         .style("left", d3.mouse(this)[0]-(document.getElementById("toolTip").getBoundingClientRect().width/2)+101+cfg.TranslateX + "px")
                         .style("top", d3.mouse(this)[1]+35+ "px")
                        })
               .on('mouseout', function(){
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", cfg.opacityArea);
                        tooltip.style("display", "none");
               });
      // for (var ax in d[key].axis){
      //   var y = d[key].axis[ax]
      //   dataValues = []
      //   console.log(y)
        g.selectAll(".nodes")
          .data(d[key].axis).enter()
          .append("circle")
        .attr("class", "radar-chart-serie"+series)
        .attr('id',key)
        .attr('r', cfg.radius)
        .attr("alt", function(j){
          // console.log(j)
          return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          // console.log(j,i)
          dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){ 
          // console.log(j) 
          return j.stat})
        .style("fill", function(j,i){
          return data[this.id].color
        })//cfg.color(series))
        .style("stroke-width", "2px")
        .style("stroke", function(j,i){
          return data[this.id].color
        })//cfg.color(series))
        .style("fill-opacity", .9)
        .on('mouseover', function (d){
          //console.log(d.stat)
              tooltip
                .style("display", "inline-block")
                .html((data[this.id].name)+"<br>"+(d.stat) + "<br><span>" + (d.value) + "</span>")
                .style("left", d3.mouse(this)[0]-(document.getElementById("toolTip").getBoundingClientRect().width/2)+101+cfg.TranslateX + "px")
                .style("top", d3.event.pageY - 95 + "px")
              })
         .on("mouseout", function(d){ tooltip.style("display", "none");});
        // }    
        series++;
      };
      series=0;
    }


// var tooltip = d3.select("body").append("div").attr("class", "toolTip");
//     d.forEach(function(y, x){
//       console.log(y,x)
//       g.selectAll(".nodes")
//       .data(y).enter()
//       .append("svg:circle")
//       .attr("class", "radar-chart-serie"+series)
//       .attr('r', cfg.radius)
//       .attr("alt", function(j){return Math.max(j.value, 0)})
//       .attr("cx", function(j, i){
//         dataValues.push([
//         cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
//         cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
//       ]);
//       return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
//       })
//       .attr("cy", function(j, i){
//         return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
//       })
//       .attr("data-id", function(j){return j.area})
//       .style("fill", cfg.color(series))
//       .style("stroke-width", "2px")
//       .style("stroke", cfg.color(series)).style("fill-opacity", .9)
//       .on('mouseover', function (d){
//         console.log(d.area)
//             tooltip
//               .style("left", d3.event.pageX - 40 + "px")
//               .style("top", d3.event.pageY - 80 + "px")
//               .style("display", "inline-block")
//       				.html((d.area) + "<br><span>" + (d.value) + "</span>");
//             })
//     		.on("mouseout", function(d){ tooltip.style("display", "none");});

//       series++;
//     });
    // }
};