import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  HtmlInfoWindow,
  Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';


@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  map: GoogleMap;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public googleMaps: GoogleMaps,
              public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapaPage');
    this.exibindoMapa();
  }

  ngAfterViewInit() {
    this.exibindoMapa();
   }

   exibindoMapa(){
    let element: HTMLElement = document.getElementById('map');
    let config:any = {
      controls: {myLocationButton: true,zoom:true,compass: true, myLocation: true, mapToolbar: true}
    };
    let map: GoogleMap = GoogleMaps.create(element,config);

    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.geolocation.getCurrentPosition().then((resp) => {
         console.log('Map is ready!');
         // Now you can add elements to the map like the marker
         let posicao: LatLng = new LatLng(resp.coords.latitude,resp.coords.longitude);

         // create CameraPosition
         let position: CameraPosition<any> = {           
            target: posicao,
            zoom: 15,
            tilt: 30         
            };

         // move the map's camera to position
         map.moveCamera(position);

         this.map.addMarkerSync({
          title: 'Sua posição',
          icon: 'green',
          animation: 'DROP',
          position: {
            lat: resp.coords.latitude,
            lng: resp.coords.longitude
          }
        });

        let htmlInfoWindow = new HtmlInfoWindow();
        let identificacao: HTMLElement = document.createElement('div');
        identificacao.innerHTML = [
          '<ion-avatar><img src="assets/imgs/6.jpg"></ion-avatar>'
        ].join("");
        identificacao.getElementsByTagName("img")[0].addEventListener("click", () => {
          htmlInfoWindow.setBackgroundColor('red');
        });
        htmlInfoWindow.setContent(identificacao, {width: "280px", height: "330px"});

        this.map.addMarker({
          position: {lat: resp.coords.latitude, lng: resp.coords.longitude},
          draggable: true,
          disableAutoPan: true
        }).then((marker: Marker) => {
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            htmlInfoWindow.open(marker);
          });
        });        
      });
    });
   }
}
