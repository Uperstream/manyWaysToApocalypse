var pastEmit = [];
var time, co2, country = [];


// ------------- VARIABLES ------------- //
var ticking = false;
var isFirefox = (/Firefox/i.test(navigator.userAgent));
var isIe = (/MSIE/i.test(navigator.userAgent)) || (/Trident.*rv\:11\./i.test(navigator.userAgent));
var scrollSensitivitySetting = 30; //Increase/decrease this number to change sensitivity to trackpad gestures (up = less sensitive; down = more sensitive) 
var slideDurationSetting = 600; //Amount of time for which slide is "locked"
var currentSlideNumber = 0;
var totalSlideNumber = 2;
// var totalSlideNumber = $(".background").length;



// ------------- DETERMINE DELTA/SCROLL DIRECTION ------------- //
function parallaxScroll(evt) {
  if (isFirefox) {
    //Set delta for Firefox
    delta = evt.detail * (-120);
  } else if (isIe) {
    //Set delta for IE
    delta = -evt.deltaY;
  } else {
    //Set delta for all other browsers
    delta = evt.wheelDelta;
  }

  if (ticking != true) {
    if (delta <= -scrollSensitivitySetting) {
      //Down scroll
      ticking = true;
      if (currentSlideNumber !== totalSlideNumber - 1) {
        currentSlideNumber++;
        nextItem();
      }
      slideDurationTimeout(slideDurationSetting);
    }
    if (delta >= scrollSensitivitySetting) {
      //Up scroll
      ticking = true;
      if (currentSlideNumber !== 0) {
        currentSlideNumber--;
      }
      previousItem();
      slideDurationTimeout(slideDurationSetting);
    }
  }
}

// ------------- SET TIMEOUT TO TEMPORARILY "LOCK" SLIDES ------------- //
function slideDurationTimeout(slideDuration) {
  setTimeout(function() {
    ticking = false;
  }, slideDuration);
}

// ------------- ADD EVENT LISTENER ------------- //
var mousewheelEvent = isFirefox ? "DOMMouseScroll" : "wheel";
window.addEventListener(mousewheelEvent, _.throttle(parallaxScroll, 60), false);

// ------------- SLIDE MOTION ------------- //
function nextItem() {
  var $previousSlide = $(".background").eq(currentSlideNumber - 1);
  $previousSlide.removeClass("up-scroll").addClass("down-scroll");
}

function previousItem() {
  var $currentSlide = $(".background").eq(currentSlideNumber);
  $currentSlide.removeClass("down-scroll").addClass("up-scroll");
}

//d3.js

// var parseDate = d3.timeParse("%m/%d/%Y");
// D3.CSV("cumulative-co-emissions.csv")
//     .row(function(d) {return{ date:parseDate(d.Year),co2;Number(d.CO.trim().slice(1))};})
//     .get(function(error,data){

//       var height = 400;
//       var width = 600;

//       var maxDate = d3.max(data,function(d){ return d.Year;});
//       var minDate = d3.min(data,function(d){ return d.Year;});
//       var maxCO = d3.max(data,function(d){ return d.CO;});

//       var y = d3.scaleLinear()
//                 .domain([0,maxCO])
//                 .range([height,0]);
//       var x = d3.scaleTime()
//                 .domain([minDate,maxDate])
//                 .range([0,width]);
//       var yAxis = d3.axisLeft(y);
//       var xAxis = d3.axisBottom(x);

//       var svg = d3.select('body').append('svg')
//                   .attr('height','100%')
//                   .attr('width','100%');
//       var chartGroup = svg.append('g')
//                           .attr('transform','translate(50,50)');
//       var line = d3.line(0)
//                       .x(function(d){ return x(d.CO);})
//                       .y(function(d){ return y(d.price);});
//       chartGroup.append('path').attr('d',line(data));
//     });

// p5js

// function preload(){
//     pastEmit = loadTable("cumulative-co-emissions.csv", 'csv', 'header');
// }

// function done() {
//   time = pastEmit.getColumn("Year");
//   country = pastEmit.getColumn("Entity");
//   co2 = pastEmit.getColumn("CO");


//   // q = true;
//   // print(time[249]);

//   // pastEmitJoint = join(pastEmit, ",");
//   // print(pastEmitJoint);
// }
var first = false;
var nameP, story;
var food, cosume, age, travel;

