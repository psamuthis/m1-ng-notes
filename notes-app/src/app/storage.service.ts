import { Injectable, OnInit } from '@angular/core';
import { Note } from './note';
import { Tag } from './tag';

export const NOTES_STORAGE_KEY: string = 'notes';
export const TAGS_STORAGE_KEY: string = 'tags';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnInit {
  static tags: Tag[] = [];
  static notes: Note[] = [];
  constructor() {}

  ngOnInit() {
    const storedNotes: string | null = localStorage.getItem(NOTES_STORAGE_KEY);
    if(storedNotes) {
      const notes: Note[] = JSON.parse(storedNotes);
      notes.forEach((n: Note) => StorageService.notes.push(n));
    }

    const storedTags: string | null = localStorage.getItem(TAGS_STORAGE_KEY);
    if(storedTags) {
      const tags: Tag[] = JSON.parse(storedTags);
      tags.forEach((t: Tag) => StorageService.tags.push(t));
    }
  }

  ngOnDestroy() {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(StorageService.notes));
    StorageService.notes.forEach((n: Note) => StorageService.saveNote(n));

    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(StorageService.tags));
    StorageService.tags.forEach((t: Tag) => StorageService.saveTag(t));
  }

  static saveNote(note: Note): void {
    localStorage.setItem(note.title, JSON.stringify(note));
    console.log("StorageService | saved note to storage", note);

    const existingNoteIndex: number = this.notes.findIndex((n: Note) => n.id === note.id);
    if(existingNoteIndex !== -1) {
      console.log("StorageService | updated memory note");
      this.notes[existingNoteIndex] = note;
    } else {
      console.log("StorageService | added new note to memory");
      this.notes.push(note);
    }

    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.notes));
  }

  static loadNote(noteTitle: string): Note | null {
    const memoryNote: Note | undefined = this.notes.find((n: Note) => n.title === noteTitle);
    if(memoryNote !== undefined) {
      console.log("StorageService | Note loaded from memory: ", memoryNote);
      return memoryNote;
    }

    const storageNote: string | null = localStorage.getItem(noteTitle);
    if(storageNote !== null) {
      const note: Note = JSON.parse(storageNote);
      console.log("StorageService | Note loaded from storage: ", note);
      return note;
    }

    return null;
  }



  static saveTag(tag: Tag): void {
    localStorage.setItem(tag.id, JSON.stringify(tag));
    console.log("saving tag", tag);

    const existingTagIndex: number = this.tags.findIndex((t: Tag) => t.id === tag.id);
    if(existingTagIndex !== -1) {
      console.log("StorageService | updated memory tag", tag);
      this.tags[existingTagIndex] = tag;
    } else {
      console.log("StorageService | added new tag to memory", tag);
      this.tags.push(tag);
    }

    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(this.tags));
    console.log(this.tags);
  }

  static loadTag(tagId: string): Tag | null {
    const memoryTag: Tag | undefined = this.tags.find((t: Tag) => t.id === tagId);
    if(memoryTag !== undefined) {
      console.log("StorageService | loaded tag from memory", memoryTag);
      return memoryTag;
    }

    const storageTag: string | null = localStorage.getItem(tagId);
    if(storageTag !== null) {
      console.log("StorageService | loaded tag from storage", JSON.parse(storageTag));
      return JSON.parse(storageTag);
    }

    console.log("StorageService | tag doesn't exist in storage tagId=", tagId);
    console.log(this.tags);
    return null;
  }

  static deleteTag(tagId: string): void {
    localStorage.removeItem(tagId);
    this.tags = this.tags.filter((t: Tag) => t.id !== tagId);
    this.notes.forEach((n: Note) => n.tags = n.tags.filter((t: Tag) => t.id !== tagId));
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(this.tags));
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.notes));
  }

  static updateTag(tag: Tag): void {
    this.tags[this.tags.findIndex(t => t.id === tag.id)] = tag || this.tags.push(tag);
    this.notes.forEach(n => n.tags[n.tags.findIndex(t => t.id === tag.id)] = tag);
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(this.tags));
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.notes));
  }
}