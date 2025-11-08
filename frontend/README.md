# 🛍️ Product Frontend

A simple **React + TypeScript** app for displaying products, filtering by category, and adding items to a cart.



##  Tech Stack
- React + Vite  
- TypeScript  
- CSS (custom responsive styles)  
- Fetch API


##  Setup


npm install
npm run dev

App runs at http://localhost:5173


  
##  Structure

src/
├── App.tsx                        # Main component
├── components/
│   └── ProductCard.tsx            # Product display card
├── styles.css                     # Global styles
└── main.tsx                       # App entry


##  Features

.Fetch and display products from backend

.Category filter

.Add to cart (local state)

.Responsive grid layout

.Clean blue gradient background


### Layout & Responsiveness

The layout uses a responsive CSS grid that automatically adjusts the number of product cards per row based on screen width.  
A mobile-first approach ensures smooth scaling, with single-column layouts on small devices and flexible spacing using CSS variables.


##  Build
npm run build


##  Author

Samuel Soita
📧 samuelsoita79@gmail.com


