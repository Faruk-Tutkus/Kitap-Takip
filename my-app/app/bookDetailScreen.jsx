// screens/BookDetailScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const BookDetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const docRef = doc(db, 'books', bookId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBook({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          Alert.alert('Hata', 'Kitap bulunamadı');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Kitap detayları getirilirken hata:', error);
        Alert.alert('Hata', 'Kitap detayları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const updateBookStatus = async (newStatus) => {
    try {
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      setBook({
        ...book,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      Alert.alert('Başarılı', 'Kitap durumu güncellendi');
    } catch (error) {
      console.error('Kitap güncellenirken hata:', error);
      Alert.alert('Hata', 'Kitap durumu güncellenirken bir hata oluştu');
    }
  };

  const deleteBook = async () => {
    Alert.alert(
      'Kitabı Sil',
      'Bu kitabı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'books', bookId));
              Alert.alert('Başarılı', 'Kitap silindi');
              navigation.goBack();
            } catch (error) {
              console.error('Kitap silinirken hata:', error);
              Alert.alert('Hata', 'Kitap silinirken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.bookImageContainer}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} style={styles.bookImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="book" size={80} color="#6200ee" />
            </View>
          )}
        </View>
        
        <View style={styles.bookHeader}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: book.status === 'Okundu' ? '#E8F5E9' : 
                           book.status === 'Okunuyor' ? '#FFF3E0' : '#EFEBE9' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: book.status === 'Okundu' ? '#43A047' : 
                       book.status === 'Okunuyor' ? '#EF6C00' : '#795548' }
            ]}>
              {book.status}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Yayınevi:</Text>
          <Text style={styles.infoValue}>{book.publisher || 'Belirtilmemiş'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Sayfa Sayısı:</Text>
          <Text style={styles.infoValue}>{book.pageCount || 'Belirtilmemiş'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Yayın Tarihi:</Text>
          <Text style={styles.infoValue}>{book.publishDate || 'Belirtilmemiş'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ISBN:</Text>
          <Text style={styles.infoValue}>{book.isbn || 'Belirtilmemiş'}</Text>
        </View>
      </View>
      
      {book.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notlar</Text>
          <Text style={styles.notesText}>{book.notes}</Text>
        </View>
      )}
      
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Kitap Durumunu Değiştir</Text>
        
        <View style={styles.statusButtons}>
          <TouchableOpacity 
            style={[styles.statusButton, book.status === 'Okunacak' && styles.activeStatusButton]}
            onPress={() => updateBookStatus('Okunacak')}
          >
            <Text style={[styles.statusButtonText, book.status === 'Okunacak' && styles.activeStatusButtonText]}>
              Okunacak
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.statusButton, book.status === 'Okunuyor' && styles.activeStatusButton]}
            onPress={() => updateBookStatus('Okunuyor')}
          >
            <Text style={[styles.statusButtonText, book.status === 'Okunuyor' && styles.activeStatusButtonText]}>
              Okunuyor
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.statusButton, book.status === 'Okundu' && styles.activeStatusButton]}
            onPress={() => updateBookStatus('Okundu')}
          >
            <Text style={[styles.statusButtonText, book.status === 'Okundu' && styles.activeStatusButtonText]}>
              Okundu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity style={styles.deleteButton} onPress={deleteBook}>
        <Ionicons name="trash-outline" size={18} color="#fff" />
        <Text style={styles.deleteButtonText}>Kitabı Sil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookImageContainer: {
    width: 120,
    height: 180,
    marginRight: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookHeader: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    flex: 1,
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    flex: 2,
    fontSize: 15,
    color: '#333',
  },
  notesSection: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  notesText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  actionSection: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeStatusButton: {
    backgroundColor: '#6200ee',
  },
  activeStatusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 24,
    marginBottom: 30,
    backgroundColor: '#f44336',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
})
export default BookDetailScreen;