var svg = d3.select("svg")
width = +svg.attr("width"), 
height = +svg.attr("height");

async function init() {

    const data = await d3.json('https://raw.githubusercontent.com/el-wittmer/Paul_1963/main/data/Paul_1963.json');
    const color = ["red", 'orange', 'yellow', 'green', '#a569bd', 'pink', 'purple', 'lightblue', 'gray', 'white'];

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
    .id(function(d) {return d.Id;}))
    .force("charge", d3.forceManyBody())
    .force("center",d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(35));

    var nodes = data.nodes;
    simulation.nodes(nodes)

    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

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
    .attr("fill", function(d, i) {return data})
    .on("mouseover", function(d) {	
            div.transition()			
                .style("opacity", .9);		
            div	.html("First Author: " + d.First_Author +
                "<br>Title: " + d.Title + 
                "<br>Publication Year: " + d.Publication_Year + 
                "<br>Publication Source: " + d.Publication_Source + 
                "<br>Topic: " + d.Cluster_Name)
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