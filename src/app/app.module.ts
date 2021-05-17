import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { GlobleServiceService } from '../app/globle-service.service'
import { HttpClientModule } from '@angular/common/http';
import { NotificationPage } from '../app/notification/notification.page'
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@NgModule({
  declarations: [AppComponent, NotificationPage],
  entryComponents: [NotificationPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    IonicStorageModule.forRoot({
      name: 'Baywash',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GlobleServiceService,
    FileChooser,
    FilePath,
    Base64,
    File,
    FileTransfer,
    DocumentViewer,
    Ng2SearchPipeModule,
    PreviewAnyFile,
    Network,
    Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
