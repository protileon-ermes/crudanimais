import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Animais } from 'src/app/model/entities/Animais';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  public especie!: string;
  public nome!: string;
  public genero!: number;
  public peso!: number;
  public saude!: number;
  public imagem : any;
  public user : any;

  constructor(private alertController: AlertController, private router: Router, private firebase: FirebaseService,
    private auth : AuthService)  {
      this.user = this.auth.getUserLogged();
    }


  ngOnInit() {
  }

  registrar(){
    if(this.nome || this.especie || this .genero){
      let novo : Animais = new Animais(this.nome, this.especie, this.genero);
      novo.peso = this.peso;
      novo.saude= this.saude;
      novo.uid = this.user.uid;
      if(this.imagem){
        this.firebase.uploadImage(this.imagem, novo);
      }else{
        this.firebase.create(novo);
      }
      this.presentAlert("Sucesso", "Animal registrado!");
      this.router.navigate(["/home"]);
    }else{
     this.presentAlert("Erro", "Campos Obrigatórios!");
    }
  }


  uploadFile(imagem: any) {
    this.imagem = imagem.files
  }

  async presentAlert(subHeader: string, message: string){
    const alert = await this.alertController.create({
      header: 'registro de animais',
      subHeader: subHeader,
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }

}
