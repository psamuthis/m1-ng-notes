import { Injectable } from '@angular/core';
import { Note } from './note';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  static tags: Tag[] = [];
  static notes: Note[] = [];
  constructor() { }

  static loadNoteFromStorage(noteId: string): Note | null {
    const storageNote: string | null = localStorage.getItem(noteId);

    if(storageNote === null) { return null; }
    try {
      const parsedNote = JSON.parse(storageNote);

      if(parsedNote) {
        return parsedNote as Note;
      }
    } catch(error) {
      console.error("StorageService:loadNoteFromStorage()", error);
    }

    return null;
  }

  static getNoteById(noteId: string): Note | null {
    const memoryNote: Note | undefined = this.notes.find((note: Note): boolean => note.id === noteId);
    if(memoryNote) {
      return memoryNote;
    }

    const storageNote: Note | null = this.loadNoteFromStorage(noteId);
    if(storageNote) {
      this.notes.push(storageNote);
      return storageNote;
    }

    return null;
  }

  static saveNote(note: Note): void {
    localStorage.setItem(note.id, JSON.stringify(note));
    console.log("overhere", note);
    note.tags.forEach(tag => {
      this.saveTagToStorage(tag);
    });
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

  static getTagById(tagId: string): Tag | null {
    const memoryTag: Tag | undefined = this.tags.find((tag: Tag): boolean => tag.id === tagId);

    if(memoryTag) {
      return memoryTag;
    } else {
      const storageTag: Tag | null = this.loadTagFromStorage(tagId);

      if(storageTag) {
        this.tags.push(storageTag);
        return storageTag;
      }
    }

    return null;
  }

  static saveTagToStorage(tag: Tag): void {
    localStorage.setItem(tag.id, JSON.stringify(tag));

    const existingTagIndex: number = this.tags.findIndex((t: Tag) => {t.id === tag.id});
    if(existingTagIndex !== -1) {
      this.tags[existingTagIndex] = tag;
    } else {
      this.tags.push(tag);
    }
  }

  static removeTagFromStorage(tag: Tag): void {
    localStorage.removeItem(tag.id);
    this.tags.filter((t: Tag) => { t.id === tag.id; })
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