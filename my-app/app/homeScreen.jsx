// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const q = query(collection(db, 'books'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const booksData = [];
        querySnapshot.forEach((doc) => {
          booksData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setBooks(booksData);
      } catch (error) {
        console.error('Kitapları getirirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    
    // Navigation listener ekleyerek sayfaya her dönüldüğünde güncelleme yap
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation, userId]);

  const renderBookItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
    >
      <View style={styles.bookImageContainer}>
        {item.coverUrl ? (
          <Image source={{ uri: item.coverUrl }} style={styles.bookImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="book" size={40} color="#6200ee" />
          </View>
        )}
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
        <View style={styles.bookStatus}>
          <Text style={[
            styles.statusText, 
            { color: item.status === 'Okundu' ? '#4CAF50' : 
                     item.status === 'Okunuyor' ? '#FF9800' : '#9E9E9E' }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContent}>
          <Text>Yükleniyor...</Text>
        </View>
      ) : books.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="book-outline" size={80} color="#cacaca" />
          <Text style={styles.emptyText}>Henüz kitap eklenmemiş</Text>
          <Text style={styles.emptySubText}>Koleksiyonunuza yeni kitaplar ekleyin</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderBookItem}
          contentContainerStyle={styles.bookList}
        />
      )}
      
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBook')}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  emptySubText: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
  bookList: {
    padding: 16,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  bookImageContainer: {
    width: 100,
    height: 150,
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
  bookInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  bookStatus: {
    marginTop: 'auto',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  actionContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#03A9F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 4,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default HomeScreen;