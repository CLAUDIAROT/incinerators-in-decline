// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */


var map = L.map('map', {minZoom: 0, maxZoom: 8}).setView([40.378, -100], 4);
var ejcommunity = [];
// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);


  var x = document.getElementById("EJlegend");
    x.style.display = "none";

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'tedc'
});

// Initialze source data
var source = new carto.source.SQL('SELECT * FROM gaia_interactivedata');
var source2 = new carto.source.SQL('SELECT * FROM usstates');

// Create style for the data
var style = new carto.style.CartoCSS(`
#layer {
  marker-width: 10;
  marker-fill: #ee9634;
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

var style2 = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #4961ad;
  polygon-opacity: 0.3;
}
#layer::outline {
  line-width: 0.1;
  line-color: #000000;
  line-opacity: 0.5;
}
`);

// Combine style and data to make a layer
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(source, style, {
  featureClickColumns: ['name', 'yr_built', 'state', 'operator', 'day_tonnage', 'lead_2014', 'merc_2014', 'pm25_2014', 'column_3mile_poc', 'column_3mile_pov', 'ej_comm', 'nox_2014', 'ej_yesno', 'closed', 'address', 'city', 'state'] 
});

var layer2 = new carto.layer.Layer(source2, style2);

var sidebar = document.querySelector('.sidebar-feature-content');
layer.on('featureClicked', function (event) {
  
  var content = '<h3>' + event.data['name'] + '</h3>'
  //content += '<div>$' + event.data['city'] + event.data['state'] ' per night</div>';
    if (event.data['closed']) {
    content += '<b><h6>CLOSED</h6></b>';
    }
    else {
    content += ' ';
    } 
    content += '<b>Address: </b>'+ event.data['address']
      content += ', ' + event.data['city'] ;
      content += ', ' + event.data['state'] ;
    content += '<br><b>Year of Construction</b>: ' + event.data['yr_built'] ;
    content += '<br><b>Operator:</b> ' + event.data['operator'] ;
    content += '<br><b>Daily Tonnage:</b> ' + event.data['day_tonnage'] ;
    
    content += '<br><br><h4>Pollution Data (in pounds) </h4>' ;
    content += '<b>2014 Lead :</b>  ' + event.data['lead_2014'] ;
    content += '<b><br>2014 Mercury :</b>  ' + event.data['merc_2014'] ;
    content += '<b><br>2014 PM2.5 :</b>  ' + event.data['pm25_2014'] ;
    content += '<b><br>2014 NOx :</b>  ' + event.data['nox_2014'] ;
  
    content += '<br><br><h4>Demographic Data 3-mile radius </h4>' ;
    content += '<b>Percentage Minority:</b> ' + event.data['column_3mile_poc'] ;
    content += '<br><b>Percentage Poverty:</b> ' + event.data['column_3mile_pov'] ;
    /// EJ community If statement
    if (event.data['ej_yesno']) {
    content += '<br><b> Located in an EJ community: </b> yes';
    }
    else {
    content += '<br><b> Located in an EJ community: </b> no';
    }
  
  sidebar.innerHTML = content;
});


var ejButton = document.querySelector('.toggle-ej');
ejButton.addEventListener('click', function () {
  // You can use style.setContent() to set the content to any CartoCSS you like
  style.setContent(`
#layer {
  marker-width: 10;
  marker-fill: ramp([ej_comm], (#ea8171, #f6d2a9, #f6d2a9, #DCB0F2, #B3B3B3), (1, 0, 58, ), "=", category);
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
  
  var x = document.getElementById("EJlegend");
    x.style.display = "block";
 
});

var tonnageButton = document.querySelector('.toggle-tonnage');
tonnageButton.addEventListener('click', function () {
  // You can use style.setContent() to set the content to any CartoCSS you like
  style.setContent(`
#layer {
  marker-width: ramp([day_tonnage], range(5, 20), quantiles(5));
  marker-fill: #007070;
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
  
  var x = document.getElementById("EJlegend");
    x.style.display = "none";
});


//////////////////////

var leadButton = document.querySelector('.toggle-lead');
leadButton.addEventListener('click', function () {
  // You can use style.setContent() to set the content to any CartoCSS you like
  style.setContent(`
#layer {
  marker-width: ramp([lead_2014], range(5, 20), quantiles(5));
  marker-fill: #5c4e0f;
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
    var x = document.getElementById("EJlegend");
    x.style.display = "none";
});

var mercuryButton = document.querySelector('.toggle-mercury');
mercuryButton.addEventListener('click', function () {
  // You can use style.setContent() to set the content to any CartoCSS you like
  style.setContent(`
#layer {
  marker-width: ramp([merc_2014], range(3, 16), quantiles(5));
  marker-fill: #ba533d;
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
    var x = document.getElementById("EJlegend");
    x.style.display = "none";
});

var noxButton = document.querySelector('.toggle-nox');
noxButton.addEventListener('click', function () {
  // You can use style.setContent() to set the content to any CartoCSS you like
  style.setContent(`
#layer {
  marker-width: ramp([nox_2014], range(5, 20), quantiles(5));
  marker-fill: #591195;
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
    var x = document.getElementById("EJlegend");
    x.style.display = "none";
});

var pm25Button = document.querySelector('.toggle-pm25');
pm25Button.addEventListener('click', function () {
  // You can use style.setContent() to set the content to any CartoCSS you like
  style.setContent(`
#layer {
  marker-width: ramp([pm25_2014], range(3, 16), quantiles(5));
  marker-fill: #ba3d6e;
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
    var x = document.getElementById("EJlegend");
    x.style.display = "none";
});

var nofilterButton = document.querySelector('.toggle-nofilter');
nofilterButton.addEventListener('click', function () {
  // You can use style.setContent() to set the content to any CartoCSS you like
  style.setContent(`
#layer {
  marker-width: 10;
  marker-fill: #ee9634;
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 0.5;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
    var x = document.getElementById("EJlegend");
    x.style.display = "none";
});


// Add the data to the map as a layer
client.addLayer(layer2);
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

