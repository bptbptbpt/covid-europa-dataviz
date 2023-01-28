////////////////////////////////////////////////////////////////////
// General settings
////////////////////////////////////////////////////////////////////

var map = L.map('map');
map.setView([55, 12], 3.5);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	maxZoom: 13
}).addTo(map);

var selected_cntry;
var to_plot = cases;
var cases_or_deaths;
set_choice('cases')
////////////////////////////////////////////////////////////////////
// New polygon layer: countries
////////////////////////////////////////////////////////////////////

// Define styles 
var standardStyle = {
  fillColor: "#E5E3E4",
  weight: 1,
  color: '#BBC6C8',
  fillOpacity: 0.6,
  opacity: 1
}
var clickStyle = {
  fillColor: '#DDBEAA', 
  color: '#BBC6C8', 
  weight: 3
}
var highlightStyle = {
  color: '#8A9994',
  weight: 1.7,
  fillOpacity: 0.85,
}

function style() {
  return standardStyle
}

// Mouseover and mouseout functions
function highlightFeature(e) {
  var poly = e.target;
  info.update(poly.feature.properties);
  poly.setStyle(highlightStyle);
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      poly.bringToFront();
  }
}

var lastOpen;
function resetHighlight(e) {
  var poly = e.target;
  if (poly._popup.isOpen()) {
    console.log("Popup is open.")
    lastOpen = e.target;
  } else {
    poly.setStyle(standardStyle);;
  }
  if (map.hasLayer(dataLayerGroup)) {
    dataLayerGroup.bringToFront();
  }
}

