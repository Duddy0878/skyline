import {fetchApi, fetchApiWithId , postApi , patchApi} from './api.js'
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io();

socket.on("item-added", () => {
    
});

async function loadItems() {
    let items = await fetchApi('/items');

    let div = document.querySelector('.items');
    var cateCheck = ''

    let category = await fetchApi('/categorys');

    for( let item of items ){
        let currentCategory = category.find(cate => cate.id === item.cate_id);
        if(cateCheck != currentCategory.name){
                cateCheck = currentCategory.name;
                let categoryHeader = document.createElement('div')
                categoryHeader.className = 'categoryHeader'
                categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(currentCategory.name)} </h2>`
                div.appendChild(categoryHeader)
        }

        let container = document.createElement('div');
        container.className = 'container';
        container.id = item.id;

        let pic = document.createElement('div');
        pic.className = 'pic';
        pic.innerHTML = `<img src="/${item.img}" alt="" onerror="this.src='/pic/Asset 3@4x.png'">`
        container.appendChild(pic);

        let name = document.createElement('div');
        name.className = 'name';
        name.innerHTML = `<p>${item.name}</p>`;
        container.appendChild(name);

        let quantity = document.createElement('div');
        quantity.className = 'quantity';
        quantity.innerHTML = `<input type="number" placeholder="0"></input>`;
        container.appendChild(quantity);
        div.appendChild(container);

    }


}

loadItems();

        function upperCaseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }