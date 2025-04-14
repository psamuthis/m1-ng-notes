import { Component } from '@angular/core';
import { Note } from '../note';
import { RouterOutlet } from '@angular/router';
import { TagsComponent } from '../tags/tags.component';
import { NOTES_STORAGE_KEY, StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { Tag } from '../tag';

@Component({
  selector: 'app-note',
  imports: [RouterOutlet, TagsComponent, FormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})
export class NoteComponent {
  notes: Note[] = [];
  editing?: Note;

  constructor() {}

  ngOnInit(): void {
    this.loadNotes();
  }

  ngOnDestroy(): void {
    this.saveNotes();
  }

  saveNotes(): void {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.notes));
    this.notes.forEach((note: Note) => StorageService.saveNote(note));
  }

  loadNotes(): void {
    this.notes = [];
    const storedNotes: string | null = localStorage.getItem(NOTES_STORAGE_KEY);
    if(storedNotes === null) {
      console.log("No notes in storage");
      return;
    }

    const notes: Note[] = JSON.parse(storedNotes);
    notes.forEach((n: Note) => {
      const note: Note | null = StorageService.loadNote(n.title);
      if(note) {
        this.notes.push(note);
      }
    });
  }

   handleNewNoteClick() {
    this.editing = new Note();
  }

  handleNewNoteEvent() {
    if(this.editing === undefined) { return; }

    this.notes.push(this.editing);
    this.saveNotes();
    this.editing = undefined;
  }

}