import { Injectable } from '@angular/core';
import { Note } from './note';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  static loadTags(): Tag[] {
    const tags: string | null = localStorage.getItem('tags');

    if(tags === null) {
      return [];
    }

    try {
      const parsedTags = JSON.parse(tags);
      console.log("parsed tags", parsedTags);

      if(Array.isArray(parsedTags)) {
        return parsedTags.filter((tag): tag is Tag => 
          typeof tag.id === 'string' &&
          typeof tag.label === 'string' &&
          typeof tag.color === 'string'
        );
      }

      return [];
    } catch(error) {
        console.error("loadTags()", error);
        return [];
    }

  }

  static saveTags(tags: Tag[]) {
    localStorage.setItem('tags', JSON.stringify(tags));
  }

}