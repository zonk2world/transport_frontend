import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '../../../../../node_modules/@angular/forms';
import { Employee } from '../../../classes/employee';
import { EmployeeService } from '../../../services/employee.service';
import { MatDialog, MatDialogRef } from '../../../../../node_modules/@angular/material';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { AvatarEditorComponent } from '../../modals/avatar-editor/avatar-editor.component';
import { environment } from '../../../../environments/environment';

const apiEndpoint =  environment.apiUrl;

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit, OnChanges {

  @Input() employee: Employee;
  @Input() employees: Employee[];
  @Output() eventClosed = new EventEmitter<boolean>();

  employeeForm: FormGroup;

  confirm_password: string = '';
  dialogRef: MatDialogRef<AvatarEditorComponent>;
  Roles = ['Driver', 'Walker', 'Enforcer'];
  phoneRegEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  user;
  baseUrl: string = apiEndpoint + '/';

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initForm();
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  onClose() {
    this.eventClosed.emit(false);
  }
  onSubmit() {
    if (this.FormValid()) {

      if (this.employee.uid) {

        this.employeeService.updateEmployee(this.employee).subscribe(result => {
          this.toastr.success('Successfully the employee is updated!', 'Success!');
          this.eventClosed.emit(true);
        });

      } else {

        this.employeeService.addEmployee(this.employee).subscribe(result => {
          this.toastr.success('Successfully new employee is created!', 'Success!');
          this.eventClosed.emit(true);
          this.resetForm();
        },
        error => {
            if (error.error.message) {
              this.toastr.error(error.error.message, 'Error!');
            }
          }
        );
      }
    }
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(AvatarEditorComponent, {
      width: '40%',
      data: {
        imageUrl: this.employee.picture
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.employee.picture = result? result : null;
    });
  }

  private resetForm() {
    this.employeeForm.reset({
      surname: '',
      name: '',
      username: '',
      role: 'Enforcer',
      password: '',
      confirm_password:'',
      phone: '',
      network: JSON.parse(localStorage.getItem('user')).network
    }); 

    this.employee = new Employee();
    this.employee.network = JSON.parse(localStorage.getItem('user')).network;
    this.employee.role = 'Enforcer';
    
    let control: AbstractControl = null;
    this.employeeForm.markAsUntouched();
    Object.keys(this.employeeForm.controls).forEach((name) => {
      control = this.employeeForm.controls[name];
      control.setErrors(null);
    });
  }

  private initForm() {
    this.employeeForm = new FormGroup({
      surname: new FormControl(),
      name: new FormControl(),
      username: new FormControl('', [Validators.required, this.checkEmailFormat]),
      role: new FormControl(),
      password: new FormControl(),
      confirm_password: new FormControl(),
      phone: new FormControl(),
      network: new FormControl(),
    });
  }

  private checkEmailFormat(fieldControl: AbstractControl): ValidationErrors | null {
    if (!fieldControl.value) return null;
		const re = /^[a-zA-Z0-9.!#$%&�*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/;
		return !new RegExp(re).test(fieldControl.value)
			? { email: true }
			: null;
  }

  private matchPassword(password, cpassword){
    return password===cpassword;
  }

  private isArray(arr){
    return Array.isArray(arr);
  }

  private FormValid(){

    Object.keys(this.employeeForm.controls).forEach((name) => {
      let control = this.employeeForm.controls[name];
      if (!control.value && name !== 'password' && name !== 'confirm_password') {
        control.setErrors({'required': true});
      }
    });
    
    if(!this.matchPassword(this.employee.password, this.confirm_password)){
      this.employeeForm.get('confirm_password').setErrors({'mismatch': true});
      this.employeeForm.get('password').setErrors({'mismatch': true});
    }
    if(this.isArray(this.employees) && !this.employee.uid){
      this.employees.forEach(employee => {
        if(employee.username === this.employee.username) this.employeeForm.get('username').setErrors({'not_unique': true});
      });
    }
    if(!this.employee.phone.match(this.phoneRegEx)) this.employeeForm.get('phone').setErrors({'mismatch': true});
    return this.employeeForm.valid;
  }

  ngOnChanges() {
    if (!this.employee.uid && this.employeeForm) {
      this.resetForm();
    }    
  }
}
