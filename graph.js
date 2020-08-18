var margin1 = {top: 10, right: 40, bottom: 30, left: 125},
    margin2 = { top: 10, right: 10, bottom: 20, left: $(window).width() * 0.6 - $(window).height() * 0.2 },
    width1 = $(window).width() * 0.6 - margin1.left - margin1.right,
    height1 = $(window).height() * 0.6 - margin1.top - margin1.bottom;
    height2 = $(window).height() * 0.2 - margin2.top - margin2.bottom;

  
  
// append the svg object to the body of the page

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin1.left + "," + margin1.top + ")");

var dataSource = "cumulative-co-emissions.csv",
dataSource2 = "CAT-Emission-data-future.csv";

var data1 = true;
// var data1on = false;
   // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      // .domain(d3.extent(data, function(d) { return d.Year; }))
      .range([ 0, width1 ]);
    var x2 = d3.scaleLinear()
      // .domain(d3.extent(data, function(d) { return d.Year; }))
      .range([ 0, width1 ]);
    var xAxis=0;
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height1 + ")")
      // .call(xAxis)
      ;

    // Add Y axis
    var y = d3.scaleLinear()
      // .domain([0, d3.max(data.filter(function(d){return d.Entity==allGroup[0]}), function(d) { return +d.CO; })])
      .range([ height1, 0 ]);

    svg.append("g")
      .attr("class", "y axis")
      // .call(yAxis)
      ;
      
        var line1 = svg
      .append('g')
        .append("path")
        .attr("class", "mainPath")
        // .datum(data.filter(function(d){return d.Entity==allGroup[0]}))
        // .attr("d", d3.line()
        //   .x(function(d) { return x(d.Year) })
        //   .y(function(d) { return y(d.CO) })
        // )
        ;

  //   var area = d3.area()
  // .x(function(d) { return x(d.Year); })
  // .y0(height1)
  // .y1(function(d) { return y(d.CO); });

function updateChart(sourcefile){
if(sourcefile == "cumulative-co-emissions.csv"){
  data1 = true;
}else{
  data1 = false;
}
d3.csv(sourcefile, function(data) {

    // List of groups (here I have one group per column)

    var allGroup = d3.map(data, function(d){return(d.Entity)}).keys();

    // add the options to the button
    d3.select("#nation")
      .selectAll('myOptions')
    	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    // var myColor = d3.scaleOrdinal()
    //   .domain(allGroup)
    //   .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    if(data1){
      xAxis = d3.axisBottom(x).tickArguments([10,".0f"]);
      x
      .domain(d3.extent(data, function(d) { return d.Year; }));
    svg.selectAll(".x.axis")
      // .attr("class", "x axis")
      // .attr("transform", "translate(0," + height1 + ")")
      .transition()
      .duration(3000)
      .call(xAxis);
      
    }
    else{
      xAxis = d3.axisBottom(x2).tickArguments([4,".0f"]);
        x2
        .domain([2020,2050]);
    svg.selectAll(".x.axis")
      // .attr("class", "x axis")
      // .attr("transform", "translate(0," + height1 + ")")
      .transition()
      .duration(3000)
      .call(xAxis);
      }

    // Add Y axis
    y
      .domain([0, data1 ? d3.max(data.filter(function(d){return d.Entity==allGroup[0]}),function(d) { return +d.CO }) : d3.max(data.filter(function(d){return d.Sector=="Macro"}), function(d) { return +d.COm })]);
            var yAxis=data1 ? d3.axisLeft(y).tickFormat(d3.formatPrefix(",.0f",1e6)):d3.axisLeft(y);
    var drawY = svg.selectAll(".y.axis")
      // .attr("class", "y axis")
      .transition()
      .duration(3000)
      .call(yAxis);

    // var y2 = d3.scaleLinear().range([height2, 0]);
    // svg.append("text")
    //     .attr("text-anchor", "end")
    //     .attr("stoke","white")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", -margin1.left+20)
    //     .attr("x", -margin1.top)
    //     .text("measured in tonnes");
    
    // var u = svg.selectAll(".mainPath")
    // .data(data.filter(function(d){return d.Entity==allGroup[0]}), function(d){ return d.Year });

    // Initialize line with first group of the list
    if(data1){
      svg.selectAll(".mainPath")
        .datum(data.filter(function(d){return d.Entity==allGroup[0]}))
        .transition()
        .duration(3000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.Year) })
          .y(function(d) { return y(d.CO) })
        )
        
        // .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 4)
        .style("stroke","white")
        .style("fill", "none");
        
        }else{
          
        svg.selectAll(".mainPath")
        .datum(data.filter(function(d){return d.Sector=="Macro"}))
        .transition()
        .duration(3000)
        	.attr('d',d3.area()
        	.x(function(d) { return x2(d.Year) })
        	.y0(function(d) { return y(d.CO) })
          .y1(function(d) { return y(d.COm) })
        	)
        .style("stroke", "none")
        .style("fill", "white");
        //   .style("stroke-width", 4)
        // .style("fill", "none");
        }
        
