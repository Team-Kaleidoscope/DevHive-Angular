import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public version: string = "v0.1";
  public licenseUrl: string = "https://github.com/Team-Kaleidoscope/DevHive-Angular/blob/main/LICENSE";
  public organizationUrl: string = "https://github.com/Team-Kaleidoscope";

  constructor() { }

  ngOnInit(): void {
  }

}
