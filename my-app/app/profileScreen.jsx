// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    read: 0,
    reading: 0,
    toRead: 0
  });
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
        
        // Kitap istatistiklerini getir
        const q = query(collection(db, 'books'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        let total = 0;
        let read = 0;
        let reading = 0;
        let toRead = 0;
        
        querySnapshot.forEach((doc) => {
          total++;
          const book = doc.data();
          if (book.status === 'Okundu') read++;
          else if (book.status === 'Okunuyor') reading++;
          else if (book.status === 'Okunacak') toRead++;
        });
        
        setStats({
          totalBooks: total,
          read,
          reading,
          toRead
        });
      } catch (error) {
        console.error('Kullanıcı bilgileri getirilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSignOut = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error('Çıkış yapılırken hata:', error);
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
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
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.userName}>{userData?.name}</Text>
        <Text style={styles.userEmail}>{userData?.email}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Kitap İstatistikleri</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalBooks}</Text>
            <Text style={styles.statLabel}>Toplam Kitap</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.read}</Text>
            <Text style={styles.statLabel}>Okundu</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.reading}</Text>
            <Text style={styles.statLabel}>Okunuyor</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.toRead}</Text>
            <Text style={styles.statLabel}>Okunacak</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Hesap</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#f44336" />
          <Text style={styles.actionButtonText}>Çıkış Yap</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});

export default ProfileScreen;