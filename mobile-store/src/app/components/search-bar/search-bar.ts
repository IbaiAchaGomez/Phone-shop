import { Component, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  
    searchChange = output<string>();

    onInput(event: Event): void {
      const value = (event.target as HTMLInputElement).value;
      this.searchChange.emit(value);
    }
}
