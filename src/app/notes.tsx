import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { NoteInputModal } from '../components/NoteInputModal';
import { NoteItem } from '../components/NoteItem';
import { errorMessage } from '../lib/errors';
import { createNote, deleteNote, listNotes, updateNote } from '../services/notes';
import type { Note, NoteDraft } from '../types';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // null = dialog closed, 'new' = creating, a Note = editing it
  const [editing, setEditing] = useState<Note | 'new' | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setNotes(await listNotes());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (draft: NoteDraft) => {
    try {
      if (editing === 'new') {
        const created = await createNote(draft);
        setNotes((current) => [created, ...current]);
      } else if (editing) {
        const updated = await updateNote(editing.id, draft);
        setNotes((current) => current.map((n) => (n.id === updated.id ? updated : n)));
      }
      setEditing(null);
    } catch (e) {
      Alert.alert('Could not save the note', errorMessage(e));
    }
  };

  const remove = (note: Note) => {
    Alert.alert('Delete note', `Delete "${note.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(note.id);
            setNotes((current) => current.filter((n) => n.id !== note.id));
          } catch (e) {
            Alert.alert('Could not delete the note', errorMessage(e));
          }
        },
      },
    ]);
  };

  if (loading && notes.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable onPress={load}>
          <Text style={styles.retry}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(note) => note.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet.</Text>}
        renderItem={({ item }) => (
          <NoteItem note={item} onEdit={setEditing} onDelete={() => remove(item)} />
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#60646c' },
  error: { color: '#c0392b', textAlign: 'center' },
  retry: { color: '#208AEF', fontSize: 16 },
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