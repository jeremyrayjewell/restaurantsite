import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-c712b-default-rtdb.firebaseio.com/"


const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDB = ref(database, "items")

onValue(itemsInDB, (snapshot) => {
    const data = snapshot.val();
    itemsListEl.innerHTML = "";
    for (let id in data) {
        renderItems(data[id], id);
    }
});


function clearItemsListEl() {
    itemsListEl.innerHTML = ""
}


function renderItems(item, id) {
    const itemEl = document.createElement("li");
    
    itemEl.innerHTML = ` 
        <span style="font-weight: bold; font-size: 25px;">${item.name} </span> <code>&#8212;</code> ₲${item.price} 
        <br><span style="font-style: italic;">Breve (desc):</span> ${item.desc} 
        <br><span style="font-style: italic;">Larga (longdesc):</span> ${item.longdesc} 
        <br><span style="font-style: italic;">Imágenes:</span><ul><li>${item.img}
            </li><li>${item.gal1}
            </li><li>${item.gal2}
            </li><li>${item.gal3} 
        </li></ul>
        <span style="font-style: italic;">Posición del menú:</span> ${item.priority}
        <br><span style="font-style: italic;">ID de base de datos:</span> ${id}`
    ;
};

    
    itemsListEl.appendChild(itemEl);
}
