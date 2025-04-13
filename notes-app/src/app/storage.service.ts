import { Injectable } from '@angular/core';
import { Note } from './note';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  static loadNoteFromStorage(note: Note): Note | null {
    const storageNote: string | null = localStorage.getItem(note.title);

    if(storageNote === null) { return null; }

    const parsedNote = JSON.parse(storageNote);
    if(parsedNote) {
      return parsedNote as Note;
    }

    return null;
  }

  static saveNoteToStorage(note: Note): void {
    localStorage.setItem(note.title, JSON.stringify(note));
  }



  static loadTagFromStorage(key: string): Tag | null {
    const storageTag: string | null = localStorage.getItem(key);
    if(storageTag === null) {
      return null;
    }

    const parsedTag = JSON.parse(storageTag);
    if(parsedTag &&
       typeof parsedTag.id === 'string' &&
       typeof parsedTag.label === 'string' &&
       typeof parsedTag.color === 'string'
    ) {
      return parsedTag as Tag;
    }

    return null;
  }

  static saveTagToStorage(tag: Tag): void {
    localStorage.setItem(tag.id, JSON.stringify(tag));
  }

  static deleteTagFromStorage(tag: Tag): void {
    localStorage.removeItem(tag.id);
  }

  //static loadTagsById(tagIds: string[]): Tag[] {
    //const tags: Tag[] = [];
    //tagIds.forEach(tagId => {
      //const tag: Tag | null = this.getTagById(tagId);
      //if(tag) {
        //tags.push(tag);
      //}
    //})
    //return tags;
  //}

  //static loadTagsArray(key: string): Tag[] {
    //const tags: string | null = localStorage.getItem(key);

    //if(tags === null) {
      //return [];
    //}

    //try {
      //const parsedTags = JSON.parse(tags);

      //if(Array.isArray(parsedTags)) {
        //return parsedTags.filter((tag): tag is Tag => 
          //typeof tag.id === 'string' &&
          //typeof tag.label === 'string' &&
          //typeof tag.color === 'string'
        //);
      //}

      //return [];
    //} catch(error) {
        //console.error("loadTags()", error);
        //return [];
    //}

  //}

  //static saveTag(tag: Tag): void {
    //localStorage.setItem(tag.id, JSON.stringify(tag));
  //}
  //static saveTags(tags: Tag[]): void {
    //tags.forEach((tag: Tag) => this.saveTag(tag));
  //}

  ////static saveTags(key: string, tags: Tag[]) {
    ////localStorage.setItem(key, JSON.stringify(tags));
  ////}

  ////static saveTag(tag: Tag): void {
    ////const tags: Tag[] = this.loadTags(DEF_STRG_KEY);
    ////const exists: number = tags.findIndex(t => t.label === tag.label);

    ////if(exists === -1) {
      ////tags.push(tag);
    ////} else {
      ////tags[exists] = tag;
    ////}

    ////this.saveTags(DEF_STRG_KEY, tags);
  ////}

  //static handleTagEditFromNote(note: Note): void {
    ////update le 'tags' storage et toutes les autres notes ayant le tag correspondant
  //}

  //static handleTagEditFromManagement(tag: Tag): void {
    ////update toutes les notes
  //}
}