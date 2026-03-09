//Arrays and Object Notation Assignment
//Bertin Li
//March 5/26

//Making maps on https://map-degen.vercel.app/
//Converting them to coords at https://education.openguessr.com/tools/map-converter
//I used leaflet maps which somehow had everything I needed like getting corrdinates from where I clicked, and adding markers and many more
//the Leaflet website was incredibly easy to follow aswell https://leafletjs.com/examples.html

let street;
let map;
let mapID;

// all countries that have street view
let countries = [
  "None",
  "Albania",
  "Andorra",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Bulgaria",
  "Cambodia",
  "Canada",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Czechia",
  "Denmark",
  "Dominican Republic",
  "Ecuador",
  "Estonia",
  "Eswatini",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Guatemala",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kyrgyzstan",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Malta",
  "Mexico",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Namibia",
  "Netherlands",
  "Nepal",
  "New Zealand",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "San Marino",
  "Sao Tome and Principe",
  "Senegal",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Tunisia",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Vietnam",
];

//markers
var answermarker;
var marker;

var answerIcon = L.icon({
    iconUrl: 'green_marker.png',

    iconSize: [30, 40], // size of the icon
    iconAnchor: [15, 39], // point of the icon which will correspond to marker's location
});

//game variables
let mapShowing = true;
let winStreak = 0;
let worldMapSize = 14916862;
let points;
let bestSet = 0

//map variables
let correctDis = 1000000
var answerLine;
let answerPadding = 50
let mapOriginalHeight = 300
let mapOriginalWidth = 400
let newHeight = 450
let newWidth = 600
let mapBottom = 20
let mapRight = 75
let enlarged = false

let totalDistance;
let endScreen = false
let clickedPoint;
let lastAnswer;
let randomlocation;
let currentLocations = [];
let newlat;
let newlng;

//banner
let bannerHeight = 70
let banner;
let bannerText;

let textsize;
let textSizeScreenDividor = 75

//drop down country picker
let mapOptions;
let opttextsize;
let opttextsizeDivisor = 70
let optionsX = 20
let optionsY = 15
let optxwidth;
let optyheight = bannerHeight / 2
let optxwidthDivisor = 25

let switching = true

//buttons
let confirmButton;
let hideMapButton;
let startSetButton;

//set variables
let setLocations = [];
let setClickedPoints = [];
let setActive = false;
let curretnRoundNumber = 0;
let maxRounds = 5;
let totalSetPoints = 0;
let setMarkers = [];
let setLineColors = [];

function setup() {
  noCanvas();
  //leaflet map
  map = L.map("map").setView([0, 0], 1);

  //pasted from leaflet
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  mapID  = select("#map");

  //marker placement
  marker = L.marker([0, 0]).addTo(map);

  //when the map is clicked
  function onMapClick(e) {
    if (endScreen === false) {
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;

      marker.setLatLng([lat, lng]);
      
      clickedPoint = {
        lat: lat,
        lng: lng,
      }
    }
  }

  clickedPoint = {
    lat: 0,
    lng: 0,
  }

  map.on('click', onMapClick);

  //create top banner
  textsize = (windowWidth + windowHeight) / textSizeScreenDividor

  //load info
  if (localStorage.getItem("BestSet") !== null) {
    bestSet = Number(localStorage.getItem("BestSet"));
  }

  //default text
  bannerText = ("Best Set: " + bestSet.toLocaleString())

  banner = createDiv(bannerText);
  banner.style("background", "rgb(154, 255, 120)");
  banner.style("color", "white");
  banner.style("z-index", "20");

  banner.style("display", "flex");
  banner.style("padding-right", "2vw")
  banner.style("justify-content", "flex-end");
  banner.style("align-items", "center");

  banner.style("color", "rgb(0, 0, 0)");
  banner.style("font-weight", "bold");

  banner.style("border-bottom", "4px solid black");
  banner.style("box-sizing", "border-box");

  setupMap()

  //pick random location
  randomlocation = random(currentLocations)
  newlat = randomlocation.lat
  newlng = randomlocation.lng

  //add the part that is going to have the street view on it
  street = createElement("iframe");
  street.attribute("allowfullscreen", "");
  street.style("border", "0");
  street.position(0, 0);
  street.size(windowWidth, windowHeight);

  //button to confirm
  confirmButton = createButton("Confirm (Space)");
  confirmButton.size(60, 50);
  confirmButton.style("position", "absolute");
  confirmButton.style("z-index", "14");

  confirmButton.mousePressed(confirmed);

  //button to hide map
  hideMapButton = createButton("Toggle Map");
  hideMapButton.size(60, 50);
  hideMapButton.style("position", "absolute");
  hideMapButton.style("z-index", "12");

  hideMapButton.mousePressed(hideMap);

  //button to start a set
  startSetButton = createButton("Start Set");
  startSetButton.size(60, 50);
  startSetButton.style("position", "absolute");
  startSetButton.style("z-index", "12");

  startSetButton.mousePressed(startSet);
  
  changeMapSize()

}

