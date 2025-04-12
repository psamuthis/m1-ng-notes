import { Component, OnInit } from '@angular/core';
import { Note } from '../note';
import { RouterOutlet } from '@angular/router';
import { TagsComponent } from '../tags/tags.component';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { Tag } from '../tag';

const NOTE_STOR_KEY: string = 'notes';

@Component({
  selector: 'app-note',
  imports: [RouterOutlet, TagsComponent, FormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})
export class NoteComponent implements OnInit {
  notes: Note[] = [];
  editing?: Note;

  constructor() {}

  ngOnInit(): void {
    this.loadNotes();
  }

  handleNewNoteClick() {
    this.editing = new Note();
  }

  handleNewNoteEvent() {
    if(this.editing === undefined) { return; }

    this.notes.push(this.editing);
    console.log("saved new note", this.editing);
    this.saveNotes();
    this.editing = undefined;
  }

  handleTagDelete(tag: Tag) {
    this.notes.forEach((note: Note) => {
      const hasDeletedTag: number = note.tags.findIndex((t: Tag) => {
        t.id === tag.id;
      });
      if(hasDeletedTag !== -1) {
        note.tags.filter((t: Tag) => t.id === tag.id);
      }
    });

    this.saveNotes();
  }

  loadNotes(): void {
    const storageNotes: string | null = localStorage.getItem(NOTE_STOR_KEY);
    if(!storageNotes) {
      return;
    }

    const parsedNotes = JSON.parse(storageNotes);
    parsedNotes.forEach((n: Note) => {
        const note: Note | null = StorageService.getNoteById(n.id);
        if(note) {
          this.notes.push(note);
        }
    });

    console.log(this.notes);
  }

  saveNotes(): void {
    localStorage.setItem(NOTE_STOR_KEY, JSON.stringify(this.notes));
    console.log("saved notes to storage", localStorage.getItem(NOTE_STOR_KEY));
    this.notes.forEach((note: Note): void => StorageService.saveNote(note));
  }
}