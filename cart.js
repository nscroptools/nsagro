let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load cart items and update UI
document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.querySelector(".cart-items");
    const totalPriceContainer = document.querySelector("#total-price");

    updateCartDisplay();

    const checkoutBtn = document.querySelector("#checkout-btn");
    checkoutBtn.addEventListener("click", () => {
        const itemNames = cart.map(item => item.name).join(", ");
        window.location.href = `https://wa.me/+918374890396?text=I am interested in buying these items: ${itemNames}`;
    });
});

// Add item to cart
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent page scrolling to the top

        let name = this.dataset.productName;
        let price = parseInt(this.dataset.productPrice);
        let image = this.closest(".grid-item").querySelector("img").src;

        let existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    });
});

// Function to increase item quantity
function increaseItem(name) {
    let item = cart.find(item => item.name === name);
    if (item) {
        item.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Function to decrease item quantity
function decreaseItem(name) {
    let itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            // Remove the item if quantity is 1 and user tries to decrease further
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Update total price
function updateTotalPrice() {
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.querySelector("#total-price").textContent = totalPrice;
}

// Update cart display dynamically
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const totalPriceContainer = document.querySelector("#total-price");

    cartItemsContainer.innerHTML = ""; // Clear existing cart display

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
        totalPriceContainer.textContent = "0";
        return;
    }

    cart.forEach(item => {
        let cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <span>${item.name}</span>
                <span>₹${item.price}</span>
            </div>
            <div class="cart-item-actions">
                <button class="increase" data-name="${item.name}">+</button>
                <span>Quantity: ${item.quantity}</span>
                <button class="decrease" data-name="${item.name}">-</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    updateTotalPrice();

    // Attach event listeners for increase and decrease buttons
    document.querySelectorAll(".increase").forEach(button => {
        button.addEventListener("click", () => increaseItem(button.dataset.name));
    });
    document.querySelectorAll(".decrease").forEach(button => {
        button.addEventListener("click", () => decreaseItem(button.dataset.name));
    });
}
