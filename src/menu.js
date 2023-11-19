import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-c712b-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDB = ref(database, "items")

const nameFieldEl = document.getElementById("name-field")
const priceFieldEl = document.getElementById("price-field")
const discFieldEl = document.getElementById("disc-field")
const longdiscFieldEl = document.getElementById("longdisc-field")
const prefixFieldEl = document.getElementById("prefix-field")
const addButtonEl = document.getElementById("add-button")
const itemsListEl = document.getElementById("items-list")


onValue(itemsInDB, (snapshot) => {
    const data = snapshot.val();
    itemsListEl.innerHTML = "";
    for (let id in data) {
        renderItems(data[id], id);
    }
});


addButtonEl.addEventListener("click", () => {
    // console.log("add button clicked");
    let nameValue = nameFieldEl.value.toLowerCase();    
    let priceValue = priceFieldEl.value;
    let discValue = discFieldEl.value;
    let longdiscValue = longdiscFieldEl.value;
    let prefixValue = prefixFieldEl.value;


    if (nameValue.trim() === "" || discValue.trim() === "" || longdiscValue.trim() === "" || prefixValue.trim() === "" || priceValue === 0 || isNaN(priceValue)) {
    alert("Por favor, complete todas las secciones.");
    }else {
        let item = {
            name: nameValue,
            price: priceValue,
            disc: discValue,
            longdisc: longdiscValue,
            img: "images/menu/" + prefixValue + ".png",            
            gal1: "images/menu/" + prefixValue + "1.png",
            gal2: "images/menu/" + prefixValue + "2.png",
            gal3: "images/menu/" + prefixValue + "3.png",
        };

        push(itemsInDB, item);
        clearNameFieldEl();  
        clearPriceFieldEl();
        clearDiscFieldEl();
        clearLongdiscFieldEl();
        clearPrefixFieldEl();
    }
});

function clearItemsListEl() {
    itemsListEl.innerHTML = ""
}

// clear fields

function clearNameFieldEl() {
    nameFieldEl.value = ""
}

function clearPriceFieldEl() {
    priceFieldEl.value = ""
}

function clearDiscFieldEl() {
    discFieldEl.value = ""
}

function clearLongdiscFieldEl() {
    longdiscFieldEl.value = ""
}

function clearPrefixFieldEl() {
    prefixFieldEl.value = ""
}



function renderItems(item, id) {
    const itemEl = document.createElement("li");
    
    itemEl.innerHTML = ` 
        <span style="font-weight: bold; font-size: 25px;">${item.name} </span> <code>&#8212;</code> ₲${item.price} 
        <br><span style="font-style: italic;">Breve (disc):</span> ${item.disc} 
        <br><span style="font-style: italic;">Larga (longdisc):</span> ${item.longdisc} 
        <br><span style="font-style: italic;">Imágenes:</span><ul><li>${item.img}
            </li><li>${item.gal1}
            </li><li>${item.gal2}
            </li><li>${item.gal3} 
        </li></ul>
        <span style="font-style: italic;">ID de base de datos:</span> ${id}`
    ;

    const deleteButton = document.createElement("button");
    deleteButton.style.backgroundColor = "red";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.padding = "5px";
    deleteButton.style.width = "15px";
    deleteButton.style.height = "15px";
    deleteButton.style.opacity = "0.5";
    deleteButton.textContent = "X";
    deleteButton.style.fontSize = "7px";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => {
        const userConfirmed = confirm("⚠️⚠️¿Quieres eliminar permanentemente este artículo?⚠️⚠️");
    if (userConfirmed) {
        itemEl.remove();

        const itemRef = ref(database, 'items/' + id);
        remove(itemRef);
    }
});

    itemEl.appendChild(deleteButton);
    itemsListEl.appendChild(itemEl);
}