import { Component, OnInit } from '@angular/core';
import { Note } from '../note';
import { RouterOutlet } from '@angular/router';
import { TagsComponent } from '../tags/tags.component';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';

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
    this.saveNotes();
    this.editing = undefined;
  }

  loadNotes(): void {
    const storageNotes: string | null = localStorage.getItem(NOTE_STOR_KEY);
    if(!storageNotes) {
      return;
    }

    const parsedNotes = JSON.parse(storageNotes);
    parsedNotes.forEach((n: Note) => { this.notes.push(n); });
  }

  saveNotes(): void {
    localStorage.setItem(NOTE_STOR_KEY, JSON.stringify(this.notes));
  }
}