function draw() {
  nextmap()
  fixsizes()
}

function windowResized() {
  street.size(windowWidth, windowHeight);
}

function addmap(map, country) {
  for (let location of map) {
    currentLocations.push(
      {
      lat: location[0],
      lng: location[1],
      cnt: country,
      }
    )
  }
}

function fixsizes() {
  optxwidth = (windowWidth + windowHeight) / optxwidthDivisor

  banner.position(0, 0);
  banner.size(windowWidth, bannerHeight);

  textsize = (windowWidth + windowHeight) / textSizeScreenDividor
  banner.style("font-size", `${textsize}px`);

  confirmButton.position(windowWidth - 67, windowHeight - 250);
  hideMapButton.position(windowWidth - 67, windowHeight - 310);
  startSetButton.position(windowWidth - 67, windowHeight - 120);
}

function startSet() {
  if (!setActive) {
    setActive = true
    curretnRoundNumber = 1
    banner.html("Round: " + curretnRoundNumber + "/" + maxRounds)

    mapChange()
  }
}

//space bar
function keyPressed() {
  if (key === " ") {
    confirmed()
  }
}


function hideMap() {
  if (mapShowing === true) {
    mapID.hide();
    mapShowing = false;
  }
  else {
    mapID.show();
    mapShowing = true;
  }
}

function nextmap() {
  if (switching) {
    randomlocation = random(currentLocations)
    newlat = randomlocation.lat
    newlng = randomlocation.lng
    
    street.attribute(
      "src",
      `https://www.google.com/maps?q=&layer=c&cbll=${newlat},${newlng}&cbp=11,0,0,0,0&output=svembed`
    );
    switching = false;
  }
}

function setupMap() {
  currentLocations = [];
  for (let country of allCountries) {
    addmap(country[1], country[0])
    }
  }
  
function confirmed() {
  if (endScreen === false) {
    //find meters
    
    let point1 = L.latLng(randomlocation.lat, randomlocation.lng);
    let point2 = L.latLng(clickedPoint.lat, clickedPoint.lng);

    totalDistance = point1.distanceTo(point2);

    afterGuess()
  }
  else if (endScreen === true) {
    endScreen = false
    answermarker.remove()
    answerLine.remove()
    mapChange()
    map.setView([0, 0], 1);

    //change map size back to original
    enlarged = false
    mapID.style("bottom", "20px")
    mapID.style("right", "75px")
    mapID.size(mapOriginalWidth, mapOriginalHeight)
    map.invalidateSize()
    map.setView([0, 0], 1)

    for (let item of setMarkers) {
      item.remove();
    }
  }
}


