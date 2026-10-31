const btn = document.getElementById("searchBtn");
const result = document.getElementById("result");

btn.addEventListener("click", getWeather);

async function getWeather(){

const city=document.getElementById("city").value.trim();

const apiKey="379acbd5d01947d1a6f85428260408";

try{

const response=await fetch(

`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`

);

if(!response.ok){

throw new Error("City Not Found");

}

const data=await response.json();

result.innerHTML=`

<h2>${data.location.name}</h2>

<h4>${data.location.country}</h4>

<img src="https:${data.current.condition.icon}">

<h3>${data.current.temp_c} °C</h3>

<p>${data.current.condition.text}</p>

<p><b>Humidity :</b> ${data.current.humidity}%</p>

<p><b>Wind :</b> ${data.current.wind_kph} km/h</p>

`;

}

catch(error){

result.innerHTML="<h3>City Not Found</h3>";

}

}