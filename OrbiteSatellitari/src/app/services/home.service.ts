import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  url = "http://localhost:8890/sparql";
  query = "SELECT ?p  ?c WHERE { ?p rdf:type <http://www.semanticweb.org/daniele/ontologies/2020/4/space-tracking-ontology#Planet>.}"
  key = "dba";
  showService(){
    return this.httpClient.get<any>(`${this.url}`+`?query=`+this.query+`&key=`+this.key+`&format=json`,)
  }
}
