function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart successfully!");
}

// Search Food Items

function searchFood() {

    let input = document.getElementById("searchInput")
        .value.toLowerCase();

    let cards = document.querySelectorAll(".food-card");

    cards.forEach(card => {

        let foodName = card.querySelector("h3")
            .textContent.toLowerCase();

        card.style.display = foodName.includes(input)
            ? "block"
            : "none";

    });
}


// Filter Food Categories

function filterFood(category) {

    let cards = document.querySelectorAll(".food-card");

    cards.forEach(card => {

        let foodCategory = card.dataset.category;

        card.style.display =
            category === "All" || foodCategory === category
                ? "block"
                : "none";

    });

    document.getElementById("searchInput").value = "";
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cartItems");
    let totalAmount = document.getElementById("totalAmount");

    if (!cartItems || !totalAmount) return;

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        totalAmount.textContent = "0";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
                <p>
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </p>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalAmount.textContent = total;
}

function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function placeOrder() {
    // Get cart items
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check whether cart is empty
    if (cart.length === 0) {
        alert("Your cart is empty! Please add food items first.");
        return;
    }

    // Calculate total bill
    let total = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    // Get existing orders
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Create new order
    let newOrder = {
        id: Date.now(),
        items: cart,
        total: total,
        status: "Order Placed",
        date: new Date().toLocaleString()
    };

    // Save new order
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem("cart");

    // Display confirmation
    alert("Your order has been placed successfully!\nTotal Amount: ₹" + total);

    // Redirect to My Orders page
    window.location.href = "orders.html";
}

function displayOrders() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let ordersList = document.getElementById("ordersList");

    if (!ordersList) return;

    if (orders.length === 0) {
        ordersList.innerHTML = "<p>No orders placed yet.</p>";
        return;
    }

    ordersList.innerHTML = "";

    orders.forEach((order, index) => {
        ordersList.innerHTML += `
            <div class="order-card">
                <h3>Order #${index + 1}</h3>
                <p>Total: ₹${order.total}</p>
                <p class="order-status">Status: ${order.status}</p>
                <p>Date: ${order.date}</p>
            </div>
        `;
    });
}

async function loadFoods() {
    try {
        const response = await fetch("http://localhost:8080/foods");

        const foods = await response.json();

        const container = document.getElementById("foodContainer");

        if (!container) return;

        container.innerHTML = "";

        foods.forEach(food => {
            container.innerHTML += `
                <div class="food-card" data-category="${food.category}">
                    <h3>${food.name}</h3>
                    <p>Category: ${food.category}</p>
                    <p>Price: ₹${food.price}</p>
                    <button onclick="addToCart('${food.name}', ${food.price})">
                        Add to Cart
                    </button>
                `;
        });

    } catch (error) {
        document.getElementById("foodContainer").innerHTML =
            "<p>Unable to load menu. Make sure the Java backend is running.</p>";

        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", displayCart);
document.addEventListener("DOMContentLoaded", displayOrders);
document.addEventListener("DOMContentLoaded", loadFoods);