function setup() {
  var story = select('.content-graph');
  food = createSelect();
  // select('food');
  food.option("Beef,Lamp");
  food.option("Chiken,Pork");
  food.option("Vegitable");
  food.position(windowWidth * 0.335, windowHeight * 0.42);
  food.size(width * 0.6, height * 0.65);
  food.parent('food');
  food.addClass('selectButton');
  // var foodP = createImg('05.png');
  // foodP.parent('food');
  // foodP.position(windowWidth * 0.335, windowHeight * 0.42);
  // foodP.mouseOver(changefoodP);
  // foodP.mouseOut(changefoodB);
  cosume = createSelect();
  cosume.option("Fashion");
  cosume.option("Electronics");
  cosume.option("restaurant");
  cosume.option("Commodity");
  cosume.parent('cosume');
  cosume.addClass('selectButton');
  cosume.position(windowWidth * 0.40, windowHeight * 0.68);
  cosume.size(width * 0.9, height * 0.75);
  age = createSelect();
  age.option("< 20");
  age.option("20 to 35");
  age.option("36 to 45");
  age.option("46 to 70");
  age.parent('age');
  age.addClass('selectButton');
  age.position(windowWidth * 0.415, windowHeight * 0.50);
  age.size(width * 0.7, height * 0.55);
  travel = createSelect();
  travel.option("Plane");
  travel.option("Train");
  travel.option("Car");
  travel.option("Public Transfer");
  travel.parent('travel');
  travel.addClass('selectButton');
  travel.position(windowWidth * 0.6, windowHeight * 0.52);
  travel.size(width * 0.7, height * 0.75);
  nameP = select("#name").value();
  // food.changed(calculatePoint);
  // calculatePoint();
  // print(food.value());


}

// function changefoodP() {
//   this.attribute('src', '05-.png')
// }

// function changefoodB() {
//   this.attribute('src', '05.png')
// }

function calculatePoint() {
  var points = 0;
  if (food.value() == "Beef,Lamp") {
    points += 3;
  } else if (food.value() == "Chiken,Pork") {
    points += 2;
  } else {
    points += 1;
  }
  if (cosume.value() == "Fashion") {
    points += 3;
  } else if (cosume.value() == "Electronics") {
    points += 3;
  } else if (cosume.value() == "restaurant") {
    points += 2;
  } else {
    points += 1;
  }

  if (travel.value() == "Plane") {
    points += 3;
  } else if (travel.value() == "Train") {
    points += 3;
  } else if (travel.value() == "Car") {
    points += 2;
  } else {
    points += 1;
  }

  first = true;
  // return points;
  generateStory(points);
}

function generateStory(points) {
  var cause, phenomenon, keyword;
  var q, time;
  if (points <= 5) {
    //clean energy
    q = random(10);
    if (q <= 3) {
      cause = "die natrualy";
      phenomenon = "Because of all the effort people had made, the world is safe. " + name + " has many Children. But Life is normal, " + name + " think. Sometimes " + name + "even wondered what would happen if people mess up with the climate. ";
      keyword = "butterfly effect";
      time = int(random(2050, 2100));
    } else {
      cause = "attacked by disease";
      phenomenon = "You work so hard to save our planet. We really appriciate that. But the world messed up by others. No Snowflake in an avalanche ever feels responsible. Maybe talk to them.";
      keyword = "Mitigation and adaptation";
      time = int(random(2030, 2080));
    }
  } else if (points <= 7) {
    q = random(20);
    if (q <= 5) {
      cause = "drown in her/his house";
      phenomenon = "The sea raised and the whole city is flooded.";
      keyword = "sea level anomalies";
    } else if (q <= 10) {
      cause = "die by accident";
      phenomenon = "Extrem wether change the way of living. Being outside is always an adventrue. " + name + " is brave yet unlucky. Who's next for scavenging? May the odds be with you.";
      keyword = "Extrem wether";
    } else if (q <= 15) {
      cause = "keep exposure under the polluted air until death";
      phenomenon = "It's not that he want to, but no longer cleanning air exist. To die or not to die; that is the question of sooner or later.";
      keyword = "polluted air";
    } else {
      cause = "fell so hard and couldn't make it through";
      phenomenon = "The light shut without any sign. No one noticed that " + name + " injured so badly, until the power came back 20 days after. Poor man, he must've been to the heaven, and enjoying the free wifi now.";
      keyword = "renewable energy";
    }
    time = int(random(2025, 2060));
  } else if (points <= 9) {
    q = random(10);
    if (q <= 7) {
      cause = "is starved to death";
      phenomenon = "The climate change the habitate of animals. Eventually most animal extinct. Some peole chose stuffed to death, simply by eating soil. It's hard to tell which one is more painful."
      keyword = "species extinction";
    } else {
      cause = "dehydrated when the sun raise again";
      phenomenon = "Temperature continue to rise. Heat waves come again and agian. Arctic became ice-free. Suddenly, " + name + " couldn't help to miss the taste of ice-cream in his last minute.";
      keyword = "Global warmming";
    }
    time = int(random(2020, 2040));
  }
  story = nameP + " " + cause + " in " + time + ". " + phenomenon;

}

function draw() {
  food.changed(calculatePoint);
  cosume.changed(calculatePoint);
  travel.changed(calculatePoint);
  var txt = select('.content-graph');
  nameP = select("#name").value();
  if (first) {
    txt.style("font-size", "18pt");
    txt.style("width", "50%");
  }
  // create
  txt.html(story);
  // print(story);

}


// function zoomChart() {
//   chart.zoomToIndexes(Math.round(chart.dataProvider.length * 0.1), Math.round(chart.dataProvider.length * 0.8));
// }