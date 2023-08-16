var svg = d3.select("svg")
width = +svg.attr("width"), 
height = +svg.attr("height");

svg.append("circle").attr("cx",10).attr("cy",40).attr("r", 6).style("fill", "red").style("stroke", "black");
svg.append("circle").attr("cx",10).attr("cy",60).attr("r", 6).style("fill", "orange").style("stroke", "black");
svg.append("circle").attr("cx",10).attr("cy",80).attr("r", 6).style("fill", "yellow").style("stroke", "black");
svg.append("circle").attr("cx",10).attr("cy",100).attr("r", 6).style("fill", "green").style("stroke", "black");
svg.append("circle").attr("cx",10).attr("cy",120).attr("r", 6).style("fill", "pink").style("stroke", "black");
svg.append("circle").attr("cx",10).attr("cy",140).attr("r", 6).style("fill", "lightblue").style("stroke", "black");
svg.append("circle").attr("cx",10).attr("cy",160).attr("r", 6).style("fill", "gray").style("stroke", "black");
svg.append("circle").attr("cx",10).attr("cy",180).attr("r", 6).style("fill", "white").style("stroke", "black");

svg.append("text").attr("x", 20).attr("y", 45).text("Serum Cholesterol").style("font-size", "15px");
svg.append("text").attr("x", 20).attr("y", 65).text("Blood Pressure").style("font-size", "15px");
svg.append("text").attr("x", 20).attr("y", 85).text("Caffeine").style("font-size", "15px");
svg.append("text").attr("x", 20).attr("y", 105).text("Diet").style("font-size", "15px");
svg.append("text").attr("x", 20).attr("y", 125).text("Physical Activity").style("font-size", "15px");
svg.append("text").attr("x", 20).attr("y", 145).text("Psychosocial Factors").style("font-size", "15px");
svg.append("text").attr("x", 20).attr("y", 165).text("Smoking").style("font-size", "15px");
svg.append("text").attr("x", 20).attr("y", 185).text("Undefined").style("font-size", "15px");

async function init() {

    const data = await d3.json('https://raw.githubusercontent.com/el-wittmer/Paul_1963/data/Paul_1965.json');
    const color = ["red", 'orange', 'yellow', 'green', '#a569bd', 'pink', 'purple', 'lightblue', 'gray', 'white'];

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
    .id(function(d) {return d.Id;}))
    .force("charge", d3.forceManyBody())
    .force("center",d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(25));

    var nodes = data.nodes;
    simulation.nodes(nodes)

    var links = data.links;
    simulation.force("link").links(links);

    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    var linksel = svg.append("g").attr("class", "link")
    .selectAll("line").data(links).enter().append("line")

    var nodesel = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

    nodesel.append("circle")
    .attr("r", 20)
    .style("fill", function(d, i) {return color[d.Cluster]})
    .on("mouseover", function(d) {	
            div.transition()			
                .style("opacity", .9);		
            div	.html("First Author: " + d.First_Author +
                "<br>Title: " + d.Title + 
                "<br>Publication Year: " + d.Publication_Year + 
                "<br>Publication Source: " + d.Publication_Source + 
                "<br>Topic: " + d.Topic)
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()			
                .style("opacity", 0);	
        });

    nodesel.append("text")
    .attr("transform","translate(0,6)")
    .text(function (d) {return d.Id; });
    
    simulation.on("tick", ticked);

    function ticked() {
    linksel.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    nodesel.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
    });
    }
    function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }
    function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    }
    function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
}