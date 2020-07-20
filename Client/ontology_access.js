const virtuoso_url = "http://localhost:8890/sparql";
const virtuoso_key = "dba";
let namespace_prefix = "space";
let namespace_uri = "";
const planet_description_url = "SELECT ?d WHERE {STO:Earth dc:description ?d.}";
const planet_class_property = "SELECT ?d WHERE {STO:Earth rdf:type ?d.}"

async function getPlanetDescription(planet){
    const query = `SELECT ?description WHERE {${namespace_prefix}:${planet} dc:description ?description}`;
    const complete_url = `${virtuoso_url}?query=${query}&key=${virtuoso_key}&format=json`
    let data = await fetch(complete_url).then(res=>res.json());
    return data.results.bindings[0].description.value;
}

async function getPlanetClass(planet){
    const query = `SELECT ?class ?label WHERE {${namespace_prefix}:${planet} rdf:type ?class. ?class rdfs:label ?label. filter(langMatches(lang(?label),"EN") || langMatches(lang(?label),""))}`;
    const complete_url = `${virtuoso_url}?query=${query}&key=${virtuoso_key}&format=json`
    let data = await fetch(complete_url).then(res=>res.json());
    let result_list = []
    for(let planetClass of data.results.bindings){
        result_list.push(planetClass.label.value)
    }
    return result_list;
    // return data.results.bindings[0].description.value;
}

async function getNamespace(){
    const query = 'SELECT ?uri ?prefix WHERE {?uri rdf:type owl:Ontology. ?uri vann:preferredNameSpacePrefix ?prefix. }'
    const complete_url = `${virtuoso_url}?query=${query}&key=${virtuoso_key}&format=json`
    let data = await fetch(complete_url).then(res=>res.json());
    namespace_uri = data.results.bindings[0].uri.value;
    namespace_prefix = data.results.bindings[0].prefix.value;
}

async function getPlanetList(){
    const query = `SELECT ?p WHERE {?p rdf:type ${namespace_prefix}:Planet}`;
    console.log(query);
    const complete_url = `${virtuoso_url}?query=${query}&key=${virtuoso_key}&format=json`;
    fetch(complete_url)
    .then(res=>res.json())
    .then(data=>{
        const planet_list = parsePlanetList(data)
        planet_list.forEach(el=> {
            $('#searchForm').append(`<option>${String(el)}</option>`)
        })
        $('#searchForm').selectpicker('refresh')
    })
}

function parsePlanetList(data){
    let result_list = []
    for(let result of data.results.bindings){
        result_list.push(result.p.value.split("#")[1])
    }
    return result_list
}

async function getOrbitalParameters(planet){
    const orbital_param_list = ['Argument_Of_Periapsis','Eccentricity','Inclination','Longitude_Of_The_Ascending_Node','Semimajor_Axis']
    const query = `SELECT distinct ?Argument_Of_Periapsis ?Eccentricity ?Inclination ?Longitude_Of_The_Ascending_Node ?Semimajor_Axis WHERE { ${namespace_prefix}:${planet} 
                    ${namespace_prefix}:Argument_Of_Periapsis ?Argument_Of_Periapsis;
                    ${namespace_prefix}:Eccentricity ?Eccentricity;
                    ${namespace_prefix}:Inclination ?Inclination;
                    ${namespace_prefix}:Longitude_Of_The_Ascending_Node ?Longitude_Of_The_Ascending_Node;
                    ${namespace_prefix}:Semimajor_Axis ?Semimajor_Axis.}`;
    const complete_url = `${virtuoso_url}?query=${query}&key=${virtuoso_key}&format=json`;
    let data = await fetch(complete_url).then(res=>res.json());
    console.log(data);
    let result = {}
    for(let param of orbital_param_list){
        result[param] = data.results.bindings[0][param].value;
    }
        
    return result;     
}

async function getThumbnail(planet){
    const wikimedia_query = "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&formatversion=2&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=300&titles=";
    let data = await fetch(wikimedia_query+planet).then(res => res.json());
    return data.query.pages[0].thumbnail.source;
}


// function getOrbitalParameters(data){
//     console.log(data)
//     let result_list = []
//     for(let result of data.results.bindings){
//         result_list.push(result.a.value)
//         result_list.push(result.b.value)
//         result_list.push(result.c.value)
//         result_list.push(result.d.value)
//         result_list.push(result.e.value)
//     }
//     return result_list
// }

