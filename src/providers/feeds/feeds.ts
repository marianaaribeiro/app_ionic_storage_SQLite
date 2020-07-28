import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class FeedsProvider {
  
  lista:any[];
  key:string = "feeds";

  constructor(public storage: Storage) {
    this.storage.ready().then(()=>{
      this.storage.get(this.key).then((dadosfeeds) => {
        if(dadosfeeds){
          this.lista = dadosfeeds;
        }else{
          this.lista = [];
        }
      });
    });
  }

  listar(){
    return this.lista
  }
  adicionar(dadosfeeds:any){
    this.storage.ready().then(()=>{
        this.lista.push(dadosfeeds);
        this.storage.set(this.key, this.lista);
    });
  }
  atualizar(feed,dados){
    for(let key in this.lista){
      if(this.lista[key] == feed){
        this.lista[key]= dados;
        this.storage.set(this.key, this.lista);
      }
    }
  }

  deletar(feed){
    for(let key in this.lista){
      if(this.lista[key] == feed){
        this.lista.splice(parseInt(key),1);
        this.storage.set(this.key, this.lista);
      }
    }
  }

  exibirfeed(feed: any){
    for(let key in this.lista){
      if(this.lista[key] == feed){
        
        this.lista.splice(parseInt(key),1);
      }
    }    
  }
}
