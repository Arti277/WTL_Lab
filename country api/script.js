const btn = document.getElementById("searchBtn");
const result = document.getElementById("result");

btn.addEventListener("click", getCountry);

async function getCountry(){

    const country = document.getElementById("country").value.trim();

    if(country===""){

        alert("Please Enter Country Name");

        return;

    }

    const apiKey = "Kf6HR12X22KHovsDXFGUHOsJR8HVuvmHHfEFVXBM"; // <-- Paste your API key here

    try{

        const response = await fetch(
            `https://api.api-ninjas.com/v1/country?name=${country}`,
            {
                headers:{
                    "X-Api-Key": apiKey
                }
            }
        );

        if(!response.ok){

            throw new Error("Country Not Found");

        }

        const data = await response.json();

        if(data.length===0){

            result.innerHTML="<h3>Country Not Found</h3>";

            return;

        }

        const c = data[0];

        result.innerHTML=`

        <div class="mt-4">

            <h2>${c.name}</h2>

            <hr>

            <p><b>Capital :</b> ${c.capital}</p>

            <p><b>Region :</b> ${c.region}</p>

            <p><b>Population :</b> ${c.population.toLocaleString()}</p>

            <p><b>GDP :</b> ${c.gdp}</p>

            <p><b>Life Expectancy :</b> ${c.life_expectancy}</p>

            <p><b>Surface Area :</b> ${c.surface_area} km²</p>

            <p><b>Currency :</b> ${c.currency.code}</p>

        </div>

        `;

    }

    catch(error){

        result.innerHTML=`

        <div class="alert alert-danger">

            Country Not Found

        </div>

        `;

    }

}