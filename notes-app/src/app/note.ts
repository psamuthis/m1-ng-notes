import { Tag } from './tag';

export class Note {
    id: string = crypto.randomUUID();
    title: string = "";
    tags: Tag[] = [];
    content: string = "";

    constructor() {}
}