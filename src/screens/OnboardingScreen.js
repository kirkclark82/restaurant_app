import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { saveProfile, setOnboardingCompleted, getProfile, setCurrentUser } from '../utils/mobileStorage';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete, route }) => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profile, setProfile] = useState({
    name: '',
    email: route?.params?.email || '',
    phone: ''
  });
  const [isCompleting, setIsCompleting] = useState(false);

  // Check if user already has a profile when component mounts
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const existingProfile = await getProfile();
        if (existingProfile && existingProfile.name && existingProfile.email && existingProfile.phone) {
          // User already has a complete profile, skip to main app
          onComplete();
        }
      } catch (error) {
        console.error('Error checking existing profile:', error);
      }
    };
    
    checkExistingProfile();
  }, [onComplete]);

  const slides = [
    {
      icon: '🍕',
      title: 'Benvenuti alla Famiglia!',
      subtitle: 'Welcome to our Italian family!',
      description: 'Experience authentic Italian cuisine crafted with love, tradition, and the finest ingredients from the heart of Italy.',
      colorClass: 'pizza'
    },
    {
      icon: '🍝',
      title: 'Handcrafted Perfection',
      subtitle: 'Every dish tells a story',
      description: 'Our chefs bring generations of Italian culinary expertise to create unforgettable dining experiences.',
      colorClass: 'pasta'
    },
    {
      icon: '🍷',
      title: 'La Dolce Vita',
      subtitle: 'The sweet life awaits',
      description: 'Indulge in the Italian way of life with our carefully curated selection of wines, desserts, and specialty drinks.',
      colorClass: 'drinks'
    },
    {
      icon: '👤',
      title: 'Join Our Community',
      subtitle: 'Create your profile',
      description: 'Let us personalize your dining experience and keep you updated with our latest offerings.',
      colorClass: 'profile',
      isProfileSetup: true
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = async () => {
    if (isProfileComplete() && !isCompleting) {
      setIsCompleting(true);
      try {
        // Save profile first
        await saveProfile(profile);
        console.log('OnboardingScreen: Profile saved for:', profile.email);
        
        // Set current user to the email from profile
        await setCurrentUser(profile.email);
        console.log('OnboardingScreen: Current user set to:', profile.email);
        
        // Mark onboarding as completed
        await setOnboardingCompleted();
        console.log('OnboardingScreen: Onboarding marked as completed');
        
        // Use the onComplete callback instead of direct navigation
        if (onComplete) {
          onComplete();
        } else {
          // Fallback to direct navigation if callback not provided
          navigation.replace('MainTabs');
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
        Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
        setIsCompleting(false);
      }
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isProfileComplete = () => {
    return profile.name.trim() && profile.email.trim() && profile.phone.trim();
  };

  const isNextDisabled = () => {
    if (slides[currentSlide].isProfileSetup) {
      return !isProfileComplete();
    }
    return false;
  };

  const currentSlideData = slides[currentSlide];

  const getGradientColors = (colorClass) => {
    switch (colorClass) {
      case 'pizza':
        return ['#FF6B6B', '#FF8E53'];
      case 'pasta':
        return ['#4ECDC4', '#44A08D'];
      case 'drinks':
        return ['#A8E6CF', '#7FCDCD'];
      case 'profile':
        return ['#FFD93D', '#FF6B6B'];
      default:
        return ['#FF6B6B', '#FF8E53'];
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentSlide ? styles.progressDotActive : styles.progressDotInactive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Slide Content */}
      <View style={styles.slideContainer}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: getGradientColors(currentSlideData.colorClass)[0] }]}>
          <Text style={styles.iconText}>{currentSlideData.icon}</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: getGradientColors(currentSlideData.colorClass)[0] }]}>
          {currentSlideData.title}
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {currentSlideData.subtitle}
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          {currentSlideData.description}
        </Text>

        {/* Profile Form */}
        {currentSlideData.isProfileSetup && (
          <View style={styles.profileForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(value) => handleProfileChange('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(value) => handleProfileChange('email', value)}
                placeholder="Enter your email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={profile.phone}
                onChangeText={(value) => handleProfileChange('phone', value)}
                placeholder="Enter your phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          {currentSlide > 0 && (
            <TouchableOpacity
              style={styles.navButtonSecondary}
              onPress={handlePrevious}
            >
              <Text style={styles.navButtonSecondaryText}>Previous</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.navButtonPrimary,
              isNextDisabled() && styles.navButtonDisabled
            ]}
            onPress={handleNext}
            disabled={isNextDisabled() || isCompleting}
          >
            <Text style={styles.navButtonPrimaryText}>
              {currentSlide === slides.length - 1
                ? (isCompleting ? 'Completing...' : 'Sign In')
                : 'Next'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: '#FF6B6B',
  },
  progressDotInactive: {
    backgroundColor: '#DDD',
  },
  slideContainer: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  profileForm: {
    width: '100%',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#333',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  navButtonPrimary: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  navButtonPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonSecondary: {
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#DDD',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  navButtonSecondaryText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonDisabled: {
    backgroundColor: '#CCC',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default OnboardingScreen;
