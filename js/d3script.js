var svg = d3.select("svg"),
	margin = 50,
	diameter = +svg.attr("width"),
	g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["#f4b7a1", "#fff7f4"])
    .interpolate(d3.interpolateHcl);

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(3);

var tooltip = CustomTooltip("movie_tooltip", 240);

d3.json("graph.json", function(error, root) {
  if (error) throw error;

  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  var focus = root,
      nodes = pack(root).descendants(),
      view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", function(d) { return d.parent ? d.children ? "node" : "node--leaf" : "node node--root"; })
    .style("fill", function(d) { return d.children ? color(d.depth) : null; })
    .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
    .on("mouseover", function(d) { if (!d.children && focus === d.parent ) show_details(d, this);} )
    .on("mouseout", function(d) {hide_details(d, this);} )
    // .on("mousemove", function() {return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");})

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
    .style("display", function(d) { return d.parent === root ? "block" : "none"; })
    .style("font-size", function(d) {
      var len = d.data.name.substring(0, d.r / 3).length;
      var size = d.r/3;
      size *= 12 / len;
      size += 1;
      return Math.round(size)+'px';
    })
    .text(function(d) {
      var text = d.data.name.substring(0, d.r / 3);
      return text;
    })
    .text(function(d) { return d.data.name; });

  var node = g.selectAll("circle,text");
    
  svg
    .style("background", color(-1))
    .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      // .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
      .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
      .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
});

function show_details(data, element) {
    //d3.select(element).attr("fill", function(d) { return d3.rgb(fill_color(d.value));});
    var numWithComma = data.size;
    var content = "<span class=\"name\">Rating </span><span class=\"value\">" + data.rank + "</span><br/>";
    content +="<span class=\"name\">Total Gross: </span><span class=\"value\"> $" + commasFormatter(numWithComma) + "</span><br/>";
    tooltip.showTooltip(content, d3.event);
}

function hide_details(data, element) {
    //d3.select(element).attr("fill", function(d) { return d3.rgb(fill_color(d.value));} );
    //d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.value));} );
    tooltip.hideTooltip();
}

function getSize(d) {
  var bbox = this.getBBox(),
      cbbox = this.parentNode.getBBox(),
      scale = Math.min(cbbox.width/bbox.width, cbbox.height/bbox.height);
  d.scale = scale;
}


