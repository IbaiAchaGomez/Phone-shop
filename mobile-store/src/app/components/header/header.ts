import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private location = inject(Location)
   breadcrumb = input<string>('');
   cartItems = 0;
   
   goBack(): void {
    this.location.back();
  }
}
