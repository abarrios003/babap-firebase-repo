import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

import { Item } from '../models/item';

@Injectable()
export class Items {
  items: Item[] = [];
  defaultItem: any = {
    "name": "Andromeda",
    "profilePic": "assets/img/speakers/bear.jpg",
    "gender": 1,
    "birthday": "30/03/2017"
  };

  constructor(public http: Http, public api: Api) {
    let items = [
       {
         "name": "Andromeda",
         "profilePic": "assets/img/speakers/puppy.jpg",
         "gender": 1,
         "birthday": "30/03/2017"
       }
     ];

     for(let item of items) {
       this.items.push(new Item(item));
     }
  }

  query(params?: any) {
    if(!params) {
      return this.items;
    }
    console.log('items query');
    /*return this.api.get('/users', params)
      .map(resp => resp.json());*/
      return this.items.filter((item) => {
      for(let key in params) {
        let field = item[key];
        if(typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if(field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  /*query(params?: any) {
    if(!params) {
      return this.items;
    }
    return this.api.get('/items', params)
      .map(resp => resp.json());
  }*/


  /*query(params?: any) {
    if(!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for(let key in params) {
        let field = item[key];
        if(typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if(field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }*/

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

}