// Onclick function
function select(e) {
  if (lastOpen != null) {
    lastOpen.setStyle(standardStyle);
  }
  var poly = e.target;
  countriesLayer.setStyle(standardStyle);
  // Zoom on country
  map.fitBounds(e.target.getBounds());
  // Set style
  poly.setStyle(clickStyle);

  selected_cntry = e.target.feature.properties.NAME;

  plot_chart()
}
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
function plot_chart() {

  d3.select('#barplot').remove();

  var index = test.indexOf(selected_cntry);

  if (to_plot == 'cases'){
    cases_or_deaths = ["COVCASES_0420","COVCASES_0520","COVCASES_0620","COVCASES_0720","COVCASES_0820","COVCASES_0920","COVCASES_1020","COVCASES_1120","COVCASES_1220","COVCASES_0121","COVCASES_0221","COVCASES_0321","COVCASES_0421","COVCASES_0521","COVCASES_0621","COVCASES_0721","COVCASES_0821","COVCASES_0921","COVCASES_1021","COVCASES_1121","COVCASES_1221","COVCASES_0122","COVCASES_0222","COVCASES_0322","COVCASES_0422","COVCASES_0522","COVCASES_0622","COVCASES_0722","COVCASES_0822","COVCASES_0922","COVCASES_1022","COVCASES_1122","COVCASES_1222","COVCASES_0123"]
  } 
  else if (to_plot == 'deaths'){
    cases_or_deaths = ["COVDEATHS_0420","COVDEATHS_0520","COVDEATHS_0620","COVDEATHS_0720","COVDEATHS_0820","COVDEATHS_0920","COVDEATHS_1020","COVDEATHS_1120","COVDEATHS_1220","COVDEATHS_0121","COVDEATHS_0221","COVDEATHS_0321","COVDEATHS_0421","COVDEATHS_0521","COVDEATHS_0621","COVDEATHS_0721","COVDEATHS_0821","COVDEATHS_0921","COVDEATHS_1021","COVDEATHS_1121","COVDEATHS_1221","COVDEATHS_0122","COVDEATHS_0222","COVDEATHS_0322","COVDEATHS_0422","COVDEATHS_0522","COVDEATHS_0622","COVDEATHS_0722","COVDEATHS_0822","COVDEATHS_0922","COVDEATHS_1022","COVDEATHS_1122","COVDEATHS_1222","COVDEATHS_0123"]
  }

  var data_chart = [];
  var data_chart_sum = [];

  for (i in cases_or_deaths){
    var val = countries.features[index].properties[cases_or_deaths[i]]
    data_chart_sum.push(val)
  }

  for (i in data_chart_sum){
    if (parseInt(i) < 33){
      data_chart.push(data_chart_sum[parseInt(i)+1] - data_chart_sum[i])
    }
  }

  
  labels = ["Avril 2020","Mai 2020","Juin 2020","Juillet 2020","Aout 2020","Septembre 2020","Octobre 2020","Novembre 2020","Decembre 2020","Janvier 2021","Fevrier 2021","Mars 2021","Avril 2021","Mai 2021","Juin 2021","Juillet 2021","Aout 2021","Septembre 2021","Octobre 2021","Novembre 2021","Decembre 2021","Janvier 2022","Fevrier 2022","Mars 2022","Avril 2022","Mai 2022","Juin 2022","Juillet 2022","Aout 2022","Septembre 2022","Octobre 2022","Novembre 2022","Decembre 2022"]

//////////////////////////////////////////////////
//// D3 chart affichage
//////////////////////////////////////////////////

let margin = {top: 40, right: 30, bottom: 80, left: 65};
let width = 420 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

var svg = d3.select("#d3-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "barplot")
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

//Echelle des X 
let x = d3.scalePoint()
        .domain(labels)
        .range([0, width])
        

//Echelle des Y 
let y = d3
   .scaleLinear()
   .range([height, 0])
   .domain([0, d3.max(data_chart)])

if (to_plot == 'cases'){
  svg.append("text")
     .attr("x", 0)
     .attr("y", 0-(margin.top/2))
     //.attr("text-anchor", "center")
     .style("font-size", "12px")
     .style("font-weight", "bold")
     .text("Number of new cases by month in "+ selected_cntry)
 }
if (to_plot == 'deaths'){
  svg.append("text")
     .attr("x", 0)
     .attr("y", 0-(margin.top/2))
     //.attr("text-anchor", "center")
     .style("font-size", "12px")
     .style("font-weight", "bold")
     .text("Number of new deaths by month in "+ selected_cntry)
}


// Création des rectangles
    svg
       .selectAll("rect")
       .data(data_chart)
       .enter()
       .append("rect")
       .attr("x", function(d,i){
        return x(labels[i])
       })
       .attr("y", function(d){
        return y(d)
       })
       .attr("id", function(d,i){
        return i
       })
       .attr("width", 8)
       .attr("height", function(d){
        return height - y(d)
       })
       .style("fill", "#69b3a2")
       .on("mouseover", function() {
          svg.append("text")
             .attr("x", 20)
             .attr("y", 20)
             .attr("class", "label_text")
             .style("font-size", "15px")
             .style("font-weight", "bold")
             .text(labels[this.getAttribute("id")])
        })
       .on("mouseout", function() {
            document.querySelectorAll(".label_text").forEach(e => e.remove());
          });

// Ajouter axe X
  svg.append("g")
     .style("font-size", 8)
     .attr("transform", "translate(3.5," + height +")")
     .call(d3.axisBottom(x)
             .tickPadding(0))
     .selectAll("text")
     .attr("transform", "translate(-7,2)rotate(-45)")
     .style("text-anchor", "end")
     ;

// Ajouter axe Y
  svg.append("g")
     .call(d3.axisLeft(y))
     .attr("id", "Yaxis");

     

}

// Link functions to events
function onEachFeature(feature, layer) {
  // Define popup content 
  var popupContent;
  if (feature.properties.COVCASES_0121 != 0) {
    popupContent = 
      '<h1>' + feature.properties.NAME + '</h1>' + '\n' +
      'Total cases due to COVID-19 in 2020: ' + feature.properties.COVCASES_0121 + '</br>' +
      'Total deaths due to COVID-19 in 2020: ' + feature.properties.COVDEATHS_0121 + '</br>' +
      'Total cases due to COVID-19 in 2021: ' + feature.properties.COVCASES_0122 + '</br>' +
      'Total deaths due to COVID-19 in 2021: ' + feature.properties.COVDEATHS_0122 + '</br>' +
      'Total cases due to COVID-19 in 2022: ' + feature.properties.COVCASES_0123 + '</br>' +
      'Total deaths due to COVID-19 in 2022: ' + feature.properties.COVDEATHS_0123 + '</br>'
    } else {
      popupContent =
        '<h1>' + feature.properties.NAME + '</h1>' + '\n' +
        'Number of COVID-19 deaths unavailable for 2020.'
    }
  // Add popups to layer
  layer.bindPopup(popupContent)
  // Add events functions
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: select
  });
}

// Add layer with events to map
var countriesLayer = L.geoJSON(countries, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);



////////////////////////////////////////////////////////////////////
// Add info box
////////////////////////////////////////////////////////////////////

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = props ?
        '<b>' + props.NAME
        : 'Hover over a coutry';
};

info.addTo(map);



////////////////////////////////////////////////////////////////////
// Search a country functionnality 
////////////////////////////////////////////////////////////////////

L.Control.textbox = L.Control.extend({
  onAdd: function(map) {
    var text = L.DomUtil.create('div');
    text.id = "searchTextC";
    text.innerHTML = "<strong>Search country:</strong>"
    return text;
  }
});
L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
L.control.textbox({ position: 'topleft' }).addTo(map);

var searchCountry = L.control.search({
  layer: countriesLayer,
  initial: false,
  propertyName: 'NAME',
  textPlaceholder: 'Search by country.',
  marker: false,
  // Move map to country location
  moveToLocation: function(latlng, title, map) {
    map.setView(latlng, 5);
    console.log(title);
    selected_cntry = title;
    plot_chart()
  },

});

