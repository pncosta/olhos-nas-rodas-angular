import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../core/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { PasswordValidation } from './password-validation';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {

  signupForm: FormGroup;
  error: String;
  acceptedTermsAndConditions: boolean;
  termsAndConditionsError: boolean;
  signupStatus: number;


  constructor(public fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<SignupDialogComponent>) { }

  ngOnInit() {
    this.signupStatus = 0;
    const usernameControl = PasswordValidation.getUsernameControl();
    const emailControl = PasswordValidation.getEmailControl();
    const passwordControl = PasswordValidation.getPasswordControl();
    const confirmPasswordControl = PasswordValidation.getPasswordControl();
    const termsAndConditionsControl = PasswordValidation.getTermsAndConditionsControl();

    this.signupForm = this.fb.group({
      'username': usernameControl,
      'email': emailControl,
      'password': passwordControl,
      'confirmPassword': confirmPasswordControl,
      'termsAndConditions': termsAndConditionsControl
    }, {
        validator: PasswordValidation.MatchPassword
      });
  }

  signup() {

    if (!this.termsAndConditions.value) {
      this.termsAndConditionsError = true;
    } else if (this.signupForm.valid) {
      this.auth.emailSignUp(this.email.value, this.password.value)
        .then(res => { return this.auth.updateUser({ displayName:  this.username.value })})
        .then (res => this.afterSignedUp(res))
        .catch(err => this.handleError(err));
    }
  }

  public afterSignedUp(e) {
    this.signupStatus = 1;
  }

  public afterOAuthSignedUp(e) {
    this.signupStatus = 2;
    setTimeout(function () {
         this.close();
  }.bind(this), 3000);
  }

  close() {
    this.dialogRef.close();
  }

  private handleError(err) {
    this.error = err.code;
  }

  // Using getters will make your code look pretty
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get username() { return this.signupForm.get('username'); }
  get termsAndConditions() { return this.signupForm.get('termsAndConditions'); }

}
