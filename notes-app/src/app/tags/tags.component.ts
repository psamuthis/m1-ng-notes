import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tags',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})

export class TagsComponent {
  constructor(private storageService:StorageService) {}
}