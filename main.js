const myWeatherKey = "5e48737105064d88937111426241303";

// Get form elements
const locationInput = document.querySelector(".location-input");
const searchButton = document.querySelector(".search-button");
const form = document.querySelector(".weather-form");
const body = document.querySelector("body");

//Get rest of elements
const humidityP = document.querySelector(".humidity");
const windSpeedP = document.querySelector(".wind-speed");
const temperatureP = document.querySelector(".temperature");
const locationP = document.querySelector(".location");
const weatherImg = document.querySelector(".weather-img");
const errorP = document.querySelector(".error-p");
const container = document.querySelector(".container");
const moreInfoSection = document.querySelector(".more-info");
const outerContainer = document.querySelector(".outer-container");
const moreInfoLink = document.querySelector(".more-info-link");
const dataDescriptionDiv = document.querySelector(".data-description");

let condition; //condition of weather (rainy...)



const weatherObj = {
    temp: 0,
    name: "",
    humidity: 0,
    windSpeed: 0
}

let imgState = 1; //decides what image is displayed in the background

const toProperCase = (words) => {
    words = words.toString();
    const splitArray = words.split("_");
    const newWords = splitArray.map((word) => {
        return word[0].toUpperCase() + word.slice(1);
    })

    let finalWords = "";
    newWords.forEach(word => {
        finalWords += word + " ";
    })

    return finalWords;
}

// Change background of container on click or hover

const changeContainerBackground = () => {
    if (imgState === 1) {
        container.style.backgroundImage = "linear-gradient(135deg, rgba(128, 0, 128, 0.4), rgba(50, 191, 50, 0.4))";
        imgState = 2;
    } else {
        container.style.backgroundImage = "none";
        container.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        imgState = 1;
    }
}
weatherImg.addEventListener("click", (event) => {
    changeContainerBackground();
    console.log("image clicked");
})
container.addEventListener("mouseover", (event) => {
    changeContainerBackground();
})
container.addEventListener("mouseout", (event) => {
    changeContainerBackground();
})



form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!locationInput.value) {
        // alert("Please enter a location :)");
        displayMessage("🥲 'Nothing' is not a place");
    } else {
        const getData = fetch(
            `http://api.weatherapi.com/v1/current.json?key=${myWeatherKey}&q=${locationInput.value}`
        );

        getData.then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse);
            flow(jsonResponse);
        }).catch(value => {
            console.log("CATCH:" + value);
            displayMessage("😣It appears that place does not exist😟 Please check your spelling🥲");
        })

    }
})

//clicking the more info button, opens the more info section
//and starts the animation
moreInfoLink.addEventListener("click", event => {
    moreInfoSection.style.display = "flex";

    let div = moreInfoSection.firstElementChild;
    for (let i = 0; i < moreInfoSection.childElementCount; i++) {
        div.classList.add("collapse-margin");
        div = div.nextElementSibling;
    }


})

//overall flow of udpating weather object, updateing dom, and other stuff
const flow = (jsonResponse) => {
    updateWeatherObj(jsonResponse);
    updateDom();
    displayAllData(jsonResponse);
    errorP.style.display = "none";
    locationInput.blur();
    moreInfoLink.style.display = "inline-flex";
    moreInfoSection.style.display = "none";
    dataDescriptionDiv.classList.remove("slide-into-view");
}

const updateWeatherObj = (jsonResponse) => {
    weatherObj.name = jsonResponse.location.name;
    weatherObj.temp = jsonResponse.current.temp_c;
    weatherObj.humidity = jsonResponse.current.humidity;
    weatherObj.windSpeed = jsonResponse.current.wind_kph;
    condition = jsonResponse.current.condition.text;
}

const updateDom = () => {
    humidityP.textContent = weatherObj.humidity + "%";
    windSpeedP.textContent = weatherObj.windSpeed + " km/h";
    temperatureP.textContent = weatherObj.temp + "°C";
    locationP.textContent = weatherObj.name;

    setImages();
}

//display message on a paragraph element on the dom
const displayMessage = (message) => {
    errorP.style.display = "block";
    errorP.textContent = message;
    moreInfoLink.style.display = "none";
    moreInfoSection.textContent = "";
    moreInfoSection.style.display = "none";
    locationP.textContent = "?";


}

//update weather icon and backgrounds on dom
const setImages = () => {

    if (condition.toLowerCase().includes("cloudy")) {
        weatherImg.src = "img/cloudy.png";
    } else if (condition.toLowerCase().includes("rain")) {
        weatherImg.src = "img/rainy.png";
    } else if (condition.toLowerCase().includes("storm")) {
        weatherImg.src = "img/stormy.png";
    } else if (condition.toLowerCase().includes("sun")) {
        weatherImg.src = "img/sunny.png";
    } else if (condition.toLowerCase().includes("wind")) {
        weatherImg.src = "img/windy.png";
    }

    // backgrounds
    let rand = Math.floor(Math.random() * 2 + 1);
    console.log(`set images ran, rand:${rand}, condition: ${condition}`);


    outerContainer.style.backgroundPosition = "center";
    outerContainer.style.backgroundSize = "cover";
    if (condition.toLowerCase().includes("cloudy")) {
        outerContainer.style.backgroundImage = `url('backgrounds/cloudy_background_${rand}.jpg')`;
    } else if (condition.toLowerCase().includes("rain")) {
        outerContainer.style.backgroundImage = `url('backgrounds/rainy_background_${rand}.jpg')`;
    } else if (condition.toLowerCase().includes("storm")) {
        outerContainer.style.backgroundImage = `url('backgrounds/stormy_background_${rand}.jpg')`;
    } else if (condition.toLowerCase().includes("sun")) {
        outerContainer.style.backgroundImage = `url('backgrounds/sunny_background_${rand}.jpg')`;
    } else if (condition.toLowerCase().includes("wind")) {
        outerContainer.style.backgroundImage = `url('backgrounds/windy_background_${rand}.jpg')`;
    }


}

