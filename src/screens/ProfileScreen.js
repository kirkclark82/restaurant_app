import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfile, clearUserData, removeAllUserData } from '../utils/mobileStorage';

const ProfileScreen = ({ onLogout }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const onLogoutRef = useRef(onLogout);
  
  // Update ref when prop changes
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await getProfile();
        if (savedProfile) {
          setProfile(savedProfile);
        } else {
          // If no profile, trigger logout to go back to onboarding
          if (onLogoutRef.current) {
            onLogoutRef.current();
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // If error loading profile, trigger logout to go back to onboarding
        if (onLogoutRef.current) {
          onLogoutRef.current();
        }
      }
    };
    
    loadProfile();
  }, []); // Remove onLogout dependency to prevent infinite loops

  const handleLogout = async () => {
    try {
      console.log('ProfileScreen: Logout button pressed');
      console.log('ProfileScreen: About to call onLogout callback');
      // Don't clear user data - just logout and go back to landing
      // User data should be preserved for next login
      if (onLogoutRef.current) {
        console.log('ProfileScreen: Calling onLogout callback');
        onLogoutRef.current();
        console.log('ProfileScreen: onLogout callback completed');
      } else {
        console.log('ProfileScreen: onLogout callback not provided');
      }
      setShowLogoutModal(false);
      console.log('ProfileScreen: Logout modal closed');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleRemoveData = async () => {
    Alert.alert(
      'Remove All Data',
      'This will remove all your data and you\'ll need to go through onboarding again. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeAllUserData();
              // Instead of navigating, call the logout callback
              if (onLogoutRef.current) {
                onLogoutRef.current();
              }
            } catch (error) {
              console.error('Error removing data:', error);
              Alert.alert('Error', 'Failed to remove data. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <Text style={styles.profileName}>
              {profile.name || 'User Profile'}
            </Text>
            <Text style={styles.profileEmail}>
              Member since {new Date().getFullYear()}
            </Text>
          </View>

          {/* Profile Content */}
          <View style={styles.profileContent}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👤</Text>
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>

              {/* Name Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Full Name
                </Text>
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldText}>
                    {profile.name || 'Not provided'}
                  </Text>
                </View>
              </View>

              {/* Email Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Email Address
                </Text>
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldText}>
                    {profile.email || 'Not provided'}
                  </Text>
                </View>
              </View>

              {/* Phone Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Phone Number
                </Text>
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldText}>
                    {profile.phone || 'Not provided'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <View style={styles.infoMessage}>
                <Text style={styles.infoMessageText}>
                  💡 Your profile data is safely stored and will be preserved when you logout. You can log back in using your email address.
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setShowLogoutModal(true)}
              >
                <Text style={styles.logoutButtonIcon}>🚪</Text>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.removeDataButton}
                onPress={handleRemoveData}
              >
                <Text style={styles.removeDataButtonIcon}>🗑️</Text>
                <Text style={styles.removeDataButtonText}>Remove my data</Text>
              </TouchableOpacity>
              
              <View style={styles.warningMessage}>
                <Text style={styles.warningMessageText}>
                  ⚠️ This will permanently delete all your data and cannot be undone.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Text style={styles.modalIconText}>⚠️</Text>
            </View>
            
            <Text style={styles.modalTitle}>
              Confirm Logout
            </Text>
            
            <Text style={styles.modalDescription}>
              Are you sure you want to logout? Your profile data will be preserved, and you can log back in anytime using your email address.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonConfirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FF6B6B',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarIcon: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  profileContent: {
    padding: 25,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#FF6B6B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fieldValue: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  fieldText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    gap: 15,
  },
  infoMessage: {
    backgroundColor: '#E0F2F7',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  infoMessageText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButtonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  removeDataButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#DC3545',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  removeDataButtonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  removeDataButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC3545',
  },
  warningMessage: {
    backgroundColor: '#FFF3CD',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  warningMessageText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 350,
    width: '100%',
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3CD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconText: {
    fontSize: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButtonCancel: {
    backgroundColor: '#6C757D',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 100,
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  modalButtonConfirm: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 100,
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default ProfileScreen;
