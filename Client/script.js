let planets = {};

$(document).ready(async function(){
    $('#searchForm').on('changed.bs.select', function () {
        let selected = $('#searchForm').val();
        findSelectedPlanets(selected);
    });
    await getNamespace();
    await getPlanetList();
    await getAliases("Q525");
})






async function findSelectedPlanets(selected_planets){
    for(let i in planets){
        if(selected_planets.indexOf(i)<0){
            delete planets[i];
        }
    }
    console.log("searching for planets", selected_planets)
    for(let val of selected_planets){

        if(planets[val] === undefined){
            console.log("fetching:" + val);      
            let orbital_param_list = await getOrbitalParameters(val);
            console.log(val)
            // dobbiamo mettere il nuovo wiki title
            let des = await getPlanetDescription(val);
            let thumbnail = await getThumbnail(des.wikipediaTitle);
            let planetClasses = await getPlanetClass(val);
            let orbiters = await getOrbitingSatellites(val);
            let aliases = await getAliases(des.wikidataCode);
            // console.log(planetClasses)
            planets[val] = {
                "name": val,
                "thumbnail": thumbnail,
                "param_list" : orbital_param_list,
                "description" : des.description,
                "wikipediaTitle" : des.wikipediaTitle,
                "wikidataCode": des.wikidataCode,
                "orbiters": orbiters,
                "classes" : planetClasses,
                "aliases" : aliases
            };
        
        }
    }
    renderPlanetBox(planets); 

}


function renderPlanetBox(planets){
    $("#planetContainer").empty();
    for(let i in planets){
        const planet = planets[i];
        $("#planetContainer").append(`
        <div class="col-md-6 mb-2">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">${planet.name}</h2>
                    <p><strong>AKA: </strong>${planet.aliases.join(", ")}</p>
                </div>
                <img src="${planet.thumbnail}"  class="card-img-top" alt="${planet.name}">
                <div class="card-body">
                    <p class="card-text">
                        ${planet.description}
                    </p>
                    <h4>Orbital Parameters</h4>
                    <table class="table text-center">
                        <thead
                        <tr>
                            <th scope="col">Argument Of Periapsis</th>
                            <th scope="col">Eccentricity</th>
                            <th scope="col">Inclination</th>
                            <th scope="col">Longitude Of The Ascending Node</th>
                            <th scope="col">Semimajor Axis</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>${planet.param_list["Argument_Of_Periapsis"] || "None"}</th>
                            <td>${planet.param_list["Eccentricity"]|| "None"}</td>
                            <td>${planet.param_list["Inclination"]|| "None"}</td>
                            <td>${planet.param_list["Longitude_Of_The_Ascending_Node"] || "None"}</td>
                            <td>${planet.param_list["Semimajor_Axis"] || "None"}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="row">
                        <div class="col border p-3">
                            <h5>Categories</h5>
                            ${planet.classes.join(", ")}
                        </div>
                        <div class="col border p-3">
                            <h5>Orbiting Satellites</h5>
                            ${planet.orbiters.join(", ") || "None"}
                        </div>
                    </div>
                </div>
            </div>
        </div>

      `);
    }
    

}



