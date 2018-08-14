import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FileInputModule } from 'ng2-file-input';

import { AppComponent } from './app.component';

import { MapviewComponent } from './components/mapview/mapview.component';

import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { LoginComponent } from './components/login/login.component';
import { GeneralviewComponent } from './components/generalview/generalview.component';
import { ChartsComponent } from './components/charts/charts.component';
import { AgentsComponent } from './components/agents/agents.component';
import { TeamComponent } from './components/team/team.component';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { LineComponent } from './components/line/line.component';
import { StopComponent } from './components/stop/stop.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { TransportticketComponent } from './components/transportticket/transportticket.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { VerbalizationComponent } from './components/verbalization/verbalization.component';
import { AvatarEditorComponent } from './components/modals/avatar-editor/avatar-editor.component';
import { ItinerariesComponent } from './components/itineraries/itineraries.component';
import { LineModalComponent } from './components/line-modal/line-modal.component';
import {FileUploadComponent} from "./components/file-upload/file-upload.component";

import { AccessRightsService } from './services/accessRights.service';
import { AuthService } from './services/auth.service';
import { CoreService } from './services/core.service';
import { EmployeeService } from './services/employee.service';
import { UploadService } from './services/upload.service';
import { TeamService } from './services/team.service';
import { FileUploadService} from "./services/file-upload.service";
import {StopService} from "./services/stop.service";

import { RoutingModule } from './routing/routing.module';

import { AuthGuard } from './guards/auth.guard';
import { AccessGuard } from './guards/access.guard';

import { MaterialModule } from './material.module';
import { DragulaModule } from 'ng2-dragula';
import { SocketService } from './services/socket.service';
import { AddTeamDialogComponent } from './components/team/add-team-dialog/add-team-dialog.component';
import {RangeSliderComponent} from './components/range-slider/range-slider.component';
import { LineService } from './services/line.service';
import { ItinerariesService } from './services/itineraries.service';
import { environment } from '../environments/environment';
import { FilterdialogComponent } from './components/generalview/filterdialog/filterdialog.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { NetworkparamsService } from './services/networkparams.service';
import { ToastrModule } from 'ngx-toastr';
import { AmazingTimePickerModule } from 'amazing-time-picker';

import { BlacklistService } from './services/blacklist.service';

import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {LeafletDrawModule} from "@asymmetrik/ngx-leaflet-draw";

import { AlertDialogComponent } from './components/alertdialog/alertdialog.component';
import { ItinerariesMapComponent } from './components/itineraries/itineraries-map/itineraries-map.component';
import { AddShiftDialogComponent } from './components/shifts/add-shift-dialog/add-shift-dialog.component';
import { PopupComponent } from './components/popup/popup.component';
import { ItinerariesDetailsComponent } from './components/itineraries/itineraries-details/itineraries-details.component';
import { ItineraryTimelineComponent } from './components/itineraries/itineraries-details/itinerary-timeline/itinerary-timeline.component';
import { EmployeeModule } from './components/employee/employee.module';

const apiEndpoint =  environment.apiUrl;
//const apiEndpoint = 'http://127.0.0.1:8001/api';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    AgentsComponent,
    TeamComponent,
    ShiftsComponent,
    LineComponent,
    StopComponent,
    VehiclesComponent,
    ScheduleComponent,
    TransportticketComponent,
    AuthenticationComponent,
    VerbalizationComponent,
    ChartsComponent,
    FilterdialogComponent,
    GeneralviewComponent,
    MapviewComponent,
    AvatarEditorComponent,
    AddTeamDialogComponent,
    RangeSliderComponent,
    ItinerariesComponent,
    FileUploadComponent,
    LineModalComponent,
    AlertDialogComponent,
    ItinerariesMapComponent,
    AddShiftDialogComponent,
    PopupComponent,
    ItinerariesDetailsComponent,
    ItineraryTimelineComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    RoutingModule,
    FlashMessagesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    Ng2FileInputModule,
    DragulaModule,
    ImageCropperModule,
    ToastrModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    AmazingTimePickerModule,
    EmployeeModule,
  ],
  providers: [
    { provide: 'API_ENDPOINT', useValue: apiEndpoint },
    AuthService,
    AccessRightsService,
    FlashMessagesService,
    AuthGuard,
    UploadService,
    AccessGuard,
    CoreService,
    EmployeeService,
    SocketService,
    TeamService,
    LineService,
    ItinerariesService,
    NetworkparamsService,

    BlacklistService,
    DatePipe,
    FileUploadService,
    StopService
  ],

  entryComponents: [
    AvatarEditorComponent,
    AddTeamDialogComponent,
    LineModalComponent,
    AlertDialogComponent,
    AddShiftDialogComponent,
    PopupComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
