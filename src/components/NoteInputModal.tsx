// src/components/NoteInputModal.tsx
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Note } from '../types';

export type NoteDraft = Pick<Note, 'title' | 'content'>;

type Props = {
  visible: boolean;
  initial?: NoteDraft; // undefined = creating a new note
  onSave: (draft: NoteDraft) => void;
  onCancel: () => void;
};

export function NoteInputModal({ visible, initial, onSave, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      {/* A different key re-creates the form, which resets its fields */}
      <Form key={initial ? initial.title + initial.content : 'new'} initial={initial} onSave={onSave} onCancel={onCancel} />
    </Modal>
  );
}

function Form({ initial, onSave, onCancel }: Omit<Props, 'visible'>) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const canSave = title.trim().length > 0;

  return (
    <View style={styles.backdrop}>
      <View style={styles.dialog}>
        <Text style={styles.heading}>{initial ? 'Edit note' : 'New note'}</Text>
        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <View style={styles.actions}>
          <Pressable onPress={onCancel}>
            <Text style={styles.action}>Cancel</Text>
          </Pressable>
          <Pressable
            disabled={!canSave}
            onPress={() => onSave({ title: title.trim(), content: content.trim() })}
            style={{ opacity: canSave ? 1 : 0.4 }}>
            <Text style={styles.action}>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  dialog: { backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 12 },
  heading: { fontSize: 20, fontWeight: 'bold' },
  input: { backgroundColor: '#f0f0f3', borderRadius: 8, padding: 12, fontSize: 16 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 24 },
  action: { color: '#208AEF', fontSize: 16 },
});