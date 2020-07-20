let planets = {};

$(document).ready(async function(){
    $('#searchForm').on('changed.bs.select', function () {
        let selected = $('#searchForm').val();
        findSelectedPlanets(selected);
    });
    await getNamespace();
    await getPlanetList();
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
            if(val == "Mercury") val = val + "_(planet)"
            let thumbnail = await getThumbnail(val);
            if(val == "Mercury_(planet)") val = "Mercury"
            let description = await getPlanetDescription(val);
            planetClasses = await getPlanetClass(val);
            // console.log(planetClasses)
            planets[val] = {
                "name": val,
                "thumbnail": thumbnail,
                "param_list" : orbital_param_list,
                "description" : description,
                "classes" : planetClasses
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
        <div class="container border border-secondary my-1 px-3 py-1">
            <!-- row 1, title of the planet -->
            <div class="row my-1">
            <div class="col">
                <h2 class=" pt-2 pb-2 border-bottom text-center">${planet.name}</h2>
            </div>
            </div>
            <!-- row 2 image and description -->
            <div class="row border-bottom p-3 my-1 mx-0">
                <div class="col">
                    <p>
                    ${planet.description}
                    </p>
                </div>
                <div style='background-image:url("${planet.thumbnail}");' class="planet-thumbnail rounded-circle"></div>
            </div>
            <!-- row 3, orbits and other things about the specific planet -->
            <div class="row pt-1 my-1">
                <div class="col"><h1 class="text-center w-100">Orbital Parameters</h1></div>
                <table class="table text-center">
                    <thead>
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
                        <td>${planet.param_list["Argument_Of_Periapsis"]}</th>
                        <td>${planet.param_list["Eccentricity"]}</td>
                        <td>${planet.param_list["Inclination"]}</td>
                        <td>${planet.param_list["Longitude_Of_The_Ascending_Node"]}</td>
                        <td>${planet.param_list["Semimajor_Axis"]}</td>
                      </tr>
                    </tbody>
                  </table>
            </div>
            <div class="border-top  row pt-3 my-1">
                <div class="col">
                    <p>
                      Il pianeta ${planet.name} appartiene alla/e classe/i: ${planet.classes}
                    </p>
                </div>
            </div>
        </div>
      `);
    }
    

}



