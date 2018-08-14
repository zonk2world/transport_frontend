import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { BrowserAnimationsModule } from '../../../../node_modules/@angular/platform-browser/animations';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    EmployeeComponent,
    AddEmployeeComponent
  ],
  providers: [
  ]
})
export class EmployeeModule { }
