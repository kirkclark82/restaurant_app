import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addToFavorites, removeFromFavorites, isFavorite } from '../utils/mobileStorage';

const { width, height } = Dimensions.get('window');

const DishDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dish } = route.params;
  
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Check if dish is favorited on component mount
  React.useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorited = await isFavorite(dish.id);
        setIsFavorited(favorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [dish.id]);

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorited) {
        await removeFromFavorites(dish.id);
        setIsFavorited(false);
        Alert.alert('Removed from Favorites', `${dish.name} has been removed from your favorites.`);
      } else {
        await addToFavorites(dish.id);
        setIsFavorited(true);
        Alert.alert('Added to Favorites', `${dish.name} has been added to your favorites!`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${quantity}x ${dish.name} has been added to your cart!`,
      [
        {
          text: 'Continue Shopping',
          onPress: () => navigation.goBack()
        },
        {
          text: 'View Cart',
          onPress: () => {
            // Navigate to cart screen (you can implement this later)
            Alert.alert('Cart', 'Cart functionality coming soon!');
          }
        }
      ]
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      pizza: '🍕',
      pasta: '🍝',
      drinks: '🍷',
      dessert: '🍨'
    };
    return icons[category] || '🍽️';
  };

  const getCategoryColor = (category) => {
    const colors = {
      pizza: '#FF6B6B',
      pasta: '#4ECDC4',
      drinks: '#A8E6CF',
      dessert: '#FFD93D'
    };
    return colors[category] || '#FF6B6B';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={dish.image} style={styles.dishImage} />
        <View style={styles.imageOverlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
          >
            <Text style={styles.favoriteButtonIcon}>
              {isFavorited ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(dish.category) }]}>
          <Text style={styles.categoryBadgeIcon}>
            {getCategoryIcon(dish.category)}
          </Text>
          <Text style={styles.categoryBadgeText}>
            {dish.category.charAt(0).toUpperCase() + dish.category.slice(1)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Dish Header */}
        <View style={styles.dishHeader}>
          <Text style={styles.dishName}>{dish.name}</Text>
          <Text style={styles.dishPrice}>${dish.price}</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{dish.description}</Text>
        </View>

        {/* Ingredients */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.ingredientsTitle}>Key Ingredients</Text>
          <View style={styles.ingredientsList}>
            {dish.ingredients ? (
              dish.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientIcon}>•</Text>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noIngredientsText}>
                Fresh, authentic Italian ingredients
              </Text>
            )}
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text style={styles.quantityTitle}>Quantity</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>
                -
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityDisplay}>{quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
            >
              <Text style={[styles.quantityButtonText, quantity >= 10 && styles.quantityButtonTextDisabled]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Price */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>${(dish.price * quantity).toFixed(2)}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartButtonIcon}>🛒</Text>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.orderNowButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.orderNowButtonIcon}>⚡</Text>
            <Text style={styles.orderNowButtonText}>Order Now</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <Text style={styles.infoLabel}>Preparation Time</Text>
            <Text style={styles.infoValue}>15-20 minutes</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔥</Text>
            <Text style={styles.infoLabel}>Spice Level</Text>
            <Text style={styles.infoValue}>Mild</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🌱</Text>
            <Text style={styles.infoLabel}>Dietary</Text>
            <Text style={styles.infoValue}>Vegetarian</Text>
          </View>
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
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  dishImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonIcon: {
    fontSize: 20,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryBadgeIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    padding: 20,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dishName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 20,
  },
  dishPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  descriptionSection: {
    marginBottom: 25,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  ingredientsSection: {
    marginBottom: 25,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientIcon: {
    fontSize: 16,
    color: '#FF6B6B',
    marginRight: 10,
    fontWeight: 'bold',
  },
  ingredientText: {
    fontSize: 16,
    color: '#666',
  },
  noIngredientsText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  quantitySection: {
    marginBottom: 25,
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  quantityButtonTextDisabled: {
    color: '#CCC',
  },
  quantityDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 30,
    minWidth: 30,
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  actionButtons: {
    gap: 15,
    marginBottom: 30,
  },
  addToCartButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addToCartButtonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  addToCartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  orderNowButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  orderNowButtonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  orderNowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  additionalInfo: {
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    marginLeft: 'auto',
  },
});

export default DishDetailsScreen;
