import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  url = "http://localhost:8890/sparql";
  query = "SELECT ?p  ?c WHERE {cinema2:IPredatoriDellArcaPerduta cinema2:haPersonaggio ?p ; cinema2:ambientatoIn ?c .}"
  key = "dba";
  showService(){
    return this.httpClient.get<any>(`${this.url}`+`?query=`+this.query+`&key=`+this.key+`&format=json`,)
  }
}
