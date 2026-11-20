import { Component, OnInit, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [...MATERIAL_IMPORTS],
})
export class NavbarComponent implements OnInit {
  navOpen = signal(false);

  constructor() {}

  ngOnInit() {}

  closeNavigation(): void {
    this.navOpen.set(false);
  }
}
