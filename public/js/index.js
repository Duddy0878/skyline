const target = document.querySelector('.select > div');
target.addEventListener('click', () => {

    if(target.classList.contains('rails')){
        window.location.href = '/html/order.html?type=rails'
    }
    else if(target.classList.contains('ropes')){
        window.location.href = '/html/order.html?type=ropes'
    }
})