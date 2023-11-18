let shop = document.getElementById("shop");

/**
 * ! Basket to hold all the selected items
 * ? the getItem part is retrieving data from the local storage
 * ? if local storage is blank, basket becomes an empty array
 */

let basket = JSON.parse(localStorage.getItem("data")) || [];

/**
 * ! Generates the shop with product cards composed of
 * ! images, title, price, buttons, description
 */

let generateShop = () => {
  shop.innerHTML = shopItemsData.map((x) => {
    let { id, name, desc, longdesc, img, price, gal1, gal2, gal3 } = x;
    let search = basket.find((y) => y.id === id) || [];

    function openModal() {
      document.getElementById(`myModal-${id}`).style.display = 'flex';
    }

    function closeModal() {
      document.getElementById(`myModal-${id}`).style.display = 'none';
    }

    window[`openModal${id}`] = openModal;
    window[`closeModal${id}`] = closeModal;

    return `
      <div id=product-id-${id} class="item">
        <img width="220" src=${img} alt="" onclick="openModal${id}()">
        <div class="details">
          <h3 onclick="openModal${id}()">${name}</h3>
          <p>${desc}</p>
          <div class="price-quantity">
            <h5>₲  ${price} </h5>
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

generateShop();

generateShop();

// modals

// function openModal(id) {
//   document.getElementById('myModal').style.display = 'flex';
// }

// function closeModal() {
//   document.getElementById('myModal').style.display = 'none';
// }

// // Close the modal if the user clicks outside of it
// window.onclick = function (event) {
//   var modal = document.getElementById('myModal');
//   if (event.target == modal) {
//     closeModal();
//   }
// };

/**
 * ! used to increase the selected product item quantity by 1
 */

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

/**
 * ! used to decrease the selected product item quantity by 1
 */

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

/**
 * ! To update the digits of picked items on each item card
 */

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
};

/**
 * ! To calculate total amount of selected Items
 */

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();