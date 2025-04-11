import { Tag } from './tag';

export class Note {
    id?: number;
    title: string = "";
    tags: Tag[] = [];
    content: string = "";

    constructor() {}
}