//merge
    // u
    // .enter()
    // .append("path")
    // .attr("class","mainPath")
    // .merge(u)
    // .transition()
    // .duration(3000)
    // // .datum(data.filter(function(d){return d.Entity==allGroup[0]}))
    // .attr("d", d3.line()
    //   .x(function(d) { return x(d.Year); })
    //   .y(function(d) { return y(d.CO); }))
    //   .attr("fill", "none")
    //   // .attr("stroke", "steelblue")
    //   .attr("stroke-width", 4)
        
        
    // world line
    // svg.append("path")
    //   .datum(data.filter(function(d){return d.Entity=="World"}))
    //   .attr("class", "worldPath")
    //   .attr("fill", "none")
    //   .attr("stroke-width", 1.5)
    //   .attr("d", d3.line()
    //     .x(function(d) { return x(d.Year) })
    //     .y(function(d) { return y(d.CO) })
    //     );
        

    // A function that update the chart

// var selectedG = d3.select("#selectButton").property("value");
    // When the button is changed, run the updateChart function
    d3.select("#nation").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        // selectedG = d3.select(this).property("value");
        update(selectedOption);
        // selectedG = d3.select(this).property("value");
        
        // d3.select('cursorRect').on('mousemove',mousemove);
        // return selectedOption;
        // mousemove(selectedOption);

    })  

      //mouse new function above
    
    
      // circle
        var focus = svg
    .append('g')
      .attr("class","focus")
      .style("display","none");
    focus.append('circle')
      .style("fill", "none")
      .attr("stroke", "white")
      .attr('r', 8.5);
      // .style("opacity", 0)
    
    // var mousePerLine = 
    // focus
    // .selectAll('.mouse-per-line')
      // .datum(selectedD)
      // .enter()
      // .append("g")
            // .datum(selectedD)
      // .attr("class", "mouse-per-line");
      
    // focus.append("line")
    //     .attr("class", "x-hover-line hover-line")
    //     .attr("y1", 0)
    //     .attr("y2", height);

    // focus.append("line")
    //     .attr("class", "y-hover-line hover-line")
    //     .attr("x1", width)
    //     .attr("x2", width);
      
      //text
    //     var focusText = svg
    // .append('g')
    // .append('text')
    //   .style("opacity", 0)
    //   .attr("fill","white")
    //   .attr("text-anchor", "left")
    //   .attr("alignment-baseline", "middle")
    focus.append("text")
        .attr('class','focus')
        .attr("stroke", "#ffde55")
        .attr("x", -width1 * 0.2)
        .attr("dy", height1* 0.05);
      
    svg.append("text")
        .attr("class","tittle");  
      if(data1){
        d3.select(".tittle")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin1.left+40)
    .attr("x", -margin1.top+10)
    .attr("fill", "white")
    .text("unit: tonnes per country (M = million)")
    // .style("display",null)
    ;
      }else{
        d3.select(".tittle")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin1.left+40)
    .attr("x", -margin1.top+10)
    .attr("fill", "white")
    .text("unit: tonnes per capita")
    // .style("display","none")
    ;
      }
      
      //rect
    if(data1){svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('class','cursorRect')
    .attr('width', width1)
    .attr('height', height1)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)
    .attr('transform','translate(5,5)');}else{
      focus.style("display", "none");
    }
    
    

      
        function update(selectedGroup) {

      // Create new data with the selection?
      // if(data1){
      var dataFilter = data.filter(function(d){return d.Entity==selectedGroup});
      // var selectYear = data.filter(function(d){return d.Year==selectedGroup});
      // var selectCO = data.filter(function(d){return d.CO==selectedGroup});

      // Give these new data to update line
      if(data1){line1
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y(d.CO) })
          )}
          
          //update slider
