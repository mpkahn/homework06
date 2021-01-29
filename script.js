$(document).ready(function () {
 
//globally declare both date and the city input value
 let date = new Date();
 let userCity = $("#userInput").val();

 //main search on button click - will call other functions as well
$("#searchButton").on("click", function(event) {
    event.preventDefault();
    
    userCity = $("#userInput").val();
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=8a66d6c395067b39a71782c54e212fa4";
    console.log(queryURL);
    console.log(userCity);
    
    $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
        console.log(response);
        console.log(response.name);
       
        
        let cityTemp = (response.main.temp - 273.15) * 1.8 + 32;
        console.log(Math.floor(cityTemp));

        //call all other functions
        cityWeather(response);
        forecast(response);
        listCities();
    });
});

//fucntion to create + populate card with today's weather data
function cityWeather(response) {
    let cityTemp = (response.main.temp - 273.15) * 1.8 + 32;
    console.log(Math.floor(cityTemp));

    //clear any previous data
    $("#cityWeather").empty();

    //create various card elements for weather data
    const mainCard = $("<div>").addClass("card");
    const mainCardContent = $("<div>").addClass("card-body");
    const city = $("<h4>").text(response.name);
    const todayDate = $("<h5>").text(date.toLocaleDateString('en-US'));
    const tempToday = $("<p>").text("Temperature: " + cityTemp.toFixed(2) + "°F");
    const condition = $("<p>").text("Condition: " + response.weather[0].main);
    const humid = $("<p>").text("Humidity: " + response.main.humidity + "%");
    const wind = $("<p>").text("WindSpeed: " + response.wind.speed + " mph");
    const icon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png" ).addClass("main-image");

    //append all above elements to create card layout
    city.append(todayDate, icon);
    mainCardContent.append(city, condition, tempToday, humid, wind);
    mainCard.append(mainCardContent);
    $("#cityWeather").append(mainCard)

}

//function to create + populate 5-day forecast cards
function forecast() {
  //ajax function to pull FORECAST (not weather) info from api
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&appid=8a66d6c395067b39a71782c54e212fa4",
        method: "GET"
      })
        .then(function(response) {
            console.log(response);
        $("#forecast").empty();
            //^empty any current forecast data
            
        let results = response.list;
        console.log(results);

            //create for-loop to run through the array of dates returned by GET function
        for(let i = 0; i < results.length; i++) {
           //pull date text info and save as day variable
            let day = results[i].dt_txt;
            
            //ensure only pulling 1 set of weather data per date
            if(results[i].dt_txt.indexOf("12:00:00") !== -1){
                let rawTemp = ((results[i].main.temp - 273.15) * 1.80 + 32);
                let cityTemp = Math.floor(rawTemp);
                console.log(cityTemp);

                //create all forecast card elements and pull relevant data from JSON object
                const forecastCard = $("<div>").addClass("card col-md-2 text-white bg-info ml-4");
                const forecastCardContent = $("<div>").addClass("card-body p-3");
                const weatherDate = $("<h4>").text(day);
                const condition = $("<p>").text(results[i].weather[0].main);
                const tempFuture = $("<p>").text("Temp: " + Math.round(cityTemp) + " °F");
                const humid = $("<p>").text("Humidity: " + results[i].main.humidity + "%");
                const icon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

                //append all created elements/data
                forecastCardContent.append(weatherDate, icon, tempFuture, condition, humid);
                forecastCard.append(forecastCardContent);
                $("#forecast").append(forecastCard)
            }
        }
});
}

//adds a list item to the list element whenever a city is entered
function listCities() {
    let cityList = $("<li>").addClass("list-group-item").text(userCity);
    $(".list").append(cityList);
  }

});