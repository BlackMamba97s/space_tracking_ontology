import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WikidataService {

  constructor(private httpClient: HttpClient) { 
  }

  url = "http://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageimages&format=json&piprop=original&titles=India"
  url2 = "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&formatversion=2&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=600&titles=Mars"
  showService(){
    return this.httpClient.get<any>(`${this.url2}`,)
  }
  
}