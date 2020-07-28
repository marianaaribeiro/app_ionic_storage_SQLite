import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FeedsProvider } from '../../providers/feeds/feeds';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MapaPage } from '../mapa/mapa';


interface IFeed {
  titulo: string;
  atores: string;
  descricao: string;
  imagemPost: string;
}
interface IDadosP {
  nomeUsuario: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  feed: IFeed = { titulo: '', atores: '', descricao: '', imagemPost: '' };
  feeds: IFeed[];
  dadosP: IDadosP = { nomeUsuario: '' };
  dadosPs: IDadosP[];


  Post: boolean = true;
  editar: boolean = true;
  cadastrar: boolean = true;
  apresentacao: boolean = true;
  menu: boolean = true;
  cadastroPessoal: boolean = true;
  toolbar1: boolean = true;
  acessarApp: boolean = true;
  outrosSlides: boolean = true;
  menu1: boolean = true;
  menu2: boolean = true;
  menu3: boolean = true;
  menu4: boolean = true;


  editandofeed: boolean = false;
  feedEditando: IFeed;
  exibircadastrandoPost: IFeed;
  lista: any[];

  key: string = "feeds";


  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public feedProvider: FeedsProvider,
    public storage: Storage,
    private camera: Camera,
    public alertCtrl: AlertController, ) {
    this.storage.ready().then(() => {
      this.storage.get(this.key).then((dadosfeeds) => {
        if (dadosfeeds) {
          this.lista = dadosfeeds;
        } else {
          this.lista = [];
        }
      });
    });

  }

  doRefresh(lista) {
    console.log('Begin async operation', lista);

    setTimeout(() => {
      this.viewCtrl._didEnter();
      lista.complete();
    }, 2000);
  }
  ionViewDidLoad() {
    this.lista;
  }

  ionViewDidEnter() {
    this.feeds = this.feedProvider.listar();
  }
  novoPost() {
    this.feed = { titulo: '', atores: '', descricao: '', imagemPost: '' };
    this.Post = true;
    this.menu = false;
    this.menu3 = false
    this.menu2 = true;
    this.menu1 = false;
    this.cadastrar = false;
    this.editandofeed = false;
  }
  goExibirPost(feed: IFeed) {
    this.feed = { titulo: feed.titulo, atores: feed.atores, descricao: feed.descricao, imagemPost: feed.imagemPost };
    this.Post = false;
    this.cadastrar = true;
    this.menu2 = false;
    this.menu3 = true;
    this.menu1 = false;
  }
  goEditarPost(feed: IFeed) {
    this.feed = { titulo: feed.titulo, atores: feed.atores, descricao: feed.descricao, imagemPost: feed.imagemPost };
    this.Post = true;
    this.cadastrar = false;
    this.menu4 = true;
    this.menu1 = true;
    this.editandofeed = true;
    this.feedEditando = feed;
    this.menu = false;
    this.menu3 = true;
    this.menu2 = false;
    this.menu1 = true;
  }

  adicionarFeed() {
    if (this.feed.titulo != "" && this.feed.atores != "" && this.feed.descricao != "" && this.feed.imagemPost != "") {
      this.feedProvider.adicionar(this.feed);
      this.Post = false;
      this.apresentacao = false;
      this.cadastrar = true;
      this.menu = false;
      this.menu1 = false;
      this.toolbar1 = false;
      this.menu2 = false;
      this.menu3 = true;
      this.menu4 = true;
      this.viewCtrl._didEnter();
      this.feed = { titulo: '', atores: '', descricao: '', imagemPost: '' };
    } else {
      alert("Preencher campo obrigatório: Titulo da Feed")
    }

  }
  goSlider() {
    this.apresentacao = true;
    this.outrosSlides = true;
    this.Post = true;
    this.menu = true;
  }

  editarFeed(feed: IFeed) {
    this.feed = { titulo: feed.titulo, atores: feed.atores, descricao: feed.descricao, imagemPost: feed.imagemPost };
    this.editandofeed = true;
    this.feedEditando = feed;
    this.outrosSlides = false;
    this.Post = false;
    this.apresentacao = false;
    this.menu = true;
    this.menu1 = true;
    this.toolbar1 = false;
    this.menu2 = true;
    this.menu3 = true;
    this.menu4 = false;
  }
  cancelarEditacaoFeed() {
    this.feed = { titulo: '', atores: '', descricao: '', imagemPost: '' };
    this.Post = false;
    this.cadastrar = true;
    this.menu = false;
    this.menu1 = false;
    this.toolbar1 = false;
    this.menu2 = false;
    this.menu3 = true;
    this.menu4 = true;
    this.outrosSlides = false;
    this.apresentacao = false;
    this.editandofeed = false;
    this.viewCtrl._didEnter();
  }
  atualizarFeed() {
    if (this.feed.titulo != "" && this.feed.atores != "" && this.feed.descricao != "") {
      this.feedProvider.atualizar(this.feedEditando, this.feed);
      this.Post = false;
      this.cadastrar = true;
      this.menu = false;
      this.menu1 = false;
      this.toolbar1 = false;
      this.menu2 = false;
      this.menu3 = true;
      this.menu4 = true;
      this.editandofeed = false;
      this.cancelarEditacaoFeed();
      this.viewCtrl._didEnter();
    }
  }
  deletarFeed(feed: IFeed) {
    if (this.feed.titulo != "" && this.feed.atores != "" && this.feed.descricao != "" && this.feed.imagemPost != "") {
      this.feedProvider.deletar(feed);
      this.feed = { titulo: '', atores: '', descricao: '', imagemPost: '' };
      this.editandofeed = false;
    } else {
      alert("Não foi possível remover no momento. Tente mais tarde!")
    }
  }
  gocamera(type) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: true,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: type == "picture" ?
        this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      correctOrientation: true,
      allowEdit: true,
      targetHeight: 100,
      targetWidth: 100,

    }
    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.feed.imagemPost = base64Image;
    }, (err) => {
      this.displayErrorAlert(err);
    })
      .catch((err) => {
        console.error(err);
      });
  }
  displayErrorAlert(err) {
    console.log(err);
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Error ao usar a câmera',
      buttons: ['OK']
    });
    alert.present();
  }

  //slide

  slides = [
    {
      title: "Conheça o BlogLife",
      description: "Com esse <b class='estiloSlide2'>Aplicativo</b> é possível salvar suas melhores postagens e tirar fotos com auto padrão de qualidade.",
      image: "assets/imgs/blog2.jpg",
    },
    {
      title: "Como funciona?",
      description: "Para <b class='estiloSlide2'>cadastrar uma postagem</b> é preciso clicar no menu, um botão no canto superior á direita.",
      image: "assets/imgs/blog5.png",
    },
    {
      title: "Como faço para apagar um post?",
      description: "Para <b>deletar uma postagem</b> é preciso clicar no botão editar para habilitar a função remover.",
      image: "assets/imgs/20171031_131231.jpg",
    }
  ];
  verificando() {
    this.outrosSlides = false;
    this.Post = false;
    this.apresentacao = false;
    this.menu = false;
    this.menu1 = false;
    this.toolbar1 = false;
    this.menu2 = false;
    this.menu3 = true;
    this.menu4 = true;
    this.viewCtrl._didEnter();
  }

  goMapa() {
    this.navCtrl.push(MapaPage);
  }

}
