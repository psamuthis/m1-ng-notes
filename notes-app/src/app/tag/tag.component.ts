import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent {
  id = input<string>("id");
  label = input<string>("label");
  color = input<string>("#00FF00");
}