searchCountry.on('search:locationfound', function(e) {
  // Reset all polygons style
  countriesLayer.setStyle(standardStyle);
  // Select searched country
  e.layer.setStyle(clickStyle);
  e.layer.openPopup();
  // Delete results from language search if any
  if(dataLayerGroup){
    dataLayerGroup.remove();
  };
});

// Add to map
map.addControl(searchCountry);
L.DomUtil.addClass(searchCountry.getContainer(),'info')



////////////////////////////////////////////////////////////////////
// Search a language functionality
////////////////////////////////////////////////////////////////////

var dataLayerGroup;
//var filterval = document.querySelector('input[name="radioLang"]:checked').value;

// Filters countries based on selected language
// var langFilter = function (feature) {
//   if (feature.properties.LANG1 === filterval || feature.properties.LANG2 === filterval || 
//     feature.properties.LANG3 === filterval || feature.properties.LANG4 === filterval) return true}

// Delete previous results and highlights selected countries
function addLayerToMap(){
  if (map.hasLayer(dataLayerGroup)) {
  dataLayerGroup.remove();
  }
  // Define new layer of selected countries
  dataLayerGroup = L.geoJson(countries, {
      // filter: langFilter,
      pointToLayer: function(feature, latlng) {
          return new L.CircleMarker(latlng, {radius: 8, fillOpacity: 0.85});
      },
      onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.color);
      }, 
      style: ({color: '#fb2e01', weight: 3}),
      interactive: false
      }).addTo(map);
  }

// Add listener to show button. All infos about deaths are in the geojson file (here countries_europe.js)
// function showTotalFunction(){
  // Function that will display graph of total deaths per country
// };

////////////////////////////////////////////////////////////////////
// Choice of what to plot
////////////////////////////////////////////////////////////////////

function set_choice(value){

    to_plot = value

    if(to_plot == 'cases'){
      document.getElementById("cases").style.fontWeight = "bold";
      document.getElementById("deaths").style.fontWeight = "normal";
    }
    else{
      document.getElementById("cases").style.fontWeight = "normal";
      document.getElementById("deaths").style.fontWeight = "bold";
    }

    if (selected_cntry != undefined) {
      plot_chart()
    }
}


////////////////////////////////////////////////////////////////////
// Histogram plotting
////////////////////////////////////////////////////////////////////

var test = countries.features.map(function (el) {
  return el.properties.NAME
});


country = d3.selectAll('path')
//country.data(cmnes.features)


// country.on("click", function(d) {

//   console.log(d)

//   d3.select('#Name_commune').remove();
//   d3.select('#barplot').remove();


//   let width_chart = 200;
//   let height_chart = 400;
//   let margin = {top: 50, bottom: 50, left:20, right:20};

//   let svg = d3.select('#d3-container')
//     .append('svg')
//     .attr('height', height_chart - margin.top - margin.bottom)
//     .attr('width', width_chart - margin.left - margin.right)
//     .attr('viewBox', [0, 0, width_chart, height_chart]);
//     //.attr("id", "barplot")

//   let x = d3.scaleBand()
//     .domain(d3.range(data.length))
//     .range([margin.left, width_chart - margin.right])
//     .padding(0.1)

//   let y = d3.scaleLinear()
//     .domain([0, 100])
//     .range([height_chart - margin.bottom, margin.top])

//   svg
//     .append("g")
//     .attr("fill", 'royalblue')
//     .selectAll("rect")
//     .data(data.sort((a, b) => d3.descending(a.score, b.score)))
//     .join("rect")
//       .attr("x", (d, i) => x(i))
//       .attr("y", d => y(d.score))
//       .attr('title', (d) => d.score)
//       .attr("class", "rect")
//       .attr("height", d => y(0) - y(d.score))
//       .attr("width", x.bandwidth());

//   function yAxis(g) {
//     g.attr("transform", `translate(${margin.left}, 0)`)
//       .call(d3.axisLeft(y).ticks(null, data.format))
//       .attr("font-size", '20px')
//   }

//   function xAxis(g) {
//     g.attr("transform", `translate(0,${height_chart - margin.bottom})`)
//       .call(d3.axisBottom(x).tickFormat(i => data[i].name))
//       .attr("font-size", '20px')
//   }

//   svg.append("g").call(xAxis);
//   svg.append("g").call(yAxis);
//   svg.node();
// })

////////////////////////////////////////////////////////////////////
// Reset button
////////////////////////////////////////////////////////////////////

// For now this only resets view, will add a function to reset graphs as well.

function reset() {

  // Delete dataLayerGroup if it exists
  if (map.hasLayer(dataLayerGroup)) {
    dataLayerGroup.remove();
    }
  countriesLayer.setStyle(standardStyle);

  // Reset zoom
  map.setView([55, 12], 3.5);

  // Close any open popup
  map.closePopup();

  // Delete d3 graph
  d3.select('#barplot').remove();
}