//display additional data from the json, aside from the data in the main card [<section class="container">]
const displayAllData = (jsonResponse) => {
    moreInfoSection.textContent = "";
    let marginTop = 400;

    for (let key in jsonResponse.location) {
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const div = document.createElement("div");

        div.classList.add("name-value", key.toString());
        div.style.marginTop = `${marginTop}px`;
        div.appendChild(p1);
        div.appendChild(p2);

        p1.textContent = toProperCase(key) + ":  ";
        p2.textContent = toProperCase(jsonResponse.location[key]);

        moreInfoSection.appendChild(div);
        marginTop += 200;


        div.addEventListener("click", (event) => {
            // console.log(event.currentTarget.classList.toString());
            updateDataDescriptionDiv(event.currentTarget);

        })

    }


    const hr = document.createElement("hr");
    hr.style.width = "100%";
    hr.style.border = "2px dotted black";
    moreInfoSection.appendChild(hr);


    for (let key in jsonResponse.current) {
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const div = document.createElement("div");

        div.classList.add("name-value", key.toString());
        div.appendChild(p1);
        div.appendChild(p2);

        p1.textContent = toProperCase(key) + ":  ";
        p2.textContent = toProperCase(jsonResponse.current[key]);

        moreInfoSection.appendChild(div);


        div.addEventListener("click", (event) => {
            // event.stopPropagation();
            // console.log(event.currentTarget.classList.toString());
            updateDataDescriptionDiv(event.currentTarget);
        })
    }

}

const descriptions = {
    country: "South Africa",
    lat: `Latitude measures the distance north or south of the equator.`,
    localtime: "The current time of the area since you searched the area.",
    localtime_epoch: 'The epoch time is defined as the elapsed milliseconds since the 1970 date in UTC. UTC stands for Coordinated Universal Time, a standard used to set all time zones around the world. Local time epoch is adjusted to your timezone by adding or subtracting some hours.',
    lon: `Longitude measures distance east or west of the prime meridian.`,
    name: "Most specific location inside the region. The weather displayed is of this location.",
    region: "There are multiple in a country. More specific than country. ",
    tz_id: `The “Tz Id” stands for Time Zone Identifier. It’s a unique identifier used by computer systems to determine the time settings for a specific region.`,

    cloud: `Amount of clouds in the sky.`,
    feelslike_c: `What the temperature of the area feels like in degrees celcius.`,
    feelslike_f: `What the temperature of the area feels like in ferenheit.`,
    gust_kph: `The speed of a sudden, brief rush of wind. In kilometers per hour.`,
    gust_mph: `The speed of a sudden, brief rush of wind. In miles per hour.`,
    humidity: `Concentration of water vapor present in the air. In percentage.`,
    is_day: `1: It is daytime, 0: It is nighttime.`,
    last_updated:"Details were last updated at this time.",
    last_updated_epoch:`The epoch time is defined as the elapsed milliseconds since the 1970 date in UTC. UTC stands for Coordinated Universal Time, a standard used to set all time zones around the world.`,
    precip_in: `The amount of precipitation (rain) that has fallen in inches.`,
    precip_mm: `The amount of precipitation (rain) that has fallen in millimeters.`,
    pressure_in: `The barometric or atmospheric pressure, measured in inches of Mercury (inHg).`,
    pressure_mb: `The barometric or atmospheric pressure, measured in millibars.`,
    temp_c:`The temperature in degrees celcius.`,
    temp_f:`The temperature in ferenheit.`,
    uv: `The ultraviolet index, or UV index, is an international standard measurement of the strength of the sunburn-producing ultraviolet radiation at a particular place and time. It ranges from 1 (low) to 11 (High).`,
    vis_km: `Visibility. The distance at which an object or light can be clearly discerned. In kilometers.`,
    vis_miles: `Visibility. The distance at which an object or light can be clearly discerned. In miles.`,
    wind_degree: `Wind coming from the North (northerly wind) is said to be coming from "0 degrees", easterly wind is said to be coming from "90 degrees", and southerly wind comes from "180 degrees", etc.`,
    wind_dir: `Where wind is coming from: N: North. S: South. E: East. W: West.`,
    wind_kph: `Speed of the wind in kilometers per hour.`,
    wind_mph: `Speed of the wind in miles per hour.`


}

const updateDataDescriptionDiv = (div) => {
    
    dataDescriptionDiv.classList.remove("slide-into-view");
    dataDescriptionDiv.classList.add("slide-out-of-view");
    
    
    dataDescriptionDiv.addEventListener("animationend", (event)=>{
        dataDescriptionDiv.classList.remove("slide-out-of-view");
        dataDescriptionDiv.classList.add("slide-into-view");

        for (let key in descriptions ) {
            if (div.classList.toString().includes(` ${key} `)){
                dataDescriptionDiv.textContent = descriptions[key];
            }
        }
    })
    // setTimeout(() => {
    //     dataDescriptionDiv.classList.remove("slide-out-of-view");
    //     dataDescriptionDiv.classList.add("slide-into-view");
    // }, 50)

}





