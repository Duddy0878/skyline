
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
        createItemCards(grouped[2],'none'); // wood
        createItemCards(grouped[3],'abc'); // safety
        createItemCards(grouped[4],'kind'); // fasteners
        createItemCards(grouped[5],'kind'); // bits
        createItemCards(grouped[6],'order'); // rails // unknown
        //  createItemCards(grouped[2]); // Accessories
    }
    if(typeOf === 'ropes'){
        createItemCards(grouped[1],'abc'); // general supplies
        createItemCards(grouped[3],'abc'); // safety
        createItemCards(grouped[4],'kind'); // fasteners
        createItemCards(grouped[5],'kind'); // bits
        createItemCards(grouped[7],'emt'); // electrical
        createItemCards(grouped[8],'order'); // troughing
        createItemCards(grouped[9],'abc'); // kindorf
        createItemCards(grouped[10],'order'); // wires
        createItemCards(grouped[12],'ropes'); // ropes
        createItemCards(grouped[13],'abc'); // cab     

     }

     document.querySelector('.hide').style.display = 'grid';
    
    
    
}

loadItems();

let jobs = await fetchApi('/jobs');
for(let job of jobs){
    let option = document.createElement('option');
    option.value = job.id;
    option.innerText = job.address;
    document.querySelector('#jobsiteSelect').appendChild(option);
}

document.querySelector('button').addEventListener('click', async () => {

    let orderItems = [];
    let itemElements = document.querySelectorAll('.container, .containerB, .li');
    itemElements.forEach(container => {
        let itemId = container.id;
        let quantityInput = container.querySelector('input');
        let quantity = parseInt(quantityInput.value);
        if (quantity > 0) {
            orderItems.push({ item_id: itemId, quantity: quantity });
        }
    });

    let employee = document.querySelector('.nameE input').value;
    let jobsiteSelect = document.querySelector('#jobsiteSelect');
    let jobSite = jobsiteSelect.value;
    let carNumber = document.querySelector('.car input').value;
    if(orderItems.length === 0){
                    swal.fire({
                        title: `No Item Was Selected!`,
                        background: 'black',
                        color: 'red',
                        border: '#FAB519 5px solid',
                        // *** This is where you add your logo image path ***
                        imageUrl: '/pic/red.png', 
                        imageWidth: 200, // Set the width of your logo
                        imageHeight: 200, // Set the height of your logo
                        imageAlt: 'Custom Logo', // Alternative text for accessibility
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'red',
                        customClass: {
                            popup: 'my-swal-popup'
                        }                        
                    })
        return;
    }
    if(!employee || !jobSite || !carNumber){
                    swal.fire({
                        title: `Please fill in ${!employee ? 'Employee Name' : !jobSite ? 'Job Site' : 'Car Number'}!`,
                        background: 'black',
                        color: 'red',
                        border: '#FAB519 5px solid',
                        // *** This is where you add your logo image path ***
                        imageUrl: '/pic/red.png', 
                        imageWidth: 200, // Set the width of your logo
                        imageHeight: 200, // Set the height of your logo
                        imageAlt: 'Custom Logo', // Alternative text for accessibility
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'red',
                        customClass: {
                            popup: 'my-swal-popup'
                        }                        
                    })
        return;
    }

    let sendOrder = await postApi('/orders', {job_id: jobSite, car_number: carNumber, status: 'pending',name: employee})
    let orderId = sendOrder.insertedId;
    if(orderId){
        for(let orderItem of orderItems){
            orderItem.order_id = orderId;
        }
        loadingOn();
        let sendOrderItems = await postApi('/order-items', {items: orderItems});
        if(sendOrderItems.success){
            swal.fire({
                title: 'Order placed successfully!',
                background: 'black',
                color: '#FAB519',
                border: '#FAB519 5px solid',
                imageUrl: '/pic/Asset%203%404x.png', 
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: 'Success Logo',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    popup: 'my-swal-popup'
                }                        
            }).then(() => {
                window.location.href = '/index.html';
            });
        }
        else if(!sendOrderItems.success){
            swal.fire({
                title: `Error placing order: ${sendOrderItems.error}`,
                text: 'Please Contact Your Project Manager',
                background: 'black',
                color: 'red',
                border: '#FAB519 5px solid',
                imageUrl: '/pic/red.png',
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: 'Error Logo',
                confirmButtonText: 'OK',
                confirmButtonColor: 'red',
                customClass: {
                    popup: 'my-swal-popup'
                } 
            })
        }

    
     
     };

    });


