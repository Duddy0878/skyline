import {fetchApi, fetchApiWithId , postApi , patchApi} from './api.js'
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io();

socket.on("item-added", () => {
    
});

    let typeOf = new URLSearchParams(window.location.search).get('type');

    async function loadItems() {
    let items = await fetchApi('/items');
    // createItemCards(items);

    console.log(items);



    var cateCheck = ''
    let category = await fetchApi('/categorys');

    const grouped = {};
    items.forEach(item => {
    if (!grouped[item.cate_id]) grouped[item.cate_id] = [];
    grouped[item.cate_id].push(item);
    });

    // Sort each category by order
    for (const cat in grouped) {
    grouped[cat].sort((a, b) => a.order - b.order);
    }

    console.log(grouped);
    

    
    for (let i = 0; i < grouped.length; i++) {
       if(grouped[i] === 6 && typeOf === 'rails'){
        createItemCards(grouped[i]);
       }

        
     }
    
    
}

loadItems();

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function createItemCards(item){
    let div = document.querySelector('.items');

    for(let it of item){

        let container = document.createElement('div');
        container.className = 'container';
        container.id = it.id;

        let pic = document.createElement('div');
        pic.className = 'pic';
        pic.innerHTML = `<img src="/${it.img}" alt="" onerror="this.src='/pic/Asset 3@4x.png'">`
        container.appendChild(pic);

        let name = document.createElement('div');
        name.className = 'name';
        name.innerHTML = `<p>${it.name}</p>`;
        container.appendChild(name);

        let quantity = document.createElement('div');
        quantity.className = 'quantity';
        quantity.innerHTML = `<input type="number" placeholder="0"></input>`;
        container.appendChild(quantity);
        div.appendChild(container);
    }

}