import {fetchApi, fetchApiWithId , postApi , patchApi} from './api.js'
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io();

socket.on("item-added", () => {
    
});

    let typeOf = new URLSearchParams(window.location.search).get('type');
    let category = await fetchApi('/categorys');

    async function loadItems() {
    let items = await fetchApi('/items');
    // createItemCards(items);

    console.log(items);



    var cateCheck = ''

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
    
     if(typeOf === 'rails'){
        createItemCards(grouped[1],'abc'); // general supplies
        createItemCards(grouped[3],'abc'); // hardware
         createItemCards(grouped[6],'order'); // rails
        //  createItemCards(grouped[2]); // Accessories
     }
    
    
    
}

loadItems();

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function createItemCards(item,order){


    if(order === 'order'){
        item.sort((a, b) => a.order - b.order);
    }
    // if(order === 'abc'){
    //     item.sort((a, b) => a.name.localeCompare(b.name));
    // }
    let div = document.querySelector('.items');

    let categoryFind = category.find(cat => cat.id === item[0].cate_id);

        let categoryHeader = document.createElement('div')
        categoryHeader.className = 'categoryHeader'
        categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(categoryFind.name)} </h2>`
        div.appendChild(categoryHeader)
            

    

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