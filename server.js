// Import packages, initialize an express app, and define the port you will use
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Data for the server
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// Define routes and implement middleware here

// GET /api/menu - Retrieve all menu items
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// GET /api/menu/:id - Retrieve a specific menu item
app.get('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = menuItems.find(mi => mi.id === id);
  if (!item) return res.status(404).json({ error: 'Menu item not found' });
  res.json(item);
});

// POST /api/menu - Add a new menu item
app.post('/api/menu', (req, res) => {
  const { name, description, price, category, ingredients, available } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: 'Invalid payload: `name` and numeric `price` required' });
  }
  const maxId = menuItems.reduce((max, it) => Math.max(max, it.id), 0);
  const newItem = {
    id: maxId + 1,
    name,
    description: description || '',
    price,
    category: category || 'entree',
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    available: available === undefined ? true : !!available
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

// PUT /api/menu/:id - Update an existing menu item
app.put('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = menuItems.findIndex(mi => mi.id === id);
  if (index === -1) return res.status(404).json({ error: 'Menu item not found' });
  const current = menuItems[index];
  const { name, description, price, category, ingredients, available } = req.body;
  const updated = {
    ...current,
    name: name !== undefined ? name : current.name,
    description: description !== undefined ? description : current.description,
    price: price !== undefined ? price : current.price,
    category: category !== undefined ? category : current.category,
    ingredients: ingredients !== undefined ? (Array.isArray(ingredients) ? ingredients : current.ingredients) : current.ingredients,
    available: available !== undefined ? !!available : current.available
  };
  menuItems[index] = updated;
  res.json(updated);
});

// DELETE /api/menu/:id - Remove a menu item
app.delete('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = menuItems.findIndex(mi => mi.id === id);
  if (index === -1) return res.status(404).json({ error: 'Menu item not found' });
  const [removed] = menuItems.splice(index, 1);
  res.json({ message: 'Menu item removed', item: removed });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
