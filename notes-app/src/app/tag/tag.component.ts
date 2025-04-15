import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})

export class TagComponent {
  @Input() id: string = "id";
  @Input() label: string = "label";
  @Input() color: string = "#00FF00";
}