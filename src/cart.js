import { database, ref, get } from "./Data.js";

const itemsRef = ref(database, "items");

let ShoppingCart = document.getElementById("shopping-cart");
let label = document.getElementById("label");

let basket = JSON.parse(localStorage.getItem("data")) || [];
let itemsData = JSON.parse(localStorage.getItem('itemsData')) || [];

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};



/**
 * ! Generates the Cart Page with product cards composed of
 * ! images, title, price, buttons, & Total price
 * ? When basket is blank -> show's Cart is Empty
 */

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = itemsData.map((x) => {
      const { id, name, desc, longdesc, img, price, gal1, gal2, gal3 } = x;
      const itemQuantity = basket.find(item => item.id === id)?.item || 0; // Find the corresponding item in the basket
      if (itemQuantity < 1) return ''; // Don't generate HTML for items with quantity below 1
      return `
      <div class="cart-item">
        <img width="100" src=${img} alt="" />

        <div class="details">
        
          <div class="title-price-x">
            <h4 class="title-price">
              <p>${name}</p>
              <p class="cart-item-price">₲ ${price}</p>
            </h4>
            <i onclick="removeItem('${id}')" class="bi bi-x-lg"></i>
          </div>

          <div class="cart-buttons">
            <div class="buttons">
              <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${itemQuantity}</div>
              <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
            </div>
          </div>

          <h3>₲ ${itemQuantity * price}</h3>
        
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = "";
    label.innerHTML = `
    <h3>¡Ups! Canasta vacía</h3>
    <img src="images/empty-cart.png" alt="" />
    <br>
    <a href="index.html">
      <button class="HomeBtn">Volver a inicio</button>
    </a>
    `;
  }
};

generateCartItems();

/**
 * ! used to increase the selected product item quantity by 1
 */

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) {
    basket.push({
      id: selectedItem,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem); // Here
  localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(selectedItem); // And here
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! To update the digits of picked items on each item card
 */

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  let element = document.getElementById(id);
  
  if (element) {
    element.innerHTML = search.item;
    calculation();
    TotalAmount();
  } else {
    console.error(`Element with ID ${id} not found.`);
  }
};


/**
 * ! Used to remove 1 selected product card from basket
 * ! using the X [cross] button
 */

let removeItem = (id) => {
  let selectedItem = id;
  basket = basket.filter((x) => x.id !== selectedItem); // Here
  calculation();
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! Used to calculate total amount of the selected Products
 * ! with specific quantity
 * ? When basket is blank, it will show nothing
 */

let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { id, item } = x;
        let filterData = itemsData.find((x) => x.id === id);
        return filterData ? filterData.price * item : 0;
      })
      .reduce((x, y) => x + y, 0);

    return (label.innerHTML = `
    <h2>Total de la factura: ₲ ${amount}</h2>
    <button class="checkout">Pagar</button>
    <button onclick="clearCart()" class="removeAll">Vaciar Carrito</button>    
    `);
  } else return;
};

TotalAmount();

let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};

window.clearCart = clearCart;
window.increment = increment;
window.decrement = decrement;
window.removeItem = removeItem;