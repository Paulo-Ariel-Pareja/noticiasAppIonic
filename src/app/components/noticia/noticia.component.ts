import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/interfaces/interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DatalocalService } from '../../services/datalocal.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss']
})
export class NoticiaComponent implements OnInit {
  @Input() noticia: Article;
  @Input() index: number;
  @Input() enFavoritos;

  constructor(
    private iab: InAppBrowser,
    public actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private dataLocal: DatalocalService
  ) {}

  ngOnInit() {
  }

  abrirNoticia() {
    const browser = this.iab.create(this.noticia.url, '_system');
  }

  async lanzarMenu() {

    let guardarBorrarBtn;

    if ( this.enFavoritos ) {
      guardarBorrarBtn = {
        text: 'Eliminar favorito',
        icon: 'trash',
        cssClass: 'action-dark',
        handler: () => {
          this.dataLocal.borrarNoticias( this.noticia );
        }
      };
    } else {
      guardarBorrarBtn = {
        text: 'Favorito',
        icon: 'star',
        cssClass: 'action-dark',
        handler: () => {
          this.dataLocal.guardarNoticias( this.noticia );
        }
      };
    }

    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Compartir',
          icon: 'share',
          cssClass: 'action-dark',
          handler: () => {
            this.socialSharing.share(
              this.noticia.title,
              this.noticia.source.name,
              null,
              this.noticia.url
            );
          }
        },
        guardarBorrarBtn,
        {
          text: 'Cancelar',
          icon: 'close',
          cssClass: 'action-dark',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

}
