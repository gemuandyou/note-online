export class Note {
  id: number;
  noteTitle: string;
  noteUrl: string;
  noteIntroducation?: string;
  noteContent?: string;
  author?: string;
  createDate: Date;
  modifyDate?: Date;
  isme?: boolean;
}
