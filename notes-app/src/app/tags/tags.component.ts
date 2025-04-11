import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { StorageService } from '../storage.service';
import { Tag } from '../tag';
import { TagComponent } from "../tag/tag.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tags',
  imports: [RouterOutlet, RouterLink, TagComponent, FormsModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})

export class TagsComponent implements OnInit {
  loaded: boolean = false;
  tags: Tag[] = [];
  editing?: Tag;
  editedTagImage?: Tag;

  constructor() {}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags() {
    if(!this.loaded) {
      this.tags = StorageService.loadTags();
      this.loaded = true;
    }
  }

  dialogAddTag(): boolean {
    const input: string | null = window.prompt("Saisir le nom du tag");
    if(input === null || input === '') {
      return false;
    }

    const newTag: Tag = {
      id: crypto.randomUUID(),
      label: input,
      color: '#00FF00',
    }

    this.tags.push(newTag);
    StorageService.saveTags(this.tags);
    return false;
  }

  deleteTag(tag: Tag): void {
    this.tags = this.tags.filter(t => t.id !== tag.id);
    StorageService.saveTags(this.tags);
  }

  handleEditEvent(): void {
    this.editing = {
      id: "id",
      label: "label",
      color: "#8800CC",
    }
  }

  handleEditConfirmEvent(): void {
    if(this.editing === undefined) { return; }

    if(this.editing.id !== null) {
      const existingTagIndex: number = this.tags.findIndex(t => t.id === this.editing!.id);

      if(existingTagIndex !== -1) {
        this.tags[existingTagIndex].color = this.editing!.color;
        this.tags[existingTagIndex].label = this.editing!.label;
      } else {
        this.tags.push(this.editing);
      }

      this.editing = undefined;
      StorageService.saveTags(this.tags);
    }
  }

  handleEditCancelEvent(): void {
    this.editing = undefined;
    this.tags = StorageService.loadTags();
  }

  updateEditedTag(tag: Tag): void {
    this.editing = tag;
  }
}