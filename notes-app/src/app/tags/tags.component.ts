import { Component, Input } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Tag } from '../tag';
import { TagComponent } from "../tag/tag.component";
import { FormsModule } from '@angular/forms';
import { Note } from '../note';
import { StorageService, TAGS_STORAGE_KEY } from '../storage.service';

@Component({
  selector: 'app-tags',
  imports: [RouterOutlet, RouterLink, TagComponent, FormsModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})

export class TagsComponent {
  @Input()storageKey: string = TAGS_STORAGE_KEY;
  @Input()refresh: () => void = this.loadTags;
  loaded: boolean = false;
  tags: Tag[] = [];
  editing?: Tag;
  editedTagImage?: Tag;

  constructor() {}

  ngOnInit(): void {
    this.loadTags();
  }

  saveTags(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tags));
    this.tags.forEach((tag: Tag) => StorageService.saveTag(tag));
  }

  loadTags(): void {
    this.tags = [];
    const storedTags: string | null = localStorage.getItem(this.storageKey);
    if(storedTags === null) {
      return;
    }

    const tags: Tag[] = JSON.parse(storedTags);
    tags.forEach((t: Tag) => {
      const tag: Tag | null = StorageService.loadTag(t.id);
      if(tag) {
        this.tags.push(tag);
      }
    });
  }

  deleteTag(tag: Tag): void {
    if(this.storageKey === TAGS_STORAGE_KEY) {
      StorageService.deleteTag(tag.id);
    }
    //rafraichir les autres instances de TagsComponent
    this.refresh();

    this.tags = this.tags.filter((t: Tag) => t.id !== tag.id);
    console.log("deleted tag", tag);
    console.log("tags after deletion", this.tags);
    localStorage.setItem(this.storageKey, JSON.stringify(this.tags));
    this.tags.forEach((t: Tag) => StorageService.saveTag(t));
  }

  handleTagAdd(): boolean {
    const input: string | null = window.prompt("Saisir le nom du tag");
    if(input === null || input === '' || this.tags.find(t => t.label === input)) {
      console.log("Saisi de nouveau tag invalide || tag déjà présent.");
      return false;
    }

    console.log(StorageService.tags);
    console.log(input);
    let newTag: Tag | undefined = StorageService.tags.find(t => t.label === input);

    if(newTag !== undefined) {
      this.tags.push(newTag);
    } else {
      newTag = {
        id: crypto.randomUUID(),
        label: input,
        color: '#BBFFCC',
      }
      this.tags.push(newTag);
    }

    this.saveTags();
    console.log("new tag added", this.tags);
    return true;
  }

  editTag(tag: Tag): void {
    const editedTagIndex: number = this.tags.findIndex(t => t.id === tag.id);
    const similarTag: Tag | undefined = StorageService.tags.find(t => t.label === tag.label && t.id !== tag.id);

    if(this.tags.find(t => t.label === this.tags[editedTagIndex].label && t.id !== this.tags[editedTagIndex].id)) {
      this.loadTags();
      console.log("tag is already present. canceling");
      return;
    }

    console.log("submitted tag", this.editing);
    console.log("edited tag", this.tags[editedTagIndex]);
    console.log("similar tag: ", similarTag);
    console.log("tags before", this.tags);

    if(similarTag !== undefined) {
      similarTag.color = tag.color;
      this.tags.splice(editedTagIndex);
      this.tags.push(similarTag);
    } else {
      this.tags[editedTagIndex] = tag;
    }

    console.log("tags after", this.tags);
    this.saveTags();
    StorageService.updateTag(tag);
    //envoyer signal de rafraichissement à quiconque comporte le tag modifié
    this.refresh();
  }

  handleEditConfirmEvent(): void {
    if(this.editing === undefined) { return; }
    this.editTag(this.editing);
    this.editing = undefined;
  }

  handleEditCancelEvent(): void {
    this.editing = undefined;
    this.loadTags();
  }

  updateEditedTag(tag: Tag): void {
    this.editing = tag;
  }
}