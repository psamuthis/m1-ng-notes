import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { StorageService } from '../storage.service';
import { Tag } from '../tag';
import { TagComponent } from "../tag/tag.component";
import { FormsModule } from '@angular/forms';

export const TAG_DEF_STR = 'tags';

@Component({
  selector: 'app-tags',
  imports: [RouterOutlet, RouterLink, TagComponent, FormsModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})

export class TagsComponent implements OnInit {
  @Input()id: string = TAG_DEF_STR;
  @Input()onDelete: (tag: Tag) => void = StorageService.removeTagFromStorage;
  loaded: boolean = false;
  tags: Tag[] = [];
  editing?: Tag;
  editedTagImage?: Tag;

  constructor() {}

  ngOnInit(): void {
    this.loadTags();
  }

  saveTags() {
    localStorage.setItem(this.id, JSON.stringify(this.tags));
  }

  loadTags() {
    if(!this.loaded) {
      this.tags = [];
      const storageTags: string | null = localStorage.getItem(this.id);

      if(!storageTags) {
      console.log("loading tags");
        return;
      }

      const parsedTags = JSON.parse(storageTags);
      if(Array.isArray(parsedTags)) {
        const tags: Tag[] = [];
        parsedTags.forEach((tag: Tag) => {
          tags.push(tag);
        });

        tags.forEach((tag: Tag) => {
          const actualTag: Tag | null = StorageService.getTagById(tag.id);
          actualTag? this.tags.push(StorageService.getTagById(tag.id)!) : null;
        })
      }
      this.loaded = true;
    }
  }

  dialogAddTag(): boolean {
    const input: string | null = window.prompt("Saisir le nom du tag");
    if(input === null || input === '' || this.tags.find(t => t.label === input)) {
      return false;
    }



    const newTag: Tag = {
      id: crypto.randomUUID(),
      label: input,
      color: '#00FF00',
    }

    this.tags.push(newTag);
    this.saveTags();
    StorageService.saveTagToStorage(newTag);
    return false;
  }

  deleteTag(tag: Tag): void {
    this.tags = this.tags.filter(t => t.id !== tag.id);
    if(this.id !== TAG_DEF_STR) {
      this.onDelete(tag)
    }
    StorageService.removeTagFromStorage(tag);
    this.saveTags();
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

      StorageService.saveTagToStorage(this.editing);
      this.editing = undefined;
    }
  }

  handleEditCancelEvent(): void {
    this.editing = undefined;
    this.loadTags();
  }

  updateEditedTag(tag: Tag): void {
    this.editing = tag;
  }
}