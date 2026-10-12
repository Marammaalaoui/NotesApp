import { ID, Query, type Models } from 'react-native-appwrite';

import { config, tablesDB } from '../lib/appwrite';
import type { Note, NoteDraft } from '../types';

// Shape of a row in the "notes" table (system fields come from Models.Row)
type NoteRow = Models.Row & {
  title: string;
  content?: string;
  userId?: string;
};

const target = { databaseId: config.databaseId, tableId: config.tableId };

const toNote = (row: NoteRow): Note => ({
  id: row.$id,
  title: row.title,
  content: row.content ?? '',
});

export async function listNotes(): Promise<Note[]> {
  const result = await tablesDB.listRows<NoteRow>({
    ...target,
    queries: [Query.orderDesc('$createdAt')],
  });
  return result.rows.map(toNote);
}

export async function createNote(draft: NoteDraft): Promise<Note> {
  const row = await tablesDB.createRow<NoteRow>({
    ...target,
    rowId: ID.unique(),
    data: draft,
  });
  return toNote(row);
}

export async function updateNote(id: string, draft: NoteDraft): Promise<Note> {
  const row = await tablesDB.updateRow<NoteRow>({ ...target, rowId: id, data: draft });
  return toNote(row);
}

export async function deleteNote(id: string): Promise<void> {
  await tablesDB.deleteRow({ ...target, rowId: id });
}