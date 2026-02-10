import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setEmail } from '../reducers/user';

export default function HomeScreen({ navigation }) {
  const [email, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleGoToGallery = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
      dispatch(setEmail(email));
      setError('');
      navigation.navigate('TabNavigator', { screen: 'Gallery' });
    } else {
      setError('Adresse email invalide');
    }
  };

  return (
    <LinearGradient
      colors={['#ffd89b', '#19547b']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <FontAwesome name="camera-retro" size={80} color="#fff" />
          </View>
          
          {/* Titre */}
          <Text style={styles.title}>SnapPic</Text>
          <Text style={styles.subtitle}>Capturez vos meilleurs moments</Text>
          
          {/* Input Email */}
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Votre email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmailInput(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          {/* Message d'erreur */}
          {error !== '' && (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-circle" size={16} color="#ff4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {/* Bouton */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGoToGallery}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Accéder à la galerie</Text>
            <FontAwesome name="arrow-right" size={18} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 50,
    opacity: 0.9,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#e8be4b',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 10,
  },
});