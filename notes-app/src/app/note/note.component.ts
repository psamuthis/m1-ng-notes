import { Component } from '@angular/core';
import { Note } from '../note';
import { TagsComponent } from '../tags/tags.component';
import { NOTES_STORAGE_KEY, StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { Tag } from '../tag';

@Component({
  selector: 'app-note',
  imports: [TagsComponent, FormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})
export class NoteComponent {
  notes: Note[] = [];
  editing?: Note;
  editedSection?: string = '';
  search: string | null = null;
  notesBuffer: Note[] = [];


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

  setEditing(note: Note) {
    this.editing = note;
  }

  handleNewNoteClick() {
    this.setEditing(new Note());
  }

  handleNewNoteEvent() {
    if(this.editing === undefined) { return; }

    this.notes.push(this.editing);
    this.saveNotes();
    this.editing = undefined;
  }

  handleNoteUpdate() {
    this.saveNotes();
    this.editing = undefined;
    this.editedSection = '';
  }

  handleNoteTitleEvent(note: Note) {
    this.setEditing(note);
    this.editedSection = 'title';
  }

  handleNoteContentEvent(note: Note) {
    this.setEditing(note);
    this.editedSection = 'content';
  }

  handleUpButtonClick(note: Note): void {
    const targetTagIndex: number = this.notes.findIndex((n: Note) => note.id === n.id);
    const otherTagIndex: number = ((targetTagIndex + this.notes.length - 1) % this.notes.length);

    const tmp: Note = this.notes[otherTagIndex];
    this.notes[otherTagIndex] = note;
    this.notes[targetTagIndex] = tmp;
    this.saveNotes();
  }

  handleDeleteClick(note: Note) {
    this.notes = this.notes.filter((n: Note) => note.id !== n.id);
    this.saveNotes();
    localStorage.removeItem(note.id);
  }

  handleDownButtonClick(note: Note): void {
    const targetTagIndex: number = this.notes.findIndex((n: Note) => note.id === n.id);
    const otherTagIndex: number = ((targetTagIndex + 1) % this.notes.length);

    const tmp: Note = this.notes[otherTagIndex];
    this.notes[otherTagIndex] = note;
    this.notes[targetTagIndex] = tmp;
    this.saveNotes();
  }

  handleSearch() {
    this.notes = [];
    this.loadNotes();

    if(this.search === null || this.search === '') {
      return;
    }

    this.notes = this.notes.filter((note: Note) => {
      return note.tags.some((tag: Tag) => {
        return tag.label.startsWith(this.search!);
      });
    });
  }
}