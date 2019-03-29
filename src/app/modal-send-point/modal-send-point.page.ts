import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavParams, Platform, ToastController, ActionSheetController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions, DestinationType, PictureSourceType } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Base64 } from '@ionic-native/base64/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { pathToFileURL } from 'url';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { WsPontosService } from '../ws-pontos.service';
import { Type } from '../type';
import { Ponto } from '../ponto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ViewController } from '@ionic/core';
import { AuthGuardService } from '../auth-guard.service';
import { User } from '../user';
import { Observable } from 'rxjs';
import {Md5} from 'ts-md5/dist/md5';

const STORAGE_KEY = 'cico_images';

@Component({
  selector: 'app-modal-send-point',
  templateUrl: './modal-send-point.page.html',
  styleUrls: ['./modal-send-point.page.scss'],
})

export class ModalSendPointPage implements OnInit {
  
  images = [];
  //public files: Array<String>;
  files: String[] = [];
  tipos: Type[] = []; 
  public tipo = {} as Type;
  ponto = {} as Ponto;
  //public ponto: Ponto;
  form: FormGroup;

  constructor(
    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage,
    private platform: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath,
    private wspontos: WsPontosService,
    private navCtrl: NavController,
    public navParams: NavParams,
    public global: AuthGuardService,
    private modal: ModalController
    //fb: FormBuilder,
  ) {
    // this.urlBase = "http://192.168.0.112:3000/"
    // this.form = fb.group({
    //   tipo: {} as Type
    // });
    
  }

  ngOnInit() {
    // this.addPicture();
    this.platform.ready().then(() => {
      let position = this.navParams.get("position"); //pega a posicao passada na chamada da Modal
      console.log("position: "+JSON.stringify(position));
      this.ponto.lat = position.lat;
      this.ponto.lng = position.lng;
      // this.ponto.files = [''];
      //this.ponto.typeId = '5c87da727eaf7075b3cebb5f';
      this.wspontos.getTypes().subscribe(types => {
        console.log("tipos:");
        types.forEach(type => {
          this.tipos.push(type);
          console.log(JSON.stringify(type));
        })
      });
      this.loadStoredImages();
    });
  }

  onFormTipoChange($event){
    this.ponto.typeId = $event.target.value;
    //this.presentToast($event.target.value);
  }

  loadStoredImages(){
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory+img;
          let resPath = this.pathForImage(filePath);
          this.images.push({name: img, path: resPath, filePath: filePath});
        }
      }
    });
  }

  pathForImage(img){
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  async selectImage(){
    const actionSheet = await this.actionSheetController.create({
      // header: "Selecione a origem das imagens:",
      buttons: [{
        text: 'Galeria',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },{
        text: 'Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },{
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  private takePicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
      //destinationType: this.camera.DestinationType.FILE_URI,
      //encodingType: this.camera.EncodingType.JPEG,
      //mediaType: this.camera.MediaType.PICTURE,      
      //allowEdit: true,
      //targetHeight: 100,
      //targetWidth: 100
    }).then((imagePath) => {
    //   var currentName = imagePath.substr(imagePath.lastIndexOf('/')+1);
    //   var correctPath = imagePath.substr(0,imagePath.lastIndexOf('/')+1);
    //   this.copyFileToLocalDir(correctPath,currentName,this.createFileName());
    //  }, (err) => {
    //   // Handle error
    //  });
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
                let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }});
  }

  copyFileToLocalDir(namePath,currentName,newFileName){
    this.file.copyFile(namePath,currentName,this.file.dataDirectory,newFileName).then(_=> {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name){
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
          let newImages = [name];
          this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
          arr.push(name);
          this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
          name: name,
          path: resPath,
          filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      // this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  deleteImage(imgEntry,position){
    this.images.splice(position,1);
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name=>name != imgEntry.name);
      this.storage.set(STORAGE_KEY,JSON.stringify(filtered));
      var correctPath = imgEntry.filePath.substr(0,imgEntry.filePath.lastIndexOf('/')+1);
      this.file.removeFile(correctPath,imgEntry.name).then(res => {
        this.presentToast('Imagem removida');
      });
    });
  }

  startUpload(imgEntries) {
    // if (!this.ponto.typeId) {
    //   this.presentToast('');
    // } else {}
    //return new Promise(async resolve => {
      // const loading = await this.loadingController.create({
      //   message: 'Uploading image...',
      // });
      // await loading.present();

        // for (let x = 0; x <= imgEntries.length ;x++) {
        //     this.file.resolveLocalFilesystemUrl(imgEntries[x].filePath)
        //     .then(entry => {
        //         entry['file'](file => {
        //           //this.ponto.files.push(this.readFile(file));
        //           //this.readFile(file,this.ponto.files[x])
        //           this.files.push("teste6")
        //           this.files.push(Md5.hashStr(file.name)+file.name);
        //           this.readFile(file)
        //         })
        //     })
        //     .catch(err => {
        //         this.presentToast('Error while reading file.');
        //     });
        // }
  
        imgEntries.forEach(imgEntry => {
          this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
          .then(entry => {
              entry['file'](file => {
                //this.ponto.files.push(this.readFile(file));
                this.readFile(file);
              });
          })
          .catch(err => {
              this.presentToast('Error while reading file.');
          });
        });

            // loading.dismiss();            
        this.encerrarModel(imgEntries);
        //resolve(true);})    
  }

  readFile(file: any) {
    let res = ''
    const reader = new FileReader();
    reader.onloadend = async () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result],{
        type: file.type
      });
      formData.set('file',imgBlob,file.name);
      // formData.set('file',imgBlob,remoteFileName);
      res = this.uploadData(formData);        
    };
    reader.readAsArrayBuffer(file);
    return res; //remover isto
  }

  uploadData(formData){
      let result = ''
      this.http.post<String>(this.wspontos.urlBase+'/files/upload/',formData
      )
      .subscribe(res => {
          if (res['status'] === 'success') {
              // result = res['description'];
              // this.presentToast(result);
              // this.ponto.files.push("img/"+result);
              // this.pushFileName("img/"+result);
              // this.files.push(result);
              this.presentToast('Arquivo enviado com sucesso.');
          } else {
              this.presentToast('Não foi possível enviar o arquivo.');
          }
      },err => {
        //this.presentToast(err.error)
        this.presentToast(err.status);
      });
      return result;
    //let headers = new HttpHeaders({'Access-Control-Allow-Origin':'*'});
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  createFileName(){
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return String(Md5.hashStr(newFileName));
  }

  pushFileName(filename: string) {
    //this.ponto.files = [filename, ... this.ponto.files];
    //this.ponto.files.push({url: 'img/'+filename});
    this.files.push(filename);
  }

  encerrarModel(imgEntries) {

    imgEntries.forEach(imgEntry => {
      // imgEntry.filename,imgEntry.filePath,
      this.files = [this.remoteFileName(imgEntry.name),... this.files];
    });

    let user = this.global.getUser();      
      this.ponto.userId = user._id;
      this.ponto.files = this.files;
      //this.ponto.typeId = this.tipo._id;
      this.wspontos.sendPonto(this.ponto).subscribe(data => {
        console.log(JSON.stringify(data));
      }, err => {
        console.log(JSON.stringify(err));
      });

    this.modal.dismiss(
      this.ponto.typeId
    );
  }

  remoteFileName(filename) {    
    let x = Md5.hashStr(filename)+filename;
    return x;
  }

}