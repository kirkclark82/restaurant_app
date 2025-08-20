// Italian Restaurant Menu Data

export const dishes = [
  // Pizza
  {
    id: 1,
    name: "Margherita",
    category: "pizza",
    description: "Classic pizza with tomato sauce, mozzarella, fresh basil",
    price: 16.99,
    image: "/src/assets/images/PIZZA-MARGHERITA.jpg"
  },
  {
    id: 2,
    name: "Quattro Formaggi",
    category: "pizza",
    description: "Four-cheese blend with mozzarella, gorgonzola, fontina, and parmesan",
    price: 19.99,
    image: "/src/assets/images/quattro-formaggi.jpg"
  },
  {
    id: 3,
    name: "Pepperoni",
    category: "pizza",
    description: "Tomato sauce, mozzarella, spicy Italian pepperoni",
    price: 18.99,
    image: "/src/assets/images/Pepperoni.png"
  },
  
  // Pasta
  {
    id: 4,
    name: "Spaghetti Carbonara",
    category: "pasta",
    description: "Egg yolk sauce, pancetta, pecorino romano, black pepper",
    price: 22.99,
    image: "/src/assets/images/Spaghetti-Carbonara.jpg"
  },
  {
    id: 5,
    name: "Fettuccine Alfredo",
    category: "pasta",
    description: "Creamy parmesan sauce, fresh fettuccine pasta",
    price: 20.99,
    image: "/src/assets/images/Fettuccine Alfredo.jpg"
  },
  {
    id: 6,
    name: "Penne Arrabbiata",
    category: "pasta",
    description: "Spicy tomato sauce, garlic, and chili flakes",
    price: 18.99,
    image: "/src/assets/images/Penne Arrabbiata.jpg"
  },
  
  // Drinks
  {
    id: 7,
    name: "Limoncello",
    category: "drinks",
    description: "Sweet Italian lemon liqueur",
    price: 8.99,
    image: "/src/assets/images/Limoncello.jpg"
  },
  {
    id: 8,
    name: "Espresso",
    category: "drinks",
    description: "Strong, aromatic Italian coffee shot",
    price: 3.99,
    image: "/src/assets/images/Espresso.jpeg"
  },
  {
    id: 9,
    name: "Chianti",
    category: "drinks",
    description: "Full-bodied Tuscan red wine",
    price: 12.99,
    image: "/src/assets/images/Chianti.jpg"
  },
  
  // Dessert
  {
    id: 10,
    name: "Tiramisu",
    category: "dessert",
    description: "Espresso-soaked ladyfingers, mascarpone cream, cocoa powder",
    price: 9.99,
    image: "/src/assets/images/Tiramisu.jpg"
  },
  {
    id: 11,
    name: "Cannoli",
    category: "dessert",
    description: "Crispy pastry shell filled with sweet ricotta cream",
    price: 7.99,
    image: "/src/assets/images/Cannoli.jpeg"
  },
  {
    id: 12,
    name: "Panna Cotta",
    category: "dessert",
    description: "Creamy Italian dessert topped with fresh berries",
    price: 8.99,
    image: "/src/assets/images/Panna-Cotta.jpg"
  }
];

export const categories = [
  { id: 'pizza', name: 'Pizza', icon: 'fas fa-pizza-slice' },
  { id: 'pasta', name: 'Pasta', icon: 'fas fa-utensils' },
  { id: 'drinks', name: 'Drinks', icon: 'fas fa-wine-glass' },
  { id: 'dessert', name: 'Dessert', icon: 'fas fa-ice-cream' }
];

/**
 * Get dishes by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered dishes
 */
export const getDishesByCategory = (category) => {
  if (!category) return dishes;
  return dishes.filter(dish => dish.category === category);
};

/**
 * Get dish by ID
 * @param {number} id - Dish ID
 * @returns {Object|null} Dish object or null if not found
 */
export const getDishById = (id) => {
  return dishes.find(dish => dish.id === parseInt(id)) || null;
};

/**
 * Search dishes by name or description
 * @param {string} query - Search query
 * @returns {Array} Filtered dishes
 */
export const searchDishes = (query) => {
  if (!query) return dishes;
  const lowerQuery = query.toLowerCase();
  return dishes.filter(dish => 
    dish.name.toLowerCase().includes(lowerQuery) ||
    dish.description.toLowerCase().includes(lowerQuery) ||
    dish.category.toLowerCase().includes(lowerQuery)
  );
};
