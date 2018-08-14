import { Component, OnInit, OnChanges, Inject, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { Employee } from '../../classes/employee';
import { EmployeeService } from '../../services/employee.service';
import { AlertDialogComponent } from '../alertdialog/alertdialog.component';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'avatar',
    'name',
    'username',
    'role',
    'phone',
    'actions'
  ];
  dataSource: MatTableDataSource<Employee>;
  baseUrl: string = this.apiEndpoint + '/';
  employees: Employee[] = [];
  employee: Employee;
  showAddEmployee: boolean;
  
  constructor(private employeeService: EmployeeService,
              private dialog: MatDialog,
              private toastr: ToastrService,
              @Inject('API_ENDPOINT') private apiEndpoint: string) {
    this.dataSource = new MatTableDataSource<Employee>(null);
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees(){
    const user = localStorage.getItem('user');
    this.employeeService.getEmployees(JSON.parse(user).network).subscribe(employees => {
      this.employees = employees;
      this.featchMatTable(employees);
    });
  }

  featchMatTable(employees: Employee[]): void {

    // Assign the data to the data source for the table to render
    let employeesToDisplay = employees.map(employee => {
      let cemployee = Object.assign({}, employee);
      return cemployee;
    });
    this.dataSource = new MatTableDataSource(employeesToDisplay);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onEdit(employee: Employee){
    this.employee =  Object.assign({}, employee);
    this.showAddEmployee = true;
  }

  onAdd() {
    this.employee = new Employee();
    this.employee.network = JSON.parse(localStorage.getItem('user')).network;

    this.showAddEmployee = true;
  }

  onDelete(employee: Employee): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {title: 'Confirm', message: 'Are you sure you want to delete?', btnOk: 'Ok', btnCancel: 'Cancel'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(employee).subscribe(res => {
          this.toastr.success('Successfully the employee is deleted!', 'Success!');
          const index = this.employees.map(item => item.uid).indexOf(employee.uid);
          if (index > -1) {
            this.employees.splice(index, 1);
            this.featchMatTable(this.employees);
          }
        });
      }
    });
  }
  onEventClosed(event) {
    if (event) {
      this.getEmployees();
    } else {
      this.showAddEmployee = false;
    }
  }
}
