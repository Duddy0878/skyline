
import {fetchApi, fetchApiWithId , postApi , patchApi} from './api.js'
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io();

socket.on('item-added', () => {
  // Reload items when notified
  loadItems();
});

        loadItems()
        loadCategorys()
        buttonsClick()
        addItem()

        let receiver 

        async function loadItems(){

         let items = await fetchApi('/items')

         let itemsDiv = document.querySelector('.items')
         itemsDiv.innerHTML = ''
         var cateCheck = '';
         items.sort((a, b) => a.cate_id - b.cate_id);

         let category = await fetchApi('/categorys')

         for (const item of items) {
            let currentCategory = category.find(cat => cat.id === item.cate_id);
            if(item.cate_id !== cateCheck){
                cateCheck = item.cate_id
                let categoryHeader = document.createElement('div')
                categoryHeader.className = 'categoryHeader'
                categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(currentCategory.name)} </h2>`
                itemsDiv.appendChild(categoryHeader)
            }

            let container = document.createElement('div')
            container.className = 'container'
            container.id = item.id

            let pic = document.createElement('div')
            pic.className = 'pic'
            pic.innerHTML = `<img src="/${item.img}" alt="" onerror="this.src='/pic/Asset 3@4x.png'">`
            container.appendChild(pic)                                                                                                                                                                                                                                                                                                                                                 

            let name = document.createElement('div')
            name.className = 'name'
            name.innerHTML = `<p> ${item.name} </p> `
            container.appendChild(name)

            let cate = document.createElement('div')
            cate.className = 'cate'
            container.appendChild(cate)
            cate.style.background = currentCategory.color

            itemsDiv.appendChild(container)
         }
      
           }

        async function loadCategorys(){
            
            let categorys = await fetchApi('/categorys')
            console.log(categorys);
            
            let select = document.querySelector('.newF form select[name="categorysN"]')
            for (const category of categorys) {
                let option = document.createElement('option')
                option.value = category.id
                option.innerText = category.name
                select.appendChild(option)
            }
        }

        let status = false;
        
        function buttonsClick(){
            let click = document.querySelector('.side .buttons')
            let counter = 0;
            click.addEventListener('click', async (e)=>{
                let btn = e.target
                let id = btn.id
                if(id === 'more'){
                    document.querySelector(`.forms`).classList.remove('active')
                    status = false;
                    return
                }
                document.querySelector(`.forms`).classList.add('active')
                document.querySelectorAll('.forms > div').forEach(div => {
                    div.style.display = 'none'
                })              
                document.querySelector(`.forms .${id}`).style.display = 'GRID'
                if(id === 'newF'){
                    status = false;
                }
                if(id === 'editItems' || id === 'addInventory'){
                      status = id;
                      await getItem(counter)
                }
                if(id === 'orders'){
                    status = id;
                    orders()
                }
                counter++;
            })
        }

        function closeBtns(closeHtml){
            closeHtml.addEventListener('click', () => {
                    document.querySelector(`.forms`).classList.remove('active')
                    status = false;
                    document.querySelector('.newF form').reset()
                    return
            });
        } 


        async function addItem(){
          
           let click = document.querySelector('.newF form button[type="submit"]')
           click.addEventListener('click', async (e)=>{
                e.preventDefault();
                let imgHtml = document.querySelector('.newF form input[type="file"]').files;
                let name = document.querySelector('.newF form input[name="name"]').value
                let img = imgHtml.length > 0 ? 'pic/'+ imgHtml[0].name : ''
                let cate_id = document.querySelector('.newF form select[name="categorysN"]').value
                let size = document.querySelector('.newF form input[name="size"]').value
                if(imgHtml.length > 0){
                   
                    loadingOn();
                    let fin = await handleImageUpload(imgHtml[0]);
                    if(fin) {
                    loadingOff();
                    }
                    console.log(fin);
                }
                
                if (!name || !cate_id ){
                    let empty = '';
    
                    if (!name) empty += 'Name and ';
                    if (!cate_id) empty += 'Category ';
                    swal.fire({
                        title: `Please fill in ${empty}!`,
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
                    return
                }



                let data = {
                    name,
                    img,
                    cate_id,
                    size
                }

                
                let response = await postApi('/items', data)
                loadingOn();
                if (response.success){
                 loadingOff();
                swal.fire({
                    title: 'Item added successfully!',
                    background: 'black',
                    color: '#FAB519',
                    border: '#FAB519 5px solid',
                    // *** This is where you add your logo image path ***
                    imageUrl: '/pic/Asset%203%404x.png', 
                    imageWidth: 200, // Set the width of your logo
                    imageHeight: 200, // Set the height of your logo
                    imageAlt: 'Custom Logo', // Alternative text for accessibility
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                        popup: 'my-swal-popup'
                    }
                 })
                }
                document.querySelector('.newF form').reset()
           })
        }
        closeBtns(document.querySelector('.closeNewF'))

        function calculateRopeLength(){
            let ropingType = document.querySelector('.ropeForm select').value
            let pit = feetCalculater(document.querySelector('.ropeForm input[placeholder="pit"]').value)
            let travel = feetCalculater(document.querySelector('.ropeForm input[placeholder="travel"]').value)
            let overhead = feetCalculater(document.querySelector('.ropeForm input[placeholder="overhead"]').value)
            let ropeDrop = feetCalculater(document.querySelector('.ropeForm input[placeholder="rope Drop"]').value)
            let halfWayBox  = document.querySelector('.ropeForm input[name="halfWayBox"]').checked
            let doubleWrap  = document.querySelector('.ropeForm input[name="doubleWrap"]').checked

            let totalTravel = pit + travel + overhead + ropeDrop
             console.log(ropingType);
             
            // results
            let hoist = 0
            let whisperFlex = 0
            
            let governer = Math.round((((pit + travel + overhead)* 2) + 60) / 12)

            if(ropingType === '1:1'){
                if(doubleWrap){
                    hoist = Math.round((totalTravel + 384) / 12 )
                    whisperFlex = Math.round((pit + travel + 420 ) / 12 )
                }
                else{
                    hoist = Math.round((totalTravel + 240) / 12 )
                    whisperFlex = Math.round((pit + travel + 300  ) / 12)
                }
            }else{
                hoist = Math.round((totalTravel * 2 + 240) / 12 )
                whisperFlex = Math.round((pit + travel + 300  ) / 12)
            }


            let travelCable = 0
            let travelMulti = 0
            let hoistway = Math.round((pit + travel + overhead + 480) / 12)

            if(halfWayBox){
                travelCable = Math.round(((totalTravel / 2) + 480) / 12)
                travelMulti = Math.round(((totalTravel / 2) + 240)/ 12)
            }
            else{
                travelCable = Math.round((totalTravel + 960) / 12)
            }

            return {
                hoistRope: roundUpToNearest5(hoist) ,
                governerRope: roundUpToNearest5(governer) ,
                whisperFlexRope: roundUpToNearest5(whisperFlex) ,
                travelCableRope: roundUpToNearest5(travelCable) ,
                travelMultiRope: roundUpToNearest5(travelMulti) ,
                hoistwayRope: roundUpToNearest5(hoistway)
            }


        }

        document.querySelector('.ropeForm button[type="submit"]').addEventListener('click', async (e)=>{
            e.preventDefault();

             let jobs = await fetchApi('/jobs')
            inputSelect(jobs, document.querySelector('.ropeOutput #jobsRope'),'Jobs')


            let results = calculateRopeLength()
            document.querySelector('.ropeForm').style.display = 'none'
            document.querySelector('.ropeOutput').style.display = 'grid'

            document.querySelector('.ropeOutput input[name="hoistRope"]').value = results.hoistRope + ' ft'
            document.querySelector('.ropeOutput input[name="governerRope"]').value = results.governerRope + ' ft'
            document.querySelector('.ropeOutput input[name="whisperFlex"]').value = results.whisperFlexRope + ' ft'
            document.querySelector('.ropeOutput input[name="travelCable"]').value = results.travelCableRope + ' ft'
            document.querySelector('.ropeOutput input[name="travelMulti"]').value = results.travelMultiRope + ' ft'
            document.querySelector('.ropeOutput input[name="hoistway"]').value = results.hoistwayRope + ' ft'

            document.querySelectorAll('.ropeOutput button').forEach(async (btn) => {
                
                btn.addEventListener('click', async (e) => {
                    let bId = e.target 
                    
                    if(document.querySelector('.ropeOutput #jobsRope').value === '' || document.querySelector('.ropeOutput input[name="car"]').value === ''){

                        swal.fire({
                            title: `Please fill in Job And Car!`,
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
                   return
                }

                let data = {
                  hoist_rope: results.hoistRope,
                  governer_rope: results.governerRope ,
                  whisper_flex: results.whisperFlexRope,
                  travel_cable: results.travelCableRope,
                  travel_multi: results.travelMultiRope,
                  hoistway: results.hoistwayRope,
                  job_id: document.querySelector('.ropeOutput #jobsRope').value,
                  car: document.querySelector('.ropeOutput input[name="car"]').value
                } 

                
                if(bId.id === 'placeOrder'){
                     alert('order placed')
                }
               
                let response = await postApi('/ropes', data)
                if (response.success){
                swal.fire({
                    title: 'Measurments added successfully!',
                    background: 'black',
                    color: '#FAB519',
                    border: '#FAB519 5px solid',
                    // *** This is where you add your logo image path ***
                    imageUrl: '/pic/Asset%203%404x.png', 
                    imageWidth: 200, // Set the width of your logo
                    imageHeight: 200, // Set the height of your logo
                    imageAlt: 'Custom Logo', // Alternative text for accessibility
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                        popup: 'my-swal-popup'
                    }
                 })
                  document.querySelectorAll('.ropeOutput input').forEach((rope) =>{
                    rope.value = ''
                  })
                  document.querySelector('.ropeOutput #jobsRope').innerHTML = ''

                  document.querySelector(`.forms`).classList.remove('active')
                
                }
            })
                

            })

        })

        function feetCalculater(input){
         const parts = input.trim().split('.');
            let feet = 0, inches = 0;
            if (parts.length === 2) {
                feet = parseInt(parts[0], 10);
                inches = parseInt(parts[1], 10);
                if (isNaN(feet)) feet = 0;
                if (isNaN(inches)) inches = 0;
            } else if (parts.length === 1) {
                feet = parseInt(parts[0], 10);
                if (isNaN(feet)) feet = 0;
            } else {
                return 'Invalid format';
            }
            if (inches >= 12) {
                return 'Inches should be less than 12';
            }
            return (feet * 12) + inches;
        }

        function roundUpToNearest5(value) {
            console.log('1',Math.ceil(value), '2', Math.ceil(value / 5), '3', Math.ceil(value / 5) * 5);
            
            return Math.ceil(value / 5) * 5;
        }

        function inputSelect(select,input, main){
             const option1 = document.createElement('option')
                option1.innerHTML = main
                input.appendChild(option1)
                
            select.forEach( (selc) => {
                const option = document.createElement('option')
                option.innerHTML = selc.address
                option.value = selc.id
                
                input.appendChild(option)
            })
        }

        async function getItem(counter){
            if (counter > 0) return;
            let id = '';
            document.querySelector('.items').addEventListener('click', async (e)=>{
                if(!status) return;
                let itemDiv = e.target.closest('.container') 
                if(!itemDiv) return;
                id = itemDiv.id 
                let item = await fetchApiWithId('/items', id)

                if(status === 'orders'){
                }
                if(status === 'editItems'){

                }
                if(status === 'addInventory'){
                    addInventory(item)
                }


                
            })

        }

        let countNewOrders = 0;
       async function orders(){
            
            let orders = await fetchApi('/orders')
            if(countNewOrders === orders.length) return;
            let jobs = await fetchApi('/jobs')

            let ordersContainer = document.querySelector('.orders')
            ordersContainer.innerHTML = ''

            for (const order of orders) {
                let div = document.createElement('div')
                div.className = 'each'
                countNewOrders++;
                let curentJob = jobs.find(job => job.id === order.job_id);


                let infoDiv = document.createElement('div')
                infoDiv.className = 'infoO'
                infoDiv.innerHTML = `       
                           <div class="employee">
                    ${upperCaseFirstLetter(order.name)}
                </div>
                  <div class="address">
                    ${curentJob.address + ' Car ' + order.car_number}
                  </div>
                  <div class="dateO">
                    ${dayjs(order.date).format('MMMM D, YYYY')}
                  </div>
                  <div class="orderNumber">
                     Order #000${order.id}
                    </div>
                  <div class="status">
                    Status: ${order.status}
                  </div>
                <div class="phase">
                  Phase: 1
                </div>
                `
                let buttonsDiv = document.createElement('div')
                buttonsDiv.className = 'buttonsO'
                buttonsDiv.innerHTML = `
                                  <button id="${order.id}" class="viewOrder">View Order</button>
                  <button class="orderd">Orderd</button>`

                div.appendChild(infoDiv)
                div.appendChild(buttonsDiv)
                ordersContainer.appendChild(div)
            }

            document.querySelectorAll('.viewOrder').forEach( (btn) => {
                btn.addEventListener('click', async (e) => {
                    let orderDiv = e.target.closest('.buttonsO')
                    let id = orderDiv.querySelector('.viewOrder').id
                    viewOrder(id)

                })
            })
            
          
        }

        async function viewOrder(id){
            let tryout =  await fetchApiWithId('/orders', id)

              console.log(tryout);
        }

        function editItems(){

        }

        function addInventory(item){
            let addDiv = document.querySelector('.addInventory')
            addDiv.innerHTML = ''

            let div = document.createElement('div')
            div.className = 'itemInInventory'
            addDiv.appendChild(div)
            
            let img = document.createElement('div')
            img.style.justifyContent = 'center'
            img.innerHTML = `<img src="/${item.img}" alt="" style="width:100%;height:300px;object-fit:contain;" onerror="this.src='/pic/Asset%203%404x.png'">`
            div.appendChild(img)
            
            let name = document.createElement('div')
            name.style.fontSize = '24px'
            name.innerHTML = `<p> ${item.name} </p> `
            div.appendChild(name)


            let input = document.createElement('input')
            input.type = 'number'
            input.style.width = '50%'
            input.placeholder = 'Quantity to add'
            addDiv.appendChild(input)

            let button = document.createElement('button')
            button.innerText = 'Add Inventory'
            addDiv.appendChild(button)
      
            button.addEventListener('click', () => {
                let quantity = parseInt(input.value, 10);
                if (isNaN(quantity) || quantity <= 0) {
                    alert('Please enter a valid quantity');
                    return;
                }
                // Add inventory logic here
            });
        }

        function upperCaseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        async function handleImageUpload(file) {

            const response = await fetch('/list-pic');
            const files = await response.json();

            // 2. Check if file already exists
            if (files.includes(file.name)) {
                return;
            }

            // 3. Upload file to server
            const formData = new FormData();
            formData.append('image', file);
           const check = await fetch('/upload-pic', {
                method: 'POST',
                body: formData
            });
            if (!check.ok) {
                console.error('Image upload failed');
                alert('Image upload failed');
                return false;
            }
            else {
                return true;
            }
            
         }

         function loadingOn(){
             document.querySelector('.loading').style.display = 'block';
         }

         function loadingOff(){
             document.querySelector('.loading').style.display = 'none';
         }





        






