import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-bar',
  templateUrl: './error-bar.component.html',
  styleUrls: ['./error-bar.component.css']
})
export class ErrorBarComponent implements OnInit {
  public errorMsg = '';

  constructor()
  { }

  ngOnInit(): void {
    this.hideError();
  }

  showError(error: HttpErrorResponse): void {
    this.errorMsg = '';

    const errors: string[][] = Object.values(Object.values(error.error)[0] as any);

    for (const errorArr of errors) {
      for (const errorMsg of errorArr) {
        this.errorMsg += errorMsg + '\n';
      }
    }
  }

  hideError(): void {
    this.errorMsg = '';
  }
}
