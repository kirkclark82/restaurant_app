// Sample dishes data for the mobile app
export const dishes = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic Neapolitan pizza with fresh mozzarella, tomato sauce, and basil',
    price: 18.99,
    category: 'pizza',
    image: require('../assets/images/PIZZA-MARGHERITA.jpg'),
    ingredients: ['Fresh mozzarella', 'San Marzano tomatoes', 'Fresh basil', 'Extra virgin olive oil']
  },
  {
    id: '2',
    name: 'Quattro Formaggi',
    description: 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and ricotta',
    price: 22.99,
    category: 'pizza',
    image: require('../assets/images/quattro-formaggi.jpg'),
    ingredients: ['Mozzarella', 'Gorgonzola', 'Parmesan', 'Ricotta', 'Fresh herbs']
  },
  {
    id: '3',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with mozzarella and tomato sauce',
    price: 20.99,
    category: 'pizza',
    image: require('../assets/images/Pepperoni.png'),
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato sauce', 'Spices']
  },
  {
    id: '4',
    name: 'Fettuccine Alfredo',
    description: 'Creamy fettuccine with parmesan cheese and butter sauce',
    price: 19.99,
    category: 'pasta',
    image: require('../assets/images/Fettuccine Alfredo.jpg'),
    ingredients: ['Fettuccine pasta', 'Parmesan cheese', 'Butter', 'Heavy cream', 'Black pepper']
  },
  {
    id: '5',
    name: 'Spaghetti Carbonara',
    description: 'Traditional Roman pasta with eggs, pecorino cheese, and guanciale',
    price: 21.99,
    category: 'pasta',
    image: require('../assets/images/Spaghetti-Carbonara.jpg'),
    ingredients: ['Spaghetti', 'Eggs', 'Pecorino Romano', 'Guanciale', 'Black pepper']
  },
  {
    id: '6',
    name: 'Penne Arrabbiata',
    description: 'Spicy penne with tomato sauce, garlic, and red chili peppers',
    price: 18.99,
    category: 'pasta',
    image: require('../assets/images/Penne Arrabbiata.jpg'),
    ingredients: ['Penne pasta', 'Tomato sauce', 'Garlic', 'Red chili peppers', 'Olive oil']
  },
  {
    id: '7',
    name: 'Chianti Wine',
    description: 'Premium Italian red wine from Tuscany',
    price: 12.99,
    category: 'drinks',
    image: require('../assets/images/Chianti.jpg'),
    ingredients: ['Sangiovese grapes', 'Aged in oak barrels']
  },
  {
    id: '8',
    name: 'Limoncello',
    description: 'Traditional Italian lemon liqueur from the Amalfi Coast',
    price: 8.99,
    category: 'drinks',
    image: require('../assets/images/Limoncello.jpg'),
    ingredients: ['Sorrento lemons', 'Grain alcohol', 'Sugar']
  },
  {
    id: '9',
    name: 'Espresso',
    description: 'Strong Italian coffee served in traditional cups',
    price: 3.99,
    category: 'drinks',
    image: require('../assets/images/Espresso.jpeg'),
    ingredients: ['Arabica coffee beans', 'Filtered water']
  },
  {
    id: '10',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 9.99,
    category: 'dessert',
    image: require('../assets/images/Tiramisu.jpg'),
    ingredients: ['Ladyfingers', 'Mascarpone cheese', 'Coffee', 'Eggs', 'Sugar', 'Cocoa powder']
  },
  {
    id: '11',
    name: 'Panna Cotta',
    description: 'Silky smooth vanilla cream dessert with berry sauce',
    price: 8.99,
    category: 'dessert',
    image: require('../assets/images/Panna-Cotta.jpg'),
    ingredients: ['Heavy cream', 'Vanilla bean', 'Gelatin', 'Sugar', 'Mixed berries']
  },
  {
    id: '12',
    name: 'Cannoli',
    description: 'Crispy pastry shells filled with sweet ricotta and chocolate chips',
    price: 7.99,
    category: 'dessert',
    image: require('../assets/images/Cannoli.jpeg'),
    ingredients: ['Ricotta cheese', 'Pastry shells', 'Chocolate chips', 'Powdered sugar', 'Cinnamon']
  }
];

export const categories = [
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'drinks', name: 'Drinks', icon: '🍷' },
  { id: 'dessert', name: 'Dessert', icon: '🍨' }
];

// Helper functions
export const getDishesByCategory = (category) => {
  if (!category) return dishes;
  return dishes.filter(dish => dish.category === category);
};

export const searchDishes = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return dishes.filter(dish => 
    dish.name.toLowerCase().includes(lowercaseQuery) ||
    dish.description.toLowerCase().includes(lowercaseQuery) ||
    dish.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getDishById = (id) => {
  return dishes.find(dish => dish.id === id);
};

