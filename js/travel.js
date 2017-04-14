var searchTerm = "";
var numResults = 0;
var startYear = 0;
var endYear = 0;
var queryURLBase = "https://rome2rio12.p.mashape.com/Search?currency=USD";
var queryOrigin = "&oKind=City&oName="
var queryDestination = "&dKind=City&dName="
var routeCounter = 0;
var resultsRoutes = [];
var resultsPlaces = [];
var latLongOrigin = [];
var latLongDest = [];
var resultsStops = [];
var routeCounter = 0;
var list = []; //holds long and lat. 

function runQuery(queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            "X-Mashape-Key": "wTjluRLWTZmshgzkfKtemOWxihc3p1pNnK7jsnmwuDknpCJ8Sc",
            "Accept": "application/json"
        }
    }).done(function(travelData) {


        console.log("------------------------------------");
        console.log("URL: " + queryURL);
        console.log("------------------------------------");
        console.log(travelData);
        console.log("------------------------------------");
        resultsRoutes = travelData.routes;
        resultsPlaces = travelData.places;
        console.log(resultsRoutes);
        console.log(resultsPlaces);


        var latLongOrigin = resultsPlaces[0].pos.split(",");

        var latLongDest = resultsPlaces[1].pos.split(",");


        var map = new google.maps.Map(document.getElementById('map'), {

            zoom: 4,

            center: { lat: Number(latLongOrigin[0]), lng: Number(latLongOrigin[1]) }

        });

        var marker = new google.maps.Marker({

            position: { lat: Number(latLongOrigin[0]), lng: Number(latLongOrigin[1]) },

            map: map
        })
        var marker = new google.maps.Marker({

            position: { lat: Number(latLongDest[0]), lng: Number(latLongDest[1]) },

            map: map
        })

        // WEATHER JSON FOLLOWS

        var lat = Number(latLongDest[0])
        var lon = Number(latLongDest[1])
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=9e016cbd27cc632126025c6503ebf608";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            var city = response.name;
            var descript = response.weather[0].description;
            var temp = response.main.temp;
            temp = Math.round(temp * 9 / 5 - 459.67)
            var humid = response.main.humidity;
            var wind = response.wind.speed;
            console.log("WEATHER CITY/DESCRIPTION/TEMP/HUMID/WIND FOLLOWS");
            console.log(city);
            console.log(descript);
            console.log(temp);
            console.log(humid);
            console.log(wind);
        })


        // var uluru = { lat: Number(latLongOrigin[0]), lng: Number(latLongOrigin[1]) }
        for (var i = 0; i < resultsRoutes.length; i++) {
            routeCounter++;
            resultsStops = resultsRoutes[i].stops;
            var wellSection = $("<div>");
            wellSection.addClass("well");
            wellSection.attr("id", "route-well-" + routeCounter);
            $("#well-section").append(wellSection);
            $("#route-well-" + routeCounter).append("<h3 class='articleHeadline'><span class='label label-primary'>" +
                routeCounter + "</span><strong> " +
                resultsRoutes[i].name + "</strong></h3>"
            );
            console.log(resultsRoutes[i].name);
            var distanceMiles = Math.round(resultsRoutes[i].distance * .62137119)
            $("#route-well-" + routeCounter).append("<h5> Distance this route: " + distanceMiles + " miles </h5>");
            var routePrice = resultsRoutes[i].indicativePrice.price;
            if (routePrice === undefined) {
                routePrice = "NOT AVAILABLE"
            } else {
                if (resultsRoutes[i].indicativePrice.currency = "USD") {
                    routePrice = "$ " + routePrice
                } else {
                    routePrice = routePrice + " " + resultsRoutes[i].indicativePrice.currency
                }
            }
            $("#route-well-" + routeCounter).append("<h5> Estimated price: " + routePrice + "</h5>");
            var duration = resultsRoutes[i].duration
            var durationHHMM = Math.round(duration / 60);
            durationHHMM = durationHHMM + ":" + ("0" + duration % 60).slice(-2)
            $("#route-well-" + routeCounter).append("<h5>Duration: " + durationHHMM + "</h5>");

            var tableDef = "<h4><strong><i>Stops & Route Information</i></strong></h4>" +
                '<table class="table">' +
                '<thead>' +
                '<tr>' +
                '<th>Type</th>' +
                '<th>Place</th>' +
                '<th>LL</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>'

            for (var j = 0; j < resultsStops.length; j++) {
                tableDef = tableDef + (`   
                      <tr>
                        <td>${resultsStops[j].kind}</td>
                        <td>${resultsStops[j].name}</td>
                        <td>${resultsStops[j].pos}</td>
                      </tr>
                `)
            }
            tableDef = tableDef + (`
                </tbody>
                </table>
            `);
            $("#route-well-" + routeCounter).append(tableDef);


        } //end first for loop 


    });
}


$("#run-search").on("click", function(event) {
    event.preventDefault();
    $("#well-section").empty();
    routeCounter = 0;
    searchTermOrigin = $("#search-term-origin").val().trim();
    searchTermDstination = $("#search-term-destination").val().trim();
    var queryURL = queryURLBase + queryOrigin + searchTermOrigin + queryDestination + searchTermDstination;
    runQuery(queryURL);
});
$("#clear-all").on("click", function() {
    routeCounter = 0;
    $("#well-section").empty();
});
