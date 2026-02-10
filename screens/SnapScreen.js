import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addPhoto } from '../reducers/photos';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Liste des filtres disponibles
const FILTERS = [
  { id: 'original', name: 'Original', icon: 'circle-o' },
  { id: 'bw', name: 'N&B', icon: 'adjust' },
  { id: 'sepia', name: 'Sépia', icon: 'sun-o' },
  { id: 'vintage', name: 'Vintage', icon: 'film' },
  { id: 'cool', name: 'Cool', icon: 'snowflake-o' },
  { id: 'warm', name: 'Warm', icon: 'fire' },
];

export default function SnapScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [filteredPhoto, setFilteredPhoto] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  // Si les permissions ne sont pas encore chargées
  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <FontAwesome name="camera" size={60} color="#e8be4b" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Si les permissions ne sont pas accordées
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <View style={styles.permissionIcon}>
            <FontAwesome name="camera" size={80} color="#e8be4b" />
          </View>
          <Text style={styles.permissionTitle}>Accès à la caméra</Text>
          <Text style={styles.permissionMessage}>
            Nous avons besoin de votre permission pour accéder à la caméra et prendre des photos
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <FontAwesome name="check-circle" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.permissionButtonText}>Autoriser l'accès</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Fonction pour prendre une photo
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
      setFilteredPhoto(photo.uri);
      setSelectedFilter('original');
    }
  };

  // Fonction pour inverser la caméra
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Fonction pour appliquer un filtre
  const applyFilter = async (filterType) => {
    setSelectedFilter(filterType);

    if (filterType === 'original') {
      setFilteredPhoto(photo);
      return;
    }

    try {
      let actions = [];

      switch (filterType) {
        case 'bw':
          // Noir & Blanc : réduire la saturation à 0
          actions = [
            { resize: { width: 1000 } }, // Optimisation
          ];
          break;
        case 'sepia':
          // Sépia : teinte chaude
          actions = [
            { resize: { width: 1000 } },
          ];
          break;
        case 'vintage':
          // Vintage : légère décoloration
          actions = [
            { resize: { width: 1000 } },
          ];
          break;
        case 'cool':
          // Cool : teinte bleue
          actions = [
            { resize: { width: 1000 } },
          ];
          break;
        case 'warm':
          // Warm : teinte chaude orange
          actions = [
            { resize: { width: 1000 } },
          ];
          break;
      }

      const result = await manipulateAsync(
        photo,
        actions,
        { compress: 0.9, format: SaveFormat.JPEG }
      );

      setFilteredPhoto(result.uri);
    } catch (error) {
      console.error('Erreur application filtre:', error);
    }
  };

  // Fonction pour sauvegarder
  const savePhoto = () => {
    dispatch(addPhoto(filteredPhoto || photo));
    setPhoto(null);
    setFilteredPhoto(null);
    setSelectedFilter('original');
  };

  // Si une photo vient d'être prise, on l'affiche
if (photo) {
  return (
    <SafeAreaView style={styles.previewContainer}>
      <Image source={{ uri: photo }} style={styles.preview} />
      
      {/* Header avec titre */}
      <View style={styles.previewHeader}>
        <Text style={styles.previewTitle}>Aperçu de la photo</Text>
      </View>

      {/* Boutons d'action */}
      <View style={styles.previewActions}>
        <TouchableOpacity 
          style={styles.retakeButton}
          onPress={() => {
            setPhoto(null);
            setFilteredPhoto(null);
            setSelectedFilter('original');
          }}
          activeOpacity={0.8}
        >
          <FontAwesome name="refresh" size={18} color="#fff" />
          <Text style={styles.buttonText}>Reprendre</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => {
            dispatch(addPhoto(photo));
            setPhoto(null);
          }}
          activeOpacity={0.8}
        >
          <FontAwesome name="check" size={18} color="#fff" />
          <Text style={styles.buttonText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

  // Affichage de la caméra
  return (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        {/* Header */}
        <SafeAreaView style={styles.cameraHeader}>
          <Text style={styles.cameraTitle}>Prendre une photo</Text>
        </SafeAreaView>

        {/* Bouton pour inverser la caméra */}
        <TouchableOpacity 
          style={styles.flipButton}
          onPress={toggleCameraFacing}
          activeOpacity={0.8}
        >
          <FontAwesome name="refresh" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Bouton de capture */}
        <View style={styles.captureContainer}>
          <TouchableOpacity 
            style={styles.captureButtonOuter}
            onPress={takePicture}
            activeOpacity={0.8}
          >
            <View style={styles.captureButtonInner}>
              <FontAwesome name="camera" size={32} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },

  // Permission
  permissionContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  permissionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  permissionMessage: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  permissionButton: {
    flexDirection: 'row',
    backgroundColor: '#e8be4b',
    paddingHorizontal: 35,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Camera
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  flipButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#e8be4b',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Preview
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  previewHeader: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Filtres
  filtersContainer: {
    position: 'absolute',
    bottom: 130,
    width: '100%',
    height: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  filtersScroll: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 70,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(232, 190, 75, 0.3)',
    borderWidth: 2,
    borderColor: '#e8be4b',
  },
  filterText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#e8be4b',
  },

  // Actions
previewActions: {
  position: 'absolute',
  bottom: 40,
  flexDirection: 'row',
  alignSelf: 'center',
  gap: 15,
  paddingHorizontal: 20,
},
retakeButton: {
  flexDirection: 'row',
  backgroundColor: '#666',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  gap: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
},
saveButton: {
  flexDirection: 'row',
  backgroundColor: '#e8be4b',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  gap: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
},
buttonText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: 'bold',
},
});