if(data1){
          $( "#slider-range" ).show("slow");
          $( "#slider-range" ).slider({
            // orientation: "vertical",
            range: true,
            min: 1750,
            max: d3.max(data.filter(function(d){return d.Entity==allGroup[0]}),function(d) { return d.Year; }),
            values: [1750, d3.max(data.filter(function(d){return d.Entity==allGroup[0]}),function(d) { return d.Year; }) ],
            slide: function( event, ui ) {
              var begin = d3.min([ui.values[0], data.length]);
              var end = d3.max([ui.values[1], 0]);
              // console.log("begin:", begin, "end:", end);
              zoom(begin, end, x);
            }
        });
        $( "#slider-range-vertical" ).show("slow");
        $( "#slider-range-vertical" ).slider({
            orientation: "vertical",
            range: true,
            min: 0,
            max: d3.max(data.filter(function(d){return d.Entity==allGroup[0]}), function(d) { return +d.CO; }),
            values: [ 0, d3.max(data.filter(function(d){return d.Entity==allGroup[0]}), function(d) { return +d.CO; }) ],
            slide: function( event, ui ) {
              var begin = d3.min([ui.values[0], data.length]);
              var end = d3.max([ui.values[1], 0]);
              // console.log("begin:", begin, "end:", end);
              zoom(begin, end, y);
            }
        });
        
      }else{
        //dataset2
        //x slider
        $( "#slider-range" ).hide(
        );
       //y slider
        $( "#slider-range-vertical" ).hide(
          );
        }
    
    //       y
    //   .domain([0, d3.max(data.filter(function(d){return d.Entity==selectedGroup}), function(d) { return d.CO; })])
    //   .range([ height1, 0 ]);
    // drawY.select('g')
    //   // .attr("class", "axis")
    //   .call(d3.axisLeft(y));
      
    if(data1){d3.selectAll(".cursorRect")
    
    .on('mousemove', function(){
          var x0 = x.invert(d3.mouse(this)[0]);
          var bisect = d3.bisector(function(d) { return d.Year; }).left;
          i = bisect(data.filter(function(d){return d.Entity==selectedGroup}), x0, 1),
          d0 = data.filter(function(d){return d.Entity==selectedGroup})[i - 1],
          d1 = data.filter(function(d){return d.Entity==selectedGroup})[i],
          d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
      focus
          .datum(data.filter(function(d){return d.Entity==selectedGroup}))
          .attr("transform", "translate(" + x(d.Year) + "," + y(d.CO) + ")");
      focus.select("text").text(function() { return d.Year + ":    " + d.CO; });
    })
    ;}
    
    //redraw Y axis
    if(data1){y
      .domain([0, d3.max(data.filter(function(d){return d.Entity==selectedGroup}), function(d) { return +d.CO; })])
      ;
    svg
      .select(".y.axis")
      .transition()
      .call(yAxis);}
    
    //           console.log(data.filter(function(d){return d.Entity==selectedGroup}));
    // focus.select("text").attr("stroke", "black");
    
    // .on('mouseout', mouseout)
    // .attr('transform','translate(5,5)');
          // .attr("stroke", function(d){ return myColor(selectedGroup) })
      // return selectedGroup;
      // selectedG = d3.select("#selectButton").property("value");
      // return selectedG;
    }
    //end update
    //mouse function
      function mouseover() {
    if(data1){focus.style("display", null)}
    // focusText.style("opacity",1)
  }
  
      //   d3.select("#sourcePass").on('click',function(){
      // updateChart(dataSource);
      // console.log("1");
      // })
      // d3.select("#sourceFuture").on('click',function(){
      // updateChart(dataSource2);
      // console.log("2");
      // })

  
    function mousemove() {
    // // recover coordinate we need
    var x0 = x.invert(d3.mouse(this)[0]);
        var bisect;

          if(data1){
           bisect = d3.bisector(function(d) { return d.Year; }).left;
          i = bisect(data.filter(function(d){return d.Entity==allGroup[0]}), x0, 1),
          d0 = data.filter(function(d){return d.Entity==allGroup[0]})[i - 1],
          d1 = data.filter(function(d){return d.Entity==allGroup[0]})[i],
          d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.CO) + ")");
          focus.select("text").text(function() { return d.Year + ":    " + d.CO + "t"; });
          }
          else{
          // bisect = d3.bisector(function(d) { return d.Year; }).left;
          //   // if(function(d) { return d.Year; } <=2014){
            
          // i = bisect(data.filter(function(d){return d.Sector=="Macro"}), x0, 1),
          // d0 = data.filter(function(d){return d.Sector=="Macro"})[i - 1],
          // d1 = data.filter(function(d){return d.Sector=="Macro"})[i],
          // console.log(i);
          // d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
          // focus.attr("transform", "translate(" + x2(d.Year) + "," + y(d.CO) + ")");
          // focus.select("text").text(function() { return d.Year + ":    " + d.CO + "t"; });
            }
          // else{
          // i = bisect(data.filter(function(d){return d.Entity=="world"}), x0, 1),
          // d0 = data.filter(function(d){return d.Entity=="world"})[i - 1],
          // d1 = data.filter(function(d){return d.Entity=="world"})[i],
          // d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
          //   }
          // }

      
    }
    
  function mouseout() {
    focus.style("display", "none")
  }
    
  function zoom(begin, end, direction) {
    if(direction == x){if(data1){
    x.domain([begin, end - 1]);}else{x2.domain([begin, end - 1])}
    }else if(direction == y){
    y.domain([begin, end - 1]); 
    }

    var t = svg.transition().duration(0);

    var size = end - begin;
    var step = size / 10;
    var ticks = [];
    for (var i = 0; i <= 10; i++) {
      ticks.push(Math.floor(begin + step * i));
    }
    
    if(direction == x){
    xAxis.tickValues(ticks);
    t.select(".x.axis").call(xAxis);
    }else if(direction == y){
    yAxis.tickValues(ticks);
    t.select(".y.axis").call(yAxis);
    }
        t.select('.mainPath').attr("d", d3.line()
          .x(function(d) { return x(d.Year) })
          .y(function(d) { return y(d.CO) })
        );
        t.select('.worldPath').attr("d", d3.line()
          .x(function(d) { return x(d.Year) })
          .y(function(d) { return y(d.CO) })
        )
  }
  
  $(function() {
        if(data1){
          $( "#slider-range" ).show("slow");
          $( "#slider-range" ).slider({
            // orientation: "vertical",
            range: true,
            min: 1750,
            max: d3.max(data.filter(function(d){return d.Entity==allGroup[0]}),function(d) { return d.Year; }),
            values: [1750, d3.max(data.filter(function(d){return d.Entity==allGroup[0]}),function(d) { return d.Year; }) ],
            slide: function( event, ui ) {
              var begin = d3.min([ui.values[0], data.length]);
              var end = d3.max([ui.values[1], 0]);
              // console.log("begin:", begin, "end:", end);
              zoom(begin, end, x);
            }
        });
        $( "#slider-range-vertical" ).show("slow");
        $( "#slider-range-vertical" ).slider({
            orientation: "vertical",
            range: true,
            min: 0,
            max: d3.max(data.filter(function(d){return d.Entity==allGroup[0]}), function(d) { return +d.CO; }),
            values: [ 0, d3.max(data.filter(function(d){return d.Entity==allGroup[0]}), function(d) { return +d.CO; }) ],
            slide: function( event, ui ) {
              var begin = d3.min([ui.values[0], data.length]);
              var end = d3.max([ui.values[1], 0]);
              // console.log("begin:", begin, "end:", end);
              zoom(begin, end, y);
            }
        });
        
      }else{
        //dataset2
        //x slider
        $( "#slider-range" ).hide(
        // {
        //     // orientation: "vertical",
        //     // if(function(d) { return d.Year; } <=2014){
        //     range: true,
        //     step: 10,
        //     min: 2020,
        //     max: 2050,
        //     // d3.max(data.filter(function(d){return d.Entity==allGroup[0]}),function(d) { return d.Year; }),
        //     values: [2020, 2050],
        //     slide: function( event, ui ) {
        //       var begin = d3.min([ui.values[0], data.length]);
        //       var end = d3.max([ui.values[1], 0]);
        //       // console.log("begin:", begin, "end:", end);
        //       zoom(begin, end, x);
        //     }
          // }
          //   else{
          //   range: true,
          //   min: 2020,
          //   max: 2050,
          //   values: [2020, 2050],
          //   slide: function( event, ui ) {
          //     var begin = d3.min([ui.values[0], data.length]);
          //     var end = d3.max([ui.values[1], 0]);
          //     // console.log("begin:", begin, "end:", end);
          //     zoom(begin, end, x);
          //   }
          // }
        // }
        );
       //y slider
        $( "#slider-range-vertical" ).hide(
          // {
        //     orientation: "vertical",
        //     range: true,
        //     min: 0,
        //     max: d3.max(data.filter(function(d){return d.Sector=="Macro"}), function(d) { return +d.CO; }),
        //     values: [ 0, d3.max(data.filter(function(d){return d.Sector=="Macro"}), function(d) { return +d.CO; }) ],
        //     slide: function( event, ui ) {
        //       var begin = d3.min([ui.values[0], data.length]);
        //       var end = d3.max([ui.values[1], 0]);
        //       // console.log("begin:", begin, "end:", end);
        //       zoom(begin, end, y);
        //     }
        //   }
          );
        }
        //end else
        
            
        $( "#sourceFuture" ).button().click( function() {
            if(data1){
          updateChart(dataSource2);
          data1 = false;
            }
        });
        $( "#sourcePass" ).button().click( function() {
            if(!data1){
          updateChart(dataSource);
          data1 = true;
            }
        });
    });
    
    //   $(function() {
    //     $( "#slider-range-vertical" ).slider({
    //         orientation: "vertical",
    //         range: true,
    //         min: 0,
    //         max: 100,
    //         values: [ 0, 100 ],
    //         slide: function( event, ui ) {
    //           var begin = d3.min([ui.values[0], data.length]);
    //           var end = d3.max([ui.values[1], 0]);
    //           // console.log("begin:", begin, "end:", end);
    //           zoom(begin, end, y);
    //         }
    //     });
    // });
})
}

updateChart(dataSource);

// d3.select("#sourceButton").on('click',function(){
//   updateChart(dataSource2);
//   console.log("1");
// // })

      // d3.select("#sourcePass").on('click',function(){
      // updateChart(dataSource);
      // console.log("1");
      // })
      // d3.select("#sourceFuture").on('click',function(){
      // updateChart(dataSource2);
      // console.log("2");
      // })


// $(document).ready(function() {
//     $( "#sourceFuture" ).click( function() {
//       updateChart(dataSource2);
//     } );
// });

// $(document).ready(function() {

// var image05 = "05_.png";
// var image5 = "05.png";

// //When the Image is hovered upon, show the hidden div using Mouseover
// $('#food').hover(function() {
//   $('#food').css('background-image', 'url('+ image05 +')'); 
//   console.log("1");
// },function() {
//   $('#food').css('background-image', 'url('+ image5 + ')'); 
// });

// });

  // $( function() {
  // //   // $( ".widget input[type=submit], .widget a, .widget button" ).button();
  //   $( "#sourceFuture" ).click( function( ) {
  //     updateChart(dataSource2);
  //   } );
  // } );


