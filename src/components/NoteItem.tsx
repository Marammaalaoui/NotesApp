// src/components/NoteItem.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Note } from '../types';

type Props = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export function NoteItem({ note, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Pressable style={styles.body} onPress={() => onEdit(note)} accessibilityRole="button">
        <Text style={styles.title}>{note.title}</Text>
        <Text numberOfLines={2}>{note.content}</Text>
      </Pressable>
      <Pressable
        onPress={() => onDelete(note.id)}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${note.title}`}
        hitSlop={8}>
        <Text>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    backgroundColor: '#f0f0f3',
  },
  body: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontWeight: 'bold' },
});