import { fetchApi ,fetchApiWithId} from "./api.js";


orders();


async function orders(){
     
     let orders = await fetchApi('/orders')
     let jobs = await fetchApi('/jobs')

     let ordersContainer = document.querySelector('.list')
     ordersContainer.innerHTML = ''

     for (const order of orders) {
         let div = document.createElement('div')
         div.className = 'each'
         div.id = `${order.id}`
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
             ${dayjs(order.date).format('MM/DD/YYYY')}
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

         div.appendChild(infoDiv)
         ordersContainer.appendChild(div)
     }

     document.querySelectorAll('.each').forEach( (btn) => {
         btn.addEventListener('click', async (e) => {
             let id = btn.id
             let orderData = orders.find(o => o.id == id)

             viewOrder(id, orderData, jobs.find(job => job.id === orderData.job_id).address)

         })
     })
     
   
 }

async function viewOrder(id,orderData,curentJob){
    let orderItems =  await fetchApiWithId('/order-items', id)

    let eachOrderView = document.querySelector('.side2')
    eachOrderView.innerHTML = ''

    let headerDiv = document.createElement('div')
    headerDiv.className = 'headerO'
    headerDiv.innerHTML = `
        <h4> Order #000${id} &nbsp; Job: ${curentJob} &nbsp; Car: ${orderData.car_number} &nbsp; Phase: 1 </h4> 
        <div class="printOrder"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg> </div>
        <div class="copyOrder"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg> </div>
        <div class="closeOrderView"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg> </div>
    `
    eachOrderView.appendChild(headerDiv)
    let table = document.createElement('table')
    table.className = 'table'
    let header = document.createElement('thead')
    let headerRow = document.createElement('tr')
    header.appendChild(headerRow)
    table.appendChild(header)
    headerRow.innerHTML = `
        <th> QTY </th>
        <th> Item Name </th>
        <th> Shop? </th>
        <th> Price </th>
    `
    let body = document.createElement('tbody')
    table.appendChild(body)
    eachOrderView.style.display = 'block'
    for (const item of orderItems) {
        let row = document.createElement('tr')
        row.className = 'itemRow'
        row.innerHTML = `
            <td> ${item.quantity} </td>
            <td> ${item.name} </td>
            <td style="${item.shop? 'background-color: #FAB519' : ''}"> </td>
            <td> ${item.price || ''} </td>
        `
        body.appendChild(row)
    }

    eachOrderView.appendChild(table)

    document.querySelector('.closeOrderView').addEventListener('click', () => {
        eachOrderView.innerHTML = ''
    })

    document.querySelector('.printOrder').addEventListener('click', () => {
        printSide2();
    })
}

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function printSide2() {
  const printContents = document.querySelector('.side2').innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Print</title>');
  
  printWindow.document.write('<link rel="stylesheet" href="../css/ordersList.css" type="text/css" />');
  printWindow.document.write('<link rel="stylesheet" href="../css/style.css" type="text/css" />');
  printWindow.document.write('</head><body>');
  printWindow.document.write(printContents);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