function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createItemCards(itemB,order){


    if(order === 'order'){
        itemB.sort((a, b) => a.order - b.order);
        createCard(itemB);
    }

    if(order === 'kind'){
        let allKinds = {};

        for(let itB of itemB){
            if(!allKinds[nameTillNumber(itB.name, 1)]){
                allKinds[nameTillNumber(itB.name, 1)] = [];
            }
            allKinds[nameTillNumber(itB.name, 1)].push(itB);
        }

        let divB = document.querySelector('.items');

            let categoryFind = category.find(cat => cat.id === itemB[0].cate_id);

            let categoryHeader = document.createElement('div')
            categoryHeader.className = 'categoryHeader'
            categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(categoryFind.name)} </h2>`
            divB.appendChild(categoryHeader)

            console.log(allKinds);
        for(let kind in allKinds){
            
        let containerB = document.createElement('div');
        containerB.className = 'containerB';
        let extraDiv = document.createElement('div');
        extraDiv.className = 'extraDiv';
        let mainExtra = document.createElement('div');
        mainExtra.className = 'mainExtra';

        let name = document.createElement('div');
        name.className = 'name';
        name.innerHTML = `<p style="font-size: 25px">${upperCaseFirstLetter(kind)}</p>`;
        let img = document.createElement('div');
        img.className = 'pic';
        img.innerHTML = `<img src="/${allKinds[kind][0].img}" alt="" onerror="this.src='/pic/Asset 3@4x.png'">`
        mainExtra.appendChild(name);
        mainExtra.appendChild(img);
        containerB.appendChild(mainExtra);
        divB.appendChild(containerB);
            allKinds[kind].sort((a, b) => parseSize(a.size) - parseSize(b.size));
            for(let it of allKinds[kind]){
                let container = document.createElement('div');
                container.className = 'li'
                container.id = it.id;

                let name = document.createElement('div');
                name.className = 'name';
                name.innerHTML = `${nameTillNumber(it.name, 2)}`;

                let quantity = document.createElement('div');
                quantity.className = 'quantity';
                quantity.innerHTML = `<input type="number" placeholder="0"></input>`;
                container.appendChild(name);
                container.appendChild(quantity);
                extraDiv.appendChild(container);

            }

            containerB.appendChild(extraDiv);
            
        }

        

       
    }

    if(order === 'abc' || order === 'none'){
        createCard(itemB);
    }

    if(order === 'emt'){
        let sizes = {
            "3/8": [],
            "1/2": [],
            "3/4": [],
            "1-1/2": [],
            "else": []

        };
        for(let itB of itemB){
            if(itB.size === '3/8' || itB.size === 3/8){
                sizes['3/8'].push(itB);
            }
            if(itB.size === '1/2' || itB.size === 1/2){
                sizes['1/2'].push(itB);
            }
            if(itB.size === '3/4' || itB.size === 3/4){

                sizes['3/4'].push(itB);
            }
            if(itB.size === '1-1/2' || itB.size === 1-1/2){

                sizes['1-1/2'].push(itB);
            }
            if(!itB.size) {
                sizes['else'].push(itB);
            }
        }

        for(let size in sizes){
            sizes[size].sort((a, b) => a.order - b.order);
             if(size === 'else'){
                createCard(sizes[size]);
             }
             else{

                 createCard(sizes[size],'emt',size);
             }
        }
        
        // createCard(itemB);
    }

    if(order === 'ropes'){

        createCard(itemB,'ropes');

    }

}

function createCard(item,yes=false,word){
    let div = document.querySelector('.items');

    if(!yes){


    let categoryFind = category.find(cat => cat.id === item[0].cate_id);

    let categoryHeader = document.createElement('div')
    categoryHeader.className = 'categoryHeader'
    categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(categoryFind.name)} </h2>`
    div.appendChild(categoryHeader)
    }
    if(yes === 'emt'){
    
    let categoryHeader = document.createElement('div')
    categoryHeader.className = 'categoryHeader'
    categoryHeader.innerHTML = `<h2>EMT ${upperCaseFirstLetter(word)}" </h2>`
    div.appendChild(categoryHeader)
      
    }
    if(yes === 'ropes'){

    let categoryFind = category.find(cat => cat.id === item[0].cate_id);

    let categoryHeader = document.createElement('div')
    categoryHeader.className = 'categoryHeader'
    categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(categoryFind.name)} </h2>`
    div.appendChild(categoryHeader)
      
    let ropeContainer = document.createElement('div');
    ropeContainer.className = 'ropeContainer';
   
    ropeContainer.innerHTML = `
        <div class="ropeItem">
         <h2> Requested Ropes Package : &nbsp; <input type="checkbox" /> </h2><br/>
          Includes: Hoist Ropes, governer Ropes, whisper flex, 
          and shackles with springs,
          dampning device kit,
          compsaation chain installation kit, <br/>
          travel cable, travel multi, hoistway ropes,
          kellem grips, hitch brackets,
    `

    div.appendChild(ropeContainer);


    }
    
            

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

function createList(items){

}

function nameTillNumber(str, number) {
    // Match: everything up to the first number, then everything after (including x, -, /, spaces, etc.)
    const match = str.match(/^(.*?)(\d.*)$/);
    // match[1] = name, match[2] = number/size (including "x" and more)
    if (number == 1) {
        return match ? match[1].trim() : str;
    } else if (number == 2) {
        return match ? match[2].trim() : '';
    }
}

function parseSize(size) {
    if (!size) return 0;
    // Handle fractions like "5/8"
    if (size.includes('/')) {
        const [num, denom] = size.split('/').map(Number);
        return denom ? num / denom : num;
    }
    // Handle mixed numbers like "1 1/2"
    if (size.match(/^\d+ \d+\/\d+$/)) {
        const [whole, fraction] = size.split(' ');
        const [num, denom] = fraction.split('/').map(Number);
        return Number(whole) + (denom ? num / denom : num);
    }
    // Handle plain numbers
    return parseFloat(size) || 0;
}


         function loadingOn(){
             document.querySelector('.loading').style.display = 'block';
         }

         function loadingOff(){
             document.querySelector('.loading').style.display = 'none';
         }
