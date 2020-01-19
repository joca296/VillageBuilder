import { Component, OnInit, Input } from '@angular/core';
import { Alert } from '../../models/alert.model';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.sass']
})
export class AlertComponent implements OnInit {
  @Input() alert:Alert;

  constructor() { }

  ngOnInit() {
  }
}
