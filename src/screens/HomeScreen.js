import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dishes, getDishesByCategory, searchDishes } from '../data/dishes';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredDishes, setFilteredDishes] = useState(dishes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
    }
    
    const timer = setTimeout(() => {
      let result = dishes;

      if (selectedCategory) {
        result = getDishesByCategory(selectedCategory);
      }

      if (searchQuery) {
        result = searchDishes(searchQuery).filter(dish => 
          !selectedCategory || dish.category === selectedCategory
        );
      }

      setFilteredDishes(result);
      setIsLoading(false);
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  const renderDishCard = ({ item }) => (
    <TouchableOpacity
      style={styles.dishCard}
      onPress={() => navigation.navigate('DishDetails', { dish: item })}
    >
      <View style={styles.dishCardImageContainer}>
        <Image source={item.image} style={styles.dishCardImage} />
      </View>
      <View style={styles.dishCardContent}>
        <Text style={styles.dishCardTitle}>{item.name}</Text>
        <Text style={styles.dishCardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.dishCardFooter}>
          <Text style={styles.dishCardPrice}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <Text style={[
        styles.categoryButtonIcon,
        selectedCategory === item.id && styles.categoryButtonIconActive
      ]}>
        {item.icon}
      </Text>
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item.id && styles.categoryButtonTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Amore e Pasta</Text>
          <Text style={styles.heroSubtitle}>Authentic Italian flavors in every bite</Text>
          <Text style={styles.heroDescription}>
            Experience the warmth of Italy with our traditional recipes, fresh ingredients, 
            and passionate culinary craftsmanship.
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search pizza, pasta, drinks..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonIcon}>🔍</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Features */}
          <View style={styles.heroFeatures}>
            <View style={styles.heroFeature}>
              <Text style={styles.heroFeatureIcon}>🍕</Text>
              <Text style={styles.heroFeatureText}>Fresh Pizza</Text>
            </View>
            <View style={styles.heroFeature}>
              <Text style={styles.heroFeatureIcon}>🍝</Text>
              <Text style={styles.heroFeatureText}>Handmade Pasta</Text>
            </View>
            <View style={styles.heroFeature}>
              <Text style={styles.heroFeatureIcon}>🍷</Text>
              <Text style={styles.heroFeatureText}>Fine Wines</Text>
            </View>
            <View style={styles.heroFeature}>
              <Text style={styles.heroFeatureIcon}>🍨</Text>
              <Text style={styles.heroFeatureText}>Sweet Desserts</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category List */}
      <View style={styles.categorySection}>
        <FlatList
          data={[{ id: '', name: 'All Items', icon: '🍽️' }, ...categories]}
          renderItem={renderCategoryButton}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Filter Summary */}
      {searchQuery && (
        <View style={styles.filterSummary}>
          <View style={styles.filterSummaryContainer}>
            <Text style={styles.filterSummaryCount}>
              🔍 {filteredDishes.length} dishes found
            </Text>
            
            {searchQuery && (
              <View style={styles.filterSummaryTag}>
                <Text style={styles.filterSummaryTagText}>"{searchQuery}"</Text>
              </View>
            )}
            
            {selectedCategory && (
              <View style={styles.filterSummaryTag}>
                <Text style={styles.filterSummaryTagText}>{selectedCategory}</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.filterSummaryClear}
              onPress={handleClearFilters}
            >
              <Text style={styles.filterSummaryClearText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Dishes Section */}
      <View style={styles.dishesSection}>
        <Text style={styles.dishesSectionTitle}>
          {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Menu` : 'Our Complete Menu'}
        </Text>

        {isLoading && (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Loading delicious dishes...</Text>
          </View>
        )}

        {!isLoading && filteredDishes.length > 0 && (
          <FlatList
            data={filteredDishes}
            renderItem={renderDishCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.dishesRow}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}

        {!isLoading && filteredDishes.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsTitle}>No dishes found</Text>
            <Text style={styles.noResultsDescription}>
              We couldn't find any dishes matching your criteria. Try adjusting your search or browse our categories.
            </Text>
            <TouchableOpacity
              style={styles.noResultsButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.noResultsButtonText}>🔄 Show All Dishes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantInfoTitle}>About Amore e Pasta</Text>
        <Text style={styles.restaurantInfoDescription}>
          For over three generations, our family has been bringing the authentic tastes of Italy to your table. 
          Every dish is prepared with love, using traditional recipes passed down through our family and the 
          freshest ingredients imported directly from Italy.
        </Text>

        <View style={styles.restaurantInfoFeatures}>
          <View style={styles.restaurantInfoFeature}>
            <Text style={styles.restaurantInfoFeatureIcon}>🏆</Text>
            <Text style={styles.restaurantInfoFeatureTitle}>Award Winning</Text>
            <Text style={styles.restaurantInfoFeatureDescription}>
              Recognized for authentic Italian cuisine and exceptional service
            </Text>
          </View>

          <View style={styles.restaurantInfoFeature}>
            <Text style={styles.restaurantInfoFeatureIcon}>🌿</Text>
            <Text style={styles.restaurantInfoFeatureTitle}>Fresh Ingredients</Text>
            <Text style={styles.restaurantInfoFeatureDescription}>
              Sourced daily from local farms and imported Italian specialties
            </Text>
          </View>

          <View style={styles.restaurantInfoFeature}>
            <Text style={styles.restaurantInfoFeatureIcon}>❤️</Text>
            <Text style={styles.restaurantInfoFeatureTitle}>Family Tradition</Text>
            <Text style={styles.restaurantInfoFeatureDescription}>
              Three generations of culinary passion and Italian hospitality
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Categories data (you can move this to a separate file)
const categories = [
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'drinks', name: 'Drinks', icon: '🍷' },
  { id: 'dessert', name: 'Dessert', icon: '🍨' }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
  },
  hero: {
    backgroundColor: '#FF6B6B',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.9,
  },
  heroDescription: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    marginLeft: 10,
  },
  searchButtonIcon: {
    fontSize: 20,
    color: '#FF6B6B',
  },
  heroFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  heroFeature: {
    alignItems: 'center',
  },
  heroFeatureIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  heroFeatureText: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  categorySection: {
    paddingVertical: 20,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  categoryButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryButtonIconActive: {
    color: '#FFF',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#FFF',
  },
  filterSummary: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterSummaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterSummaryCount: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  filterSummaryTag: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  filterSummaryTagText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  filterSummaryClear: {
    marginLeft: 'auto',
  },
  filterSummaryClearText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
  dishesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  dishesSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  dishesRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dishCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    width: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  dishCardImageContainer: {
    height: 120,
    overflow: 'hidden',
  },
  dishCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dishCardContent: {
    padding: 15,
  },
  dishCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dishCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  dishCardFooter: {
    alignItems: 'flex-end',
  },
  dishCardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noResultsDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  noResultsButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  noResultsButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  restaurantInfo: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantInfoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  restaurantInfoDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  restaurantInfoFeatures: {
    gap: 20,
  },
  restaurantInfoFeature: {
    alignItems: 'center',
    textAlign: 'center',
  },
  restaurantInfoFeatureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  restaurantInfoFeatureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  restaurantInfoFeatureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;
