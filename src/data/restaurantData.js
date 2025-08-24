// Restaurant data for the app
// This file contains all the menu items and restaurant info

export const restaurantInfo = {
  name: "Little Lemon Chicago",
  description: "We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.",
  location: "Chicago"
};

export const menuCategories = [
  {
    id: 1,
    name: "Starters",
    color: "#F4CE14"
  },
  {
    id: 2, 
    name: "Mains",
    color: "#495E57"
  },
  {
    id: 3,
    name: "Desserts", 
    color: "#F4CE14"
  },
  {
    id: 4,
    name: "Drinks",
    color: "#495E57"
  }
];

export const menuItems = [
  {
    id: 1,
    name: "Greek Salad",
    category: "Starters",
    description: "The famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.",
    price: 12.99
  },
  {
    id: 2,
    name: "Bruschetta",
    category: "Starters", 
    description: "Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.",
    price: 7.99
  },
  {
    id: 3,
    name: "Grilled Fish",
    category: "Mains",
    description: "Barbequed catch of the day, with red onion, crisp capers, chive creme fraiche, and grilled lemon.",
    price: 20.00
  },
  {
    id: 4,
    name: "Pasta",
    category: "Mains",
    description: "Penne with fried aubergines, tomato sauce, fresh chilli, garlic, basil & salted ricotta.",
    price: 18.99
  },
  {
    id: 5,
    name: "Lemon Dessert",
    category: "Desserts",
    description: "Light and fluffy traditional homemade Italian Lemon and ricotta cake.",
    price: 6.99
  }
];

