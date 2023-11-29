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

const onMenuItemsListEl = document.getElementById('on-menu-items-list');
const offMenuItemsListEl = document.getElementById('off-menu-items-list');

onValue(itemsInDB, (snapshot) => {
    const onMenuItems = [];
    const offMenuItems = [];

    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        const id = childSnapshot.key;

        if (item.priority > 0) {
            onMenuItems.push({ ...item, id });
        } else {
            offMenuItems.push({ ...item, id });
        }
    });

    onMenuItems.sort((a, b) => a.priority - b.priority);

    onMenuItems.forEach((item, index) => {
        const newPriority = index + 1;
        if (item.priority !== newPriority) {
            update(ref(database, 'items/' + item.id), {
                priority: newPriority
            });
        }
    });

    onMenuItemsListEl.innerHTML = '';
    onMenuItems.forEach((item) => renderOnMenuItems(item));
    
    offMenuItemsListEl.innerHTML = '';
    offMenuItems.forEach((item) => renderOffMenuItems(item));
});

function renderOnMenuItems(item) {
    const itemEl = document.createElement("li");
    itemEl.innerHTML += ` 
        <img src="../${item.img}" width="150" height="75">
        <span>${item.name}</span> ₲${item.price} 
        </li><br>
        <p>${item.priority}</p>`;

    const offOfMenuButton = document.createElement("button");
    offOfMenuButton.textContent = "❌";
    offOfMenuButton.addEventListener("click", () => {
        update(ref(database, 'items/' + item.id), {
            priority: 0
        });
    });

    const upMenuButton = document.createElement("button");
    upMenuButton.textContent = "🔺";
    upMenuButton.addEventListener("click", () => {});

    const downMenuButton = document.createElement("button");
    downMenuButton.textContent = "🔻";
    downMenuButton.addEventListener("click", () => {});


    itemEl.appendChild(offOfMenuButton);
    itemEl.appendChild(upMenuButton);
    itemEl.appendChild(downMenuButton);

    onMenuItemsListEl.appendChild(itemEl);
}

function renderOffMenuItems(item) {
    const itemEl = document.createElement("li");
    itemEl.innerHTML += ` 
        <img src="../${item.img}" width="150" height="75">
        <span>${item.name}</span> ₲${item.price} 
        </li>`;

    const ontoMenuButton = document.createElement("button");
    ontoMenuButton.textContent = "🍽️";
    ontoMenuButton.addEventListener("click", () => {
        update(ref(database, 'items/' + item.id), {
            priority: 1
        }).then(() => {
            onValue();
        });
    });

    itemEl.appendChild(ontoMenuButton);
    offMenuItemsListEl.appendChild(itemEl);
}
