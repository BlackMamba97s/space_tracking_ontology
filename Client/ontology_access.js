const virtuoso_url = "http://localhost:8890/sparql";
const virtuoso_key = "dba";
let namespace_prefix = "space";
let namespace_uri = "";

async function getOrbitingSatellites(planet){
    const query = `SELECT ?satellite WHERE {?satellite ${namespace_prefix}:Orbits_Around ${namespace_prefix}:${planet} . }`;
    const complete_url = `${virtuoso_url}?query=${query}&key=${virtuoso_key}&format=json`
    let data = await fetch(complete_url).then(res=>res.json());
    return parseList(data, "satellite");
}

async function getPlanetDescription(planet){
    const query = `SELECT * WHERE {
        ${namespace_prefix}:${planet} dc:description ?description; 
                ${namespace_prefix}:wikipediaTitle ?wikipediaTitle;
                ${namespace_prefix}:wikidataCode ?wikidataCode.
        }`;
    const complete_url = `${virtuoso_url}?query=${query}&key=${virtuoso_key}&format=json`
    let data = await fetch(complete_url).then(res=>res.json());
    console.log(data)
    return { 
        "description": data.results.bindings[0].description.value,
        "wikipediaTitle": data.results.bindings[0].wikipediaTitle.value,
        "wikidataCode": data.results.bindings[0].wikidataCode.value,
    };
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
    const query = `SELECT ?name WHERE { ?name rdf:type ?class. FILTER(regex(STR(?class), ${namespace_prefix}:Planet ) || regex(STR(?class), ${namespace_prefix}:Star))} `;
    const complete_url = `${virtuoso_url}?query=${query}&key=${virtuoso_key}&format=json`;
    fetch(complete_url)
    .then(res=>res.json())
    .then(data=>{
        const planet_list = parseList(data, "name");
        planet_list.forEach(el=> {
            $('#searchForm').append(`<option>${String(el)}</option>`)
        })
        $('#searchForm').selectpicker('refresh')
    })
}

function parseList(data, field){
    let result_list = []
    for(let result of data.results.bindings){
        result_list.push(result[field].value.split("#")[1])
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
    if(data.results.bindings.length > 0){
        console.log("look, im the sun")
        for(let param of orbital_param_list){
            result[param] = data.results.bindings[0][param].value;
        }
    }
    return result;     
}

async function getThumbnail(planet){
    const wikimedia_query = "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&formatversion=2&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=300&titles=";
    let data = await fetch(wikimedia_query+planet).then(res => res.json());
    return data.query.pages[0].thumbnail.source;
}

async function getAliases(planet){
    const wikidata_query = `SELECT * {wd:${planet} skos:altLabel ?altLabel . FILTER (langMatches(lang(?altLabel), "en")) }`;
    const wikidata_url = `https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=${wikidata_query}&format=json`;
    console.log(wikidata_url);
    let data = await fetch(wikidata_url).then(res => res.json());
    let aliases = [];
    for(let alias of data.results.bindings){
        aliases.push(alias.altLabel.value);
    }
    return aliases;
}



