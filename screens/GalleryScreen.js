import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { deletePhoto } from '../reducers/photos';

const { width } = Dimensions.get('window');
const imageSize = (width - 60) / 2;

export default function GalleryScreen() {
  const dispatch = useDispatch();
  const photos = useSelector((state) => state.photos.value);

  const photosData = [
    'https://res.cloudinary.com/babahedz/image/upload/v1686507914/4_dh1u9w.png',
    'https://res.cloudinary.com/babahedz/image/upload/v1686507914/1_f3guh8.png',
    'https://res.cloudinary.com/babahedz/image/upload/v1686507914/2_lrjyge.png',
    'https://res.cloudinary.com/babahedz/image/upload/v1686507913/3_hm866a.png',
  ];

  const allPhotos = [...photosData, ...photos];

  const handleDelete = (index) => {
    if (index >= photosData.length) {
      const photoIndex = index - photosData.length;
      dispatch(deletePhoto(photoIndex));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <FontAwesome name="image" size={28} color="#e8be4b" />
          <Text style={styles.headerTitle}>Ma Galerie</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{allPhotos.length}</Text>
        </View>
      </View>

      {/* Galerie */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.gallery}>
          {allPhotos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="camera" size={60} color="#ccc" />
              <Text style={styles.emptyTitle}>Aucune photo</Text>
              <Text style={styles.emptySubtitle}>Prenez votre première photo !</Text>
            </View>
          ) : (
            allPhotos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image 
                  source={{ uri: photo }} 
                  style={styles.photo}
                  resizeMode="cover"
                />
                {/* Badge "Défaut" pour les photos par défaut */}
                {index < photosData.length && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Par défaut</Text>
                  </View>
                )}
                {/* Bouton de suppression */}
                <TouchableOpacity 
                  style={[
                    styles.deleteButton,
                    index < photosData.length && styles.deleteButtonDisabled
                  ]}
                  onPress={() => handleDelete(index)}
                  disabled={index < photosData.length}
                >
                  <FontAwesome 
                    name="times" 
                    size={18} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingTop: 50,        // 👈 Ajouté
  paddingBottom: 15,     // 👈 Modifié
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  badge: {
    backgroundColor: '#e8be4b',
    borderRadius: 15,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: imageSize,
    height: imageSize,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  defaultBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    width: width - 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#bbb',
    marginTop: 10,
  },
});