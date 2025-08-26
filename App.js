import React, { useEffect, useState, useRef } from 'react';
import { View, Text, AppState, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DishDetailsScreen from './src/screens/DishDetailsScreen';
import LandingScreen from './src/screens/LandingScreen';

// Import storage utilities
import { initDatabase, isOnboardingCompleted, clearOnboardingStatus } from './src/utils/mobileStorage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for main app
const MainTabNavigator = ({ onLogout }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? '🏠' : '🏠';
          } else if (route.name === 'Profile') {
            iconName = focused ? '👤' : '👤';
          }
          
          return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10,
          height: 60 + Math.max(insets.bottom, 10),
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        options={{ title: 'Menu' }}
      >
        {() => <HomeScreen />}
      </Tab.Screen>
      <Tab.Screen 
        name="Profile" 
        options={{ title: 'Profile' }}
      >
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Main App Component
const MainApp = () => {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Prevent multiple initializations
      if (isInitialized.current) return;
      isInitialized.current = true;
      
      try {
        // Initialize the mobile database
        await initDatabase();
        setIsDatabaseReady(true);
        
        // Check onboarding status
        const completed = await isOnboardingCompleted();
        setHasCompletedOnboarding(completed);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsDatabaseReady(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      // Reset initialization flag when component unmounts
      isInitialized.current = false;
    };
  }, []);

  // Add AppState listener to re-check onboarding status when app comes to focus
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active') {
        // App has come to the foreground, re-check onboarding status
        try {
          console.log('App.js: App became active, re-checking onboarding status');
          const completed = await isOnboardingCompleted();
          if (completed !== hasCompletedOnboarding) {
            console.log('App.js: Onboarding status changed, updating state');
            setHasCompletedOnboarding(completed);
          }
        } catch (error) {
          console.error('Error re-checking onboarding status:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [hasCompletedOnboarding]);

  const handleLogout = async () => {
    // Logout: go back to landing page but KEEP user data
    // User can log back in with existing profile
    try {
      console.log('=== LOGOUT DEBUG ===');
      console.log('App.js: Logout triggered - clearing onboarding status');
      
      // Check current onboarding status before clearing
      const beforeStatus = await isOnboardingCompleted();
      console.log('App.js: Onboarding status before logout:', beforeStatus);
      
      // Clear onboarding status in AsyncStorage
      await clearOnboardingStatus();
      console.log('App.js: clearOnboardingStatus() completed');
      
      // Clear current user tracking
      const { clearCurrentUser } = await import('./src/utils/mobileStorage');
      await clearCurrentUser();
      console.log('App.js: Current user cleared');
      
      // Check if it was actually cleared
      const afterStatus = await isOnboardingCompleted();
      console.log('App.js: Onboarding status after logout:', afterStatus);
      
      // Reset onboarding status in React state
      setHasCompletedOnboarding(false);
      console.log('App.js: React state set to false');
      console.log('=== END LOGOUT DEBUG ===');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if clearing fails, still try to logout
      setHasCompletedOnboarding(false);
    }
  };

  const handleCompleteOnboarding = () => {
    // Mark onboarding as completed to enter main app
    setHasCompletedOnboarding(true);
  };

  const refreshOnboardingStatus = async () => {
    try {
      console.log('App.js: Manually refreshing onboarding status');
      const completed = await isOnboardingCompleted();
      if (completed !== hasCompletedOnboarding) {
        console.log('App.js: Onboarding status changed, updating state');
        setHasCompletedOnboarding(completed);
      }
    } catch (error) {
      console.error('Error refreshing onboarding status:', error);
    }
  };

  if (isLoading || !isDatabaseReady) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FDF6E3' }}>
          <StatusBar style="dark" />
          <LoadingScreen />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#FDF6E3' }
            }}
          >
            {!hasCompletedOnboarding ? (
              // Landing and onboarding flow
              <>
                <Stack.Screen name="Landing">
                  {() => <LandingScreen onRefreshStatus={refreshOnboardingStatus} />}
                </Stack.Screen>
                <Stack.Screen name="Onboarding">
                  {() => <OnboardingScreen onComplete={handleCompleteOnboarding} />}
                </Stack.Screen>
                <Stack.Screen name="DishDetails" component={DishDetailsScreen} />
              </>
            ) : (
              // Main app flow with bottom tabs
              <>
                <Stack.Screen name="MainTabs">
                  {() => <MainTabNavigator onLogout={handleLogout} />}
                </Stack.Screen>
                <Stack.Screen name="DishDetails" component={DishDetailsScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default MainApp;

// Loading screen component
const LoadingScreen = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  
  const runDebug = async () => {
    try {
      const { debugStorage, restoreSampleData } = await import('./src/utils/mobileStorage');
      
      // First check current storage
      const currentData = await debugStorage();
      setDebugInfo(currentData);
      
      // Then restore sample data
      await restoreSampleData();
      
      // Check storage again
      const newData = await debugStorage();
      setDebugInfo(newData);
      
      console.log('Debug completed - check console for details');
    } catch (error) {
      console.error('Debug failed:', error);
      setDebugInfo({ error: error.message });
    }
  };
  
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FDF6E3'
    }}>
      <Text style={{ fontSize: 24, color: '#666', marginBottom: 20 }}>
        Initializing...
      </Text>
      <Text style={{ fontSize: 16, color: '#999', marginBottom: 30 }}>
        Setting up your database...
      </Text>
      
      {/* Debug Button */}
      <TouchableOpacity 
        onPress={runDebug}
        style={{
          backgroundColor: '#FF6B6B',
          padding: 15,
          borderRadius: 8,
          marginBottom: 20
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          🔍 Debug Storage
        </Text>
      </TouchableOpacity>
      
      {debugInfo && (
        <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 8, maxWidth: 300 }}>
          <Text style={{ fontSize: 14, color: '#333', marginBottom: 10 }}>
            Debug Results:
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
};