//runs after the player has guessed
function afterGuess() {
  endScreen = true;

  //exponential points
  points = Math.round(5000 * Math.exp(-10 * totalDistance / worldMapSize));

  //set distance text
  let measurement = "m"
  let displayAmount = totalDistance
  if (totalDistance > 1000) {
    measurement = "km"
    displayAmount = displayAmount / 1000
  }

  //text after guess
  banner.html("Distance: " + round(displayAmount).toLocaleString() + measurement + " | Points: " + points)

  //if this is during a set
  if (setActive) {
    //add points
    totalSetPoints += points
    if (curretnRoundNumber < maxRounds) {
      curretnRoundNumber += 1
      setLocations.push([randomlocation.lat, randomlocation.lng])
      setClickedPoints.push([clickedPoint.lat, clickedPoint.lng])

      //save line colors
      let lineCol = "black"
      if (totalDistance <= correctDis) {
        lineCol = "green"
      }
      setLineColors.push(lineCol)
    }
    //end set and reset all variables
    else {
      //show the previous guesses, the idea is that the final guess will be shown normally so all 5 guesses will be shown
      for (i = 0; i < maxRounds - 1; i++) {
        var setAnswerMarker = L.marker([setLocations[i][0], setLocations[i][1]], {icon: answerIcon}).addTo(map);
        var setClickedMarker = L.marker([setClickedPoints[i][0], setClickedPoints[i][1]]).addTo(map);
        var setAnswerLine = L.polyline([[setLocations[i][0], setLocations[i][1]],[setClickedPoints[i][0], setClickedPoints[i][1]]], {
          color: setLineColors[i],
          opacity: 0.7
        }).addTo(map);

        setMarkers.push(setAnswerMarker)
        setMarkers.push(setClickedMarker)
        setMarkers.push(setAnswerLine)
      }
      
      if (bestSet < totalSetPoints) {
        bestSet = totalSetPoints
      }

      banner.html("Distance: " + round(displayAmount).toLocaleString() + measurement + " | Points: " + points + " | Round Overall: " + totalSetPoints)
      setActive = false
      curretnRoundNumber = 1
      totalSetPoints = 0
      setLocations = []
      setClickedPoints = []
      setLineColors = []
    }
  }

  //fill screen with map
  mapID.style("bottom", "0px")
  mapID.style("right", "0px")
  mapID.size(windowWidth, windowHeight - bannerHeight)
  map.invalidateSize()

  answermarker = L.marker([randomlocation.lat, randomlocation.lng], {icon: answerIcon}).addTo(map);

  let lineCol = "black"
  if (totalDistance <= correctDis) {
    lineCol = "green"
  }
  //show a line from the clicked point to the answer
  answerLine = L.polyline([[randomlocation.lat, randomlocation.lng],[clickedPoint.lat, clickedPoint.lng]], {
    color: lineCol,
    opacity: 0.7
  }).addTo(map);

  adjustAfterGuess()
}

function adjustAfterGuess() {
  //set the bounds to both the points as 2 corners
  let bounds = L.latLngBounds(
    [randomlocation.lat, randomlocation.lng],
    [clickedPoint.lat, clickedPoint.lng]
  );
  

  //leaflit feautre to make the map fit 2 coordinates 
  map.fitBounds(bounds, { padding: [answerPadding, answerPadding] });
}

function changeMapSize() {
  //make sure they are not on phone
  mapID.mouseOver(() => {
    if (windowWidth + windowHeight > 2000 && !enlarged && !endScreen) {
      mapID.size(newWidth, newHeight);
      map.invalidateSize();
      enlarged = true;
    }
  });

  mapID.mouseOut(() => {
    if (windowWidth + windowHeight > 2000 && enlarged && !endScreen) {
      mapID.size(mapOriginalWidth, mapOriginalHeight);
      // mapID.position(
      //   windowWidth - mapRight - mapOriginalWidth,
      //   windowHeight - mapBottom - mapOriginalHeight
      // );
      map.invalidateSize();
      enlarged = false;
    }
  });
}

function mapChange() {
  switching = true
  saveProgress()
  marker.setLatLng([0, 0]);
  clickedPoint = {
    lat: 0,
    lng: 0,
  }

  //text after change
  if (setActive) {
    banner.html("Round: " + curretnRoundNumber + "/" + maxRounds)
  }
  else {
    banner.html("Best Set: " + bestSet.toLocaleString())
  }
}

function saveProgress() {
  localStorage.setItem("BestSet", bestSet);
}