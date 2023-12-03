import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, child, get, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlQrgx_Jt9utW1XVuM90OuSS6y2YHWWN4",
  authDomain: "saborcaribe-b3d6f.firebaseapp.com",
  projectId: "saborcaribe-b3d6f",
  storageBucket: "saborcaribe-b3d6f.appspot.com",
  messagingSenderId: "536011684254",
  appId: "1:536011684254:web:cbd83b4eda113b81ba7e8f",
  databaseURL: "https://saborcaribe-b3d6f-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

let itemsData;  // Declare itemsData variable

const itemsRef = ref(database, "items");

let shop = document.getElementById("shop");


let basket = JSON.parse(localStorage.getItem("data")) || [];


let generateShop = (itemsData) => {
  shop.innerHTML = itemsData.map((x) => {
    let { id, name, desc, longdesc, img, price, gal1, gal2, gal3 } = x;
    let search = basket.find((y) => y.id === id) || [];

    function openModal(id) {
      document.getElementById(`myModal-${id}`).style.display = 'flex';
    }

    function closeModal(id) {
      document.getElementById(`myModal-${id}`).style.display = 'none';
    }

    


    return `
      <div id=product-id-${id} class="item">
        <img width="220" src=${img} alt="" onclick="openModal${id}()" style="cursor: pointer;">
        <div class="details">
          <h3 onclick="openModal${id}()" style="cursor: pointer;">${name}</h3>
          <p onclick="openModal${id}()" style="cursor: pointer;">${desc}</p>
          <div class="price-quantity">
            <h5 onclick="openModal${id}()" style="cursor: pointer;">₲  ${price} </h5>
            <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${
                search.item === undefined ? 0 : search.item
              }</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
            </div>
          </div>
        </div>
        <div id="myModal-${id}" class="modal">
          <div class="modal-content">
            <span class="close-btn" onclick="closeModal${id}()">&times;</span>
            <h2 id="modalName">${name}</h2>
            <img id="modalImg" src=${img} alt="Product image">
            <p id="modalDesc">${longdesc}</p>
            <div id="modalGallery" class="modal-gallery">
              <img class="modal-gallery-img" src=${gal1} alt="Product image">
              <img class="modal-gallery-img" src=${gal2} alt="Product image">
              <img class="modal-gallery-img" src=${gal3} alt="Product image">
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
};




//DATABASE CODE

shop.innerHTML = '<p>Cargando...</p>';

get(itemsRef)
  .then((snapshot) => {
    // Hide the loading indicator after data is retrieved
    shop.innerHTML = "";

    if (snapshot.exists()) {
      const itemsData = [];
      snapshot.forEach((childSnapshot) => {
        const item = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        itemsData.push(item);
      });
      generateShop(itemsData);
      let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  console.log(basket);
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  console.log(basket);
  localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();
    } else {
      console.error("No data available in the database");
    }
  })
  .catch((error) => {
    console.error(error);
  });
