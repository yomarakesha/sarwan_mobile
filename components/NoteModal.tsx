import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { OrderNote } from '../data/mockData';
import Button from './Button';

interface NoteModalProps {
    visible: boolean;
    onClose: () => void;
    notes: OrderNote[];
    onSave: (text: string) => void;
}

export default function NoteModal({ visible, onClose, notes, onSave }: NoteModalProps) {
    const [newNote, setNewNote] = useState('');

    const handleSave = () => {
        if (newNote.trim()) {
            onSave(newNote.trim());
            setNewNote('');
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.centeredView}
                >
                    <View style={styles.modal}>
                        {/* Header */}
                        <Text style={styles.title}>Заметка к заказу</Text>

                        {/* Existing notes */}
                        {notes.map((note) => (
                            <View key={note.id} style={styles.noteItem}>
                                <View style={styles.noteHeader}>
                                    <View style={styles.noteAuthor}>
                                        <Ionicons name="person-outline" size={14} color={Colors.primary} />
                                        <Text style={styles.noteRole}>{note.role}</Text>
                                    </View>
                                    <Text style={styles.noteDate}>{note.date}</Text>
                                </View>
                                <Text style={styles.authorName}>{note.author}</Text>
                                <Text style={styles.noteText}>{note.text}</Text>
                            </View>
                        ))}

                        {/* New note input */}
                        <TextInput
                            style={styles.input}
                            placeholder="Добавить заметку"
                            placeholderTextColor={Colors.textPlaceholder}
                            value={newNote}
                            onChangeText={setNewNote}
                            multiline
                            numberOfLines={3}
                        />

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Отмена</Text>
                            </TouchableOpacity>
                            <Button
                                title="Сохранить"
                                onPress={handleSave}
                                variant="primary"
                                size="medium"
                                fullWidth={false}
                                style={{ paddingHorizontal: 32 }}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    modal: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 24,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    title: {
        ...Typography.h4,
        color: Colors.textPrimary,
        marginBottom: 20,
    },
    noteItem: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    noteAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noteRole: {
        ...Typography.label,
        color: Colors.primary,
        marginLeft: 6,
    },
    noteDate: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    authorName: {
        ...Typography.bodyS,
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    noteText: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        ...Typography.bodyS,
        color: Colors.textPrimary,
        textAlignVertical: 'top',
        minHeight: 80,
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
    },
    cancelButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cancelText: {
        ...Typography.button,
        color: Colors.textSecondary,
    },
});
