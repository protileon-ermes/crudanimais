import { Injectable } from "@angular/core";
import { Animais } from "../entities/Animais";
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private PATH : string = 'animais';

    constructor(private firestore: AngularFirestore, private storage : AngularFireStorage) {}

    read(uid: string){
      return this.firestore.collection(this.PATH,
        ref => ref.where('uid', '==', uid))
      .snapshotChanges();
    }

    create(animal: Animais){
        return this.firestore
        .collection(this.PATH).add({
            especie: animal.especie,
            nome: animal.nome,
            genero: animal.genero,
            peso: animal.peso,
            saude: animal.saude,
            uid: animal.uid
        });
    }

    update(animal: Animais, id: string){
        return this.firestore
        .collection(this.PATH).doc(id).update({
            especie: animal.especie,
            nome: animal.nome,
            genero: animal.genero,
            peso: animal.peso,
            saude: animal.saude,
            uid: animal.uid
        });
    }

    delete(id:string){
        return this.firestore
        .collection(this.PATH).doc(id).delete();
    }

    uploadImage(imagem: any, animais: Animais){
        const file = imagem.item(0);
        if(file.type.split('/')[0] !== 'image'){
          console.error('Tipo Não Suportado');
          return;
        }
        const path = `images/${animais.nome}_${file.name}`;
        const fileRef = this.storage.ref(path);
        let task = this.storage.upload(path,file);
        task.snapshotChanges().pipe(
          finalize(()=>{
            let uploadedFileURL = fileRef.getDownloadURL();
            uploadedFileURL.subscribe(resp=>{
              animais.downloadURL = resp;
              if(!animais.id){
                this.createWithImage(animais);
              }else{
                this.updateWithImage(animais, animais.id);
              }
            })
           })).subscribe();
    
      }
      createWithImage(animal: Animais){
        return this.firestore.collection(this.PATH)
        .add({
          nome: animal.nome, 
          especie: animal.especie, 
          downloadURL : animal.downloadURL,
          uid: animal.uid
        });
      }

      updateWithImage(animal: Animais, id: string){
        return this.firestore.collection(this.PATH).doc(id)
        .update({
          nome: animal.nome, 
          especie: animal.especie, 
          downloadURL : animal.downloadURL,
          uid: animal.uid
        });
      }


}