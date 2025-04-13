import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { StorageService } from '../storage.service';
import { Tag } from '../tag';
import { TagComponent } from "../tag/tag.component";
import { FormsModule } from '@angular/forms';

export const TAG_DEF_STR: string = 'tags';

@Component({
  selector: 'app-tags',
  imports: [RouterOutlet, RouterLink, TagComponent, FormsModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})

export class TagsComponent implements OnInit {
  @Input()id: string = TAG_DEF_STR;
  @Input()onDelete: (tag: Tag) => void = StorageService.deleteTagFromStorage;
  loaded: boolean = false;
  tags: Tag[] = [];
  editing?: Tag;
  editedTagImage?: Tag;

  constructor() {}

  ngOnInit(): void {
    this.tags = this.loadTags(this.id);
    console.log(this.id);
  }

  saveTags() {
    localStorage.setItem(this.id, JSON.stringify(this.tags));

    if(this.id !== TAG_DEF_STR) {
      const globalTags: Tag[] = this.loadTags(TAG_DEF_STR);

      this.tags.forEach((tag: Tag) => {
        const existingTagIndex: number = globalTags.findIndex(t => t.id === tag.id);

        if(existingTagIndex !== -1) {
          globalTags[existingTagIndex] = tag;
        } else {
          globalTags.push(tag);
        }
      });
      localStorage.setItem(TAG_DEF_STR, JSON.stringify(globalTags));
    }
  }

  loadTags(key: string): Tag[] {
    if(this.loaded) {
      return [];
    }

    if(this.id === TAG_DEF_STR) {
      const globalTags: string | null = localStorage.getItem(TAG_DEF_STR);
      if(!globalTags) {
        return [];
      }

      const parsedTags = JSON.parse(globalTags);
      const tags: Tag[] = [];
      if(parsedTags) {
        parsedTags.forEach((tag: Tag) => tags.push(tag));
      }
      return tags;
    }

    const storageTags: string | null = localStorage.getItem(key);

    if(!storageTags) {
      return [];
    }

    const parsedTags = JSON.parse(storageTags);
    if(Array.isArray(parsedTags)) {
      const tags: Tag[] = [];
      parsedTags.forEach((tag: Tag) => tags.push(tag));
      return tags;
    }

    this.loaded = true;

    return [];
  }

  dialogAddTag(): boolean {
    const input: string | null = window.prompt("Saisir le nom du tag");
    if(input === null || input === '' || this.tags.find(t => t.label === input)) {
      return false;
    }

    const newTag: Tag = {
      id: crypto.randomUUID(),
      label: input,
      color: '#BB3344',
    };

    this.tags.push(newTag);
    this.saveTags();
    return false;
  }

  deleteTag(tag: Tag): void {
    this.tags = this.tags.filter(t => t.id !== tag.id);
    this.saveTags();

    //mettre à jour toutes les notes si depuis menu tag
  }

  handleEditEvent(): void {
    this.editing = {
      id: "id",
      label: "label",
      color: "#8800CC",
    }

    //mettre à jour autres notes si depuis menu notes
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
    }
  }

  handleEditCancelEvent(): void {
    this.editing = undefined;
    this.loadTags(this.id);
  }

  updateEditedTag(tag: Tag): void {
    this.editing = tag;
  }
}