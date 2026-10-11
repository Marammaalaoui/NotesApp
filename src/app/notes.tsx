// src/app/notes.tsx
import { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Note } from '../types';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Welcome', content: 'Tap + to add a note.' },
    { id: '2', title: 'Shopping', content: 'Milk, bread, coffee.' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const openNew = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setModalVisible(true);
  };

  const openEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  };

  const save = () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title.');
      return;
    }
    if (editingId) {
      // Never mutate state: create a new array
      setNotes(notes.map((n) => (n.id === editingId ? { ...n, title, content } : n)));
    } else {
      setNotes([{ id: Date.now().toString(), title, content }, ...notes]);
    }
    setModalVisible(false);
  };

  const remove = (id: string) => setNotes(notes.filter((n) => n.id !== id));

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(note) => note.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable style={styles.cardBody} onPress={() => openEdit(item)}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text numberOfLines={2}>{item.content}</Text>
            </Pressable>
            <Pressable onPress={() => remove(item.id)} hitSlop={8}>
              <Text>🗑️</Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable style={styles.fab} onPress={openNew}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>{editingId ? 'Edit note' : 'New note'}</Text>
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              multiline
            />
            <View style={styles.actions}>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.action}>Cancel</Text>
              </Pressable>
              <Pressable onPress={save}>
                <Text style={styles.action}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#60646c' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    backgroundColor: '#f0f0f3',
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  dialog: { backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 12 },
  dialogTitle: { fontSize: 20, fontWeight: 'bold' },
  input: { backgroundColor: '#f0f0f3', borderRadius: 8, padding: 12, fontSize: 16 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 24 },
  action: { color: '#208AEF', fontSize: 16 },
});