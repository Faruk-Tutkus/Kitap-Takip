// screens/AddBookScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const AddBookScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [isbn, setIsbn] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Okunacak'); // Varsayılan durum
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser.uid;

  const handleSaveBook = async () => {
    if (!title || !author) {
      Alert.alert('Hata', 'Kitap adı ve yazar alanları zorunludur');
      return;
    }

    setLoading(true);
    try {
      // Yeni kitap ekle
      await addDoc(collection(db, 'books'), {
        title,
        author,
        publisher,
        pageCount: pageCount ? parseInt(pageCount) : null,
        publishDate,
        isbn,
        notes,
        status,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('Başarılı', 'Kitap başarıyla eklendi', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Kitap eklenirken hata:', error);
      Alert.alert('Hata', 'Kitap eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kitap Adı *</Text>
            <TextInput
              style={styles.input}
              placeholder="Kitap adı girin"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yazar *</Text>
            <TextInput
              style={styles.input}
              placeholder="Yazar adı girin"
              value={author}
              onChangeText={setAuthor}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yayınevi</Text>
            <TextInput
              style={styles.input}
              placeholder="Yayınevi girin"
              value={publisher}
              onChangeText={setPublisher}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sayfa Sayısı</Text>
            <TextInput
              style={styles.input}
              placeholder="Sayfa sayısı girin"
              value={pageCount}
              onChangeText={setPageCount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yayın Tarihi</Text>
            <TextInput
              style={styles.input}
              placeholder="Yayın tarihi girin (örn. 2022)"
              value={publishDate}
              onChangeText={setPublishDate}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ISBN</Text>
            <TextInput
              style={styles.input}
              placeholder="ISBN numarası girin"
              value={isbn}
              onChangeText={setIsbn}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notlar</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Kitap hakkında notlar..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.label}>Okuma Durumu</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity 
                style={[styles.statusButton, status === 'Okunacak' && styles.activeStatusButton]}
                onPress={() => setStatus('Okunacak')}
              >
                <Text style={[styles.statusButtonText, status === 'Okunacak' && styles.activeStatusButtonText]}>
                  Okunacak
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.statusButton, status === 'Okunuyor' && styles.activeStatusButton]}
                onPress={() => setStatus('Okunuyor')}
              >
                <Text style={[styles.statusButtonText, status === 'Okunuyor' && styles.activeStatusButtonText]}>
                  Okunuyor
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.statusButton, status === 'Okundu' && styles.activeStatusButton]}
                onPress={() => setStatus('Okundu')}
              >
                <Text style={[styles.statusButtonText, status === 'Okundu' && styles.activeStatusButtonText]}>
                  Okundu
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveBook}
            disabled={loading}
          >
            <Ionicons name="save-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.saveButtonText}>
              {loading ? 'Kaydediliyor...' : 'Kitabı Kaydet'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  statusSection: {
    marginBottom: 24,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeStatusButton: {
    backgroundColor: '#6200ee',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeStatusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddBookScreen;