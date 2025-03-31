document.addEventListener("DOMContentLoaded", function () {
    const booksContainer = document.querySelector(".swiper-wrapper"); // Only on index.html
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const favoritesItems = document.getElementById("favorites-items");
    const cartContainer = document.getElementById("cart-container");
    const favoritesContainer = document.getElementById("favorites-container");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    function updateCartDisplay() {
        if (!cartItems) return; // Exit if cartItems doesn't exist (cart.html)
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.title} - ${item.price} <button class="remove-from-cart" data-id="${item.id}">Remove</button>`;
            cartItems.appendChild(li);
            total += parseFloat(item.price.replace("₹", "").replace("+", "").trim());
        });

        cartTotal.textContent = `₹${total}`;
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateFavoritesDisplay() {
        if (!favoritesItems) return; // Exit if favoritesItems doesn't exist
        favoritesItems.innerHTML = "";
        favorites.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.title} <button class="remove-from-favorites" data-id="${item.id}">Remove</button>`;
            favoritesItems.appendChild(li);
        });
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    function addToCart(book) {
        cart.push(book);
        updateCartDisplay();
    }

    function removeFromCart(bookId) {
        cart = cart.filter(item => item.id !== bookId);
        updateCartDisplay();
    }

    function addToFavorites(book) {
        favorites.push(book);
        updateFavoritesDisplay();
    }

    function removeFromFavorites(bookId) {
        favorites = favorites.filter(item => item.id !== bookId);
        updateFavoritesDisplay();
    }

    // Only on index.html
    if (booksContainer) {
        booksContainer.addEventListener("click", function (event) {
            const target = event.target;
            const bookElement = target.closest(".box");

            if (bookElement) {
                const book = {
                    id: bookElement.dataset.id,
                    title: bookElement.dataset.title,
                    img: bookElement.dataset.img,
                    price: bookElement.dataset.price
                };

                if (target.classList.contains("btn") && target.textContent === "Add To Cart") {
                    addToCart(book);
                    cartContainer.style.display = "block";
                }

                if (target.classList.contains("fas") && target.classList.contains("fa-heart-circle-plus")) {
                    addToFavorites(book);
                    favoritesContainer.style.display = "block";
                }
            }
        });
    }

    if (cartItems) { // Only on cart.html
        cartItems.addEventListener("click", function (event) {
            const target = event.target;
            if (target.classList.contains("remove-from-cart")) {
                removeFromCart(target.dataset.id);
            }
        });
    }

    if (favoritesItems) { // Only on cart.html
        favoritesItems.addEventListener("click", function (event) {
            const target = event.target;
            if (target.classList.contains("remove-from-favorites")) {
                removeFromFavorites(target.dataset.id);
            }
        });
    }

    updateCartDisplay();
    updateFavoritesDisplay();
});