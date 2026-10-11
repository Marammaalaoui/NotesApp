// src/app/notes.tsx
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { NoteInputModal, type NoteDraft } from '../components/NoteInputModal';
import { NoteItem } from '../components/NoteItem';
import type { Note } from '../types';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Welcome', content: 'Tap + to add a note.' },
    { id: '2', title: 'Shopping', content: 'Milk, bread, coffee.' },
  ]);
  // null = dialog closed, 'new' = creating, a Note = editing it
  const [editing, setEditing] = useState<Note | 'new' | null>(null);

  const save = (draft: NoteDraft) => {
    if (editing === 'new') {
      setNotes([{ id: Date.now().toString(), ...draft }, ...notes]);
    } else if (editing) {
      setNotes(notes.map((n) => (n.id === editing.id ? { ...n, ...draft } : n)));
    }
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(note) => note.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet.</Text>}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onEdit={setEditing}
            onDelete={(id) => setNotes(notes.filter((n) => n.id !== id))}
          />
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={() => setEditing('new')}
        accessibilityRole="button"
        accessibilityLabel="Add note">
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <NoteInputModal
        visible={editing !== null}
        initial={editing && editing !== 'new' ? editing : undefined}
        onSave={save}
        onCancel={() => setEditing(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#60646c' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});