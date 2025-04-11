import { Routes } from '@angular/router';
import { TagsComponent } from './tags/tags.component';
import { NoteComponent } from './note/note.component';

export const routes: Routes = [
    {path:'', component: NoteComponent},
    {path:'notes', component: NoteComponent},
    {path:'tags', component: TagsComponent},
];