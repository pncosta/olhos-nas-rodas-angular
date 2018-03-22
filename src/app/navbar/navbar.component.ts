import { Component, OnInit } from '@angular/core';
import { MatButtonModule, MatMenuModule } from '@angular/material';
import { AuthService } from '../core/auth.service';
import { Router } from "@angular/router";
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginDialog } from './login-dialog.component';
import { SignupDialog } from './signup-dialog.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() { }

  openLoginDialog() {
    const dialog = this.openDialog(LoginDialog);
    /* dialog.afterClosed().subscribe(result => { }); */
  }

  openSignupDialog() {
    const dialog = this.openDialog(SignupDialog);
  }

  openDialog(d) {
    return this.dialog.open(d, {
      height: '350px'
    });
  }
}
