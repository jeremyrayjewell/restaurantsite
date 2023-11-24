import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
const itemsInDB = ref(database, "items");

// const itemsListEl = document.getElementById("items-list")
const onMenuItemsListEl = document.getElementById('on-menu-items-list');
const offMenuItemsListEl = document.getElementById('off-menu-items-list');

onValue(itemsInDB, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        const id = childSnapshot.key;
        renderOnMenuItems(item, id);
        renderOffMenuItems(item, id);
    });
});


function clearItemsListEl() {
    itemsListEl.innerHTML = ""
}

function renderOnMenuItems(item, id) {
    if (item.priority > 0) {
        const itemEl = document.createElement("li");

        itemEl.style.position = "relative"; // needed for the absolute positioning of the shading

        const shadingEl = document.createElement("div");
        shadingEl.style.position = "absolute";
        shadingEl.style.top = "0";
        shadingEl.style.right = "0";
        shadingEl.style.bottom = "0";
        shadingEl.style.left = "0";
        shadingEl.style.backgroundColor = "green";
        shadingEl.style.opacity = "0.15";
        itemEl.appendChild(shadingEl);

        itemEl.innerHTML += ` 
        <img src="../${item.img}" width="150" height="75">
        <span style="font-weight: bold; font-size: 25px;">${item.name} </span> <code>&#8212;</code> ₲${item.price} 
        </li></ul>
        <span style="font-style: italic;">Posición del menú:</span> ${item.priority}`
        ;
        const offOfMenuButton = document.createElement("button");
        offOfMenuButton.style.backgroundColor = "red";
        offOfMenuButton.style.color = "red";
        offOfMenuButton.style.border = "none";
        offOfMenuButton.style.padding = "5px";
        offOfMenuButton.style.width = "37px";
        offOfMenuButton.style.height = "37px";
        offOfMenuButton.style.opacity = "0.5";
        offOfMenuButton.style.margin = "0px 20px 50px";
        offOfMenuButton.textContent = "❌";
        offOfMenuButton.style.fontSize = "20px";
        offOfMenuButton.className = "off-menu-button";            
        offOfMenuButton.addEventListener("click", () => {
            item.priority = 0;
            onMenuItemsListEl.innerHTML = '';
            offMenuItemsListEl.innerHTML = '';
            update(ref(database, 'items/' + id), {
                priority: item.priority
            }).then(() => {
                renderOnMenuItems();
                renderOffMenuItems();
            }).catch((error) => {
                console.error("Error updating document: ", error);
            });
        });

        itemEl.appendChild(offOfMenuButton);
        onMenuItemsListEl.appendChild(itemEl);
    }
}

function renderOffMenuItems(item, id) {
    if (item.priority === 0) {
        const itemEl = document.createElement("li");
        itemEl.style.position = "relative"; // needed for the absolute positioning of the shading

        const shadingEl = document.createElement("div");
        shadingEl.style.position = "absolute";
        shadingEl.style.top = "0";
        shadingEl.style.right = "0";
        shadingEl.style.bottom = "0";
        shadingEl.style.left = "0";
        shadingEl.style.backgroundColor = "red";
        shadingEl.style.opacity = "0.2";
        itemEl.appendChild(shadingEl);

        itemEl.innerHTML += ` 
        <img src="../${item.img}" width="150" height="75">
        <span style="font-weight: bold; font-size: 25px;">${item.name} </span> <code>&#8212;</code> ₲${item.price} 
        </li></ul>
        <span style="font-style: italic;">Posición del menú:</span> ${item.priority}`
        ;

        const ontoMenuButton = document.createElement("button");
        ontoMenuButton.style.backgroundColor = "green";
        ontoMenuButton.style.color = "white";
        ontoMenuButton.style.border = "none";
        ontoMenuButton.style.padding = "5px";
        ontoMenuButton.style.width = "37px";
        ontoMenuButton.style.height = "37px";
        ontoMenuButton.style.opacity = "0.5";
        ontoMenuButton.style.margin = "0px 20px 50px";
        ontoMenuButton.textContent = "🍽️";
        ontoMenuButton.style.fontSize = "20px";
        ontoMenuButton.className = "on-menu-button";            
        ontoMenuButton.addEventListener("click", () => {
            onMenuItemsListEl.innerHTML = '';
            offMenuItemsListEl.innerHTML = '';
            update(ref(database, 'items/' + id), {
                priority: 1
            }).then(() => {
                renderOnMenuItems();
                renderOffMenuItems();
            }).catch((error) => {
                console.error("Error updating document: ", error);
            });
        });

        itemEl.appendChild(ontoMenuButton);
        offMenuItemsListEl.appendChild(itemEl);
    }
}


// function renderItems(item, id) {
//     const itemEl = document.createElement("li");
    
//     itemEl.innerHTML = ` 
//         <img src="../${item.img}" width="150" height="75">
//         <span style="font-weight: bold; font-size: 25px;">${item.name} </span> <code>&#8212;</code> ₲${item.price} 
//         </li></ul>
//         <span style="font-style: italic;">Posición del menú:</span> ${item.priority}
//         <br><br><hr><br><br>`
//     ;
    
//     itemsListEl.appendChild(itemEl);
// }
