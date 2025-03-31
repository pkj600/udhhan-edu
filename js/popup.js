document.addEventListener("DOMContentLoaded", function () {
    let books = [];

    // Fetch book data from book_index.json
    fetch("./book_index.json")
        .then(response => response.json())
        .then(data => {
            books = data;
            initializeBookPopups();
        })
        .catch(error => console.error("Error loading book index:", error));

    function initializeBookPopups() {
        const bookElements = document.querySelectorAll(".swiper-slide.box");

        bookElements.forEach(bookElement => {
            bookElement.addEventListener("click", function () {
                const titleElement = bookElement.querySelector(".content h3");
                const book = books.find(b => b.title.toLowerCase() === titleElement.innerText.toLowerCase());

                if (book) {
                    showPopup(book);
                }
            });
        });
    }

    function showPopup(book) {
        const popupContainer = document.getElementById("popup-container");
        popupContainer.innerHTML = `
            <div class="popup-content">
                <span class="close-popup">&times;</span>
                <img src="${book.img.book_cover_1}" alt="${book.title}" class="popup-book-cover">
                <h2>${book.title}</h2>
                <p><strong>Price:</strong> ${book.price}</p>
                <p><strong>Tags:</strong> ${book.tags.join(", ")}</p>
            </div>
        `;

        popupContainer.style.display = "flex";

        // Close popup on click
        document.querySelector(".close-popup").addEventListener("click", function () {
            popupContainer.style.display = "none";
        });

        // Close popup if clicked outside content
        popupContainer.addEventListener("click", function (e) {
            if (e.target === popupContainer) {
                popupContainer.style.display = "none";
            }
        });
    }
});
