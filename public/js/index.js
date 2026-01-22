const target = document.querySelector('.select > div');
if (target.classList.contains('rails')) {
    target.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        window.location.href = "./html/order.html?type=rails";
    });
} else if (target.classList.contains('ropes')) {
    target.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        window.location.href = "./html/order.html?type=ropes";
    });
}