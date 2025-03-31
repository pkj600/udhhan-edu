// document.addEventListener("DOMContentLoaded", function () {
//     // Core elements
//     const searchInput = document.getElementById("search-box");
//     const booksContainer = document.querySelector(".swiper-wrapper");
//     const searchForm = document.querySelector(".search-form");
//     const imageSearchButton = document.getElementById("image-search-btn");
//     const imageUpload = document.getElementById("image-upload");
//     const voiceSearchButton = document.createElement("div"); // Create voice search button

//     // Store original swiper content for restoration
//     const originalSwiperContent = booksContainer.innerHTML;

//     // Global variables
//     let allBooks = [];
//     let jsonBooksLoaded = false;
//     let htmlBooksLoaded = false;
//     let processing = false;
//     let voiceRecognition;

//     // Add voice search button to icons section
//     voiceSearchButton.id = "voice-search-btn";
//     voiceSearchButton.className = "fas fa-microphone";
//     voiceSearchButton.setAttribute("aria-label", "Voice Search");
//     document.querySelector(".icons").insertBefore(voiceSearchButton, document.querySelector("#search-btn").nextSibling);

//     /** Fetch Books from book_index.json */
//     function fetchJsonBooks() {
//         fetch("book_index.json")
//             .then(response => response.json())
//             .then(data => {
//                 const jsonBooks = data.map(book => ({
//                     id: book.id,
//                     title: book.title,
//                     img: book.img.book_cover_1,
//                     price: book.price,
//                     tags: book.tags,
//                     source: "json"
//                 }));
//                 allBooks = mergeUniqueBooks([...allBooks, ...jsonBooks]);
//                 jsonBooksLoaded = true;
//                 combineAndDisplay();
//             })
//             .catch(error => console.error("Error fetching book_index.json:", error));
//     }

//     /** Extract Books from HTML */
//     function fetchHtmlBooks() {
//         const htmlBookElements = document.querySelectorAll(".swiper-slide.box");
//         const htmlBooks = Array.from(htmlBookElements).map(element => ({
//             title: element.querySelector("h3")?.textContent || element.querySelector("h4")?.textContent || "",
//             img: element.querySelector("img")?.src || "",
//             price: element.querySelector(".price")?.innerHTML || "",
//             tags: element.dataset.tags?.split(" ") || [],
//             source: "html"
//         }));
//         allBooks = mergeUniqueBooks([...allBooks, ...htmlBooks]);
//         htmlBooksLoaded = true;
//         combineAndDisplay();
//     }

//     /** Ensure unique books by title */
//     function mergeUniqueBooks(books) {
//         return [...new Map(books.map(book => [book.title.toLowerCase(), book])).values()];
//     }

//     /** Wait for both JSON & HTML books before displaying */
//     function combineAndDisplay() {
//         if (jsonBooksLoaded && htmlBooksLoaded) {
//             // Books are loaded and ready for search
//             console.log(`Loaded ${allBooks.length} books for search`);
//         }
//     }

//     /** Fetch Book Cover from Google Books API */
//     async function fetchBookCover(bookTitle) {
//         try {
//             const googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookTitle)}&maxResults=1`);
//             const googleData = await googleResponse.json();

//             if (googleData.items && googleData.items[0].volumeInfo.imageLinks) {
//                 return googleData.items[0].volumeInfo.imageLinks.thumbnail;
//             }
//         } catch (error) {
//             console.warn("Google Books API error:", error);
//         }
//         return null; // Return null if no cover found or error occurs
//     }

//     /** Display Books with uniform formatting */
//     function displayBooks(books, isSearchResult = false) {
//         if (isSearchResult) {
//             // Create a container for search results
//             booksContainer.innerHTML = "";

//             const resultsContainer = document.createElement("div");
//             resultsContainer.className = "search-results-container";
//             resultsContainer.style.cssText = `
//                 padding: 1rem;
//                 background: #fff;
//                 border-radius: 10px;
//                 box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
//                 padding-bottom: 0.5rem;
//                 width: 100%;
//                 display: grid;
//                 grid-template-columns: repeat(auto-fill, minmax(180px, auto));
//                 gap: 15px;
//             `;

//             if (books.length === 0) {
//                 const noResults = document.createElement("div");
//                 noResults.className = "no-results";
//                 noResults.innerHTML = `
//                     <p style="text-align: center; font-size: 1.2rem; padding: 1.5rem; width: 100%;">No books found</p>
//                     <button id="clear-search" style="padding: 0 auto; display: block; padding: 0.4rem 1.5rem;" class="btn">Return to Home</button>
//                 `;
//                 resultsContainer.appendChild(noResults);
//                 booksContainer.appendChild(resultsContainer);

//                 document.getElementById("clear-search").addEventListener("click", resetToOriginal);
//                 return;
//             }

//             books.forEach(book => {
//                 const bookElement = document.createElement("div");
//                 bookElement.className = "search-result-item";
//                 bookElement.style.cssText = `
//                     display: flex;
//                     flex-direction: column;
//                     padding: 0.8rem;
//                     border-radius: 8px;
//                     box-shadow: 0 2px 4px rgba(0,0,0,0.08);
//                     height: 100%;
//                 `;

//                 // Create uniform image container
//                 const imageContainer = document.createElement("div");
//                 imageContainer.className = "image-container";
//                 imageContainer.style.cssText = `
//                     height: 150px; /* Increased book cover size */
//                     padding-bottom: 0.3rem;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     overflow: hidden;
//                     border-radius: 5px;
//                     background: #f9f9f9;
//                 `;

//                 const imageElement = document.createElement("img");
//                 imageElement.src = book.img || "placeholder_image.jpg";
//                 imageElement.alt = book.title;
//                 imageElement.className = "book-cover";
//                 imageElement.style.cssText = "height: 15remx; max-width: 95%; object-fit: contain; transition: transform 0.3s ease;";

//                 imageContainer.appendChild(imageElement);
//                 bookElement.appendChild(imageContainer);

//                 bookElement.addEventListener('mouseenter', () => imageElement.style.transform = 'scale(1.05)');
//                 bookElement.addEventListener('mouseleave', () => imageElement.style.transform = 'scale(1)');

//                 // If the book source is from json or google, fetch a better cover
//                 if (book.source === "json" || book.source === "google") {
//                     fetchBookCover(book.title).then(coverUrl => {
//                         if (coverUrl) imageElement.src = coverUrl;
//                     });
//                 }

//                 // Content container with consistent text formatting
//                 const contentContainer = document.createElement("div");
//                 contentContainer.className = "content";
//                 contentContainer.style.cssText = "flex-grow: 1; display: flex; flex-direction: column; justify-content: none; padding-bottom: 0.3rem;";

//                 // Title with ellipsis for long text
//                 const titleElement = document.createElement("h4");
//                 titleElement.textContent = book.title;
//                 titleElement.style.cssText = "font-size: 1.5rem; line-height: 1.1; padding-bottom: 0.1rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; text-align: center;";

//                 // Price information
//                 const priceContainer = document.createElement("div");
//                 priceContainer.style.paddingBottom = '0.1rem';
//                 priceContainer.style.textAlign = 'center';
//                 priceContainer.style.fontSize = '1.1rem';
//                 if (book.price === "0" || book.price === "Free") {
//                     priceContainer.innerHTML = `<div class="price">Free <span>₹. 199+</span></div>`;
//                 } else if (book.price) {
//                     priceContainer.innerHTML = `<div class="price">${book.price}</div>`;
//                 } else {
//                     priceContainer.innerHTML = `<div class="price">Unavailable</div>`;
//                 }

//                 // Stars rating
//                 const starsElement = document.createElement("div");
//                 starsElement.className = "stars";
//                 starsElement.style.paddingBottom = '0.2rem';
//                 starsElement.style.textAlign = 'center';
//                 starsElement.style.fontSize = '1.2rem';
//                 starsElement.innerHTML = `
//                     <i class="fas fa-star"></i>
//                     <i class="fas fa-star"></i>
//                     <i class="fas fa-star"></i>
//                     <i class="fas fa-star"></i>
//                     <i class="fas fa-star-half-alt"></i>
//                 `;

//                 // Add to cart button
//                 const addToCartButton = document.createElement("a");
//                 addToCartButton.href = "#populer";
//                 addToCartButton.className = "btn";
//                 addToCartButton.style.padding = "0.4rem 0.8rem";
//                 addToCartButton.style.fontSize = "1.4rem";
//                 addToCartButton.style.display = "block";
//                 addToCartButton.style.textAlign = "center";
//                 addToCartButton.style.paddingBottom = "0.2rem";
//                 addToCartButton.textContent = "Add To Cart";

//                 // Icons container
//                 const iconsContainer = document.createElement("div");
//                 iconsContainer.className = "icons";
//                 iconsContainer.style.display = "flex";
//                 iconsContainer.style.justifyContent = "space-evenly";
//                 iconsContainer.style.fontSize = '2rem';
//                 iconsContainer.innerHTML = `
//                     <a href="#new" class="fas fa-search"></a>
//                     <a href="#new" class="fas fa-heart-circle-plus"></a>
//                     <a href="#new" class="fas fa-info"></a>
//                 `;

//                 // Assemble the content
//                 contentContainer.appendChild(titleElement);
//                 contentContainer.appendChild(priceContainer);
//                 contentContainer.appendChild(starsElement);
//                 contentContainer.appendChild(addToCartButton);

//                 bookElement.appendChild(contentContainer);
//                 bookElement.appendChild(iconsContainer);

//                 resultsContainer.appendChild(bookElement);
//             });

//             // Add a clear button
//             const clearButton = document.createElement("div");
//             clearButton.className = "clear-search-container";
//             clearButton.style.cssText = "grid-column: 1 / -1; text-align: center; padding-top: 1rem;";
//             clearButton.innerHTML = `<button id="clear-search" class="btn">Clear Search Results</button>`;
//             resultsContainer.appendChild(clearButton);

//             booksContainer.appendChild(resultsContainer);

//             // Add event listener for the clear button
//             document.getElementById("clear-search").addEventListener("click", resetToOriginal);
//         } else {
//             // Just display books normally (used for initialization)
//             booksContainer.innerHTML = originalSwiperContent;
//         }
//     }

//     /** Reset to original swiper content */
//     function resetToOriginal() {
//         // Restore original swiper content
//         booksContainer.innerHTML = originalSwiperContent;
//         searchInput.value = "";
//     }

//     /** Reinitialize swiper after content change */
//     function reinitializeSwiper() {
//         // Create a new swiper instance with the original settings
//         new Swiper(".books-slider", {
//             loop: true,
//             centeredSlides: true,
//             autoplay: {
//                 delay: 2000,
//                 disableOnInteraction: false,
//             },
//             breakpoints: {
//                 0: {
//                     slidesPerView: 1,
//                 },
//                 768: {
//                     slidesPerView: 2,
//                 },
//                 1024: {
//                     slidesPerView: 3,
//                 },
//             },
//         });
//     }

//     /** Create and show a processing overlay with countdown */
//     function showProcessingOverlay(message, seconds = 5) {
//         processing = true;

//         // Create overlay container
//         const overlay = document.createElement("div");
//         overlay.className = "processing-overlay";
//         overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white;";

//         // Add spinner
//         overlay.innerHTML = `
//             <div class="spinner" style="border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;"></div>
//             <p class\="countdown" style\="padding\-top\: 10px; font\-size\: 1\.5rem;"\></span>{Loading}</p>
//         `;

//         // Add animation style
//         const style = document.createElement("style");
//         style.textContent = `
//             @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//             }
//         `;
//         document.head.appendChild(style);

//         // Add to document
//         document.body.appendChild(overlay);

//         // Start countdown
//         let count = seconds;
//         const countdownElement = overlay.querySelector(".countdown");

//         const countdownInterval = setInterval(() => {
//             count--;
//             countdownElement.textContent = count;

//             if (count <= 0) {
//                 clearInterval(countdownInterval);
//                 document.body.removeChild(overlay);
//                 processing = false;
//             }
//         }, 1000);

//         // Return a function to manually remove the overlay
//         return function () {
//             clearInterval(countdownInterval);
//             if (document.body.contains(overlay)) {
//                 document.body.removeChild(overlay);
//             }
//             processing = false;
//         };
//     }

//     /** Perform Book Search with improved accuracy using Google Books API */
//     async function performSearch(query, searchType = "text") {
//         if (processing) return;

//         query = query.toLowerCase().trim();
//         if (!query) {
//             resetToOriginal();
//             return;
//         }

//         // Show processing overlay for API search
//         const removeOverlay = showProcessingOverlay(`Searching for "${query}"...`);

//         try {
//             const googleResponse = await fetch(
//                 `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`
//             );
//             const googleData = await googleResponse.json();

//             const searchResults = [];
//             if (googleData.items) {
//                 for (const item of googleData.items) {
//                     const volumeInfo = item.volumeInfo;
//                     const saleInfo = item.saleInfo;

//                     searchResults.push({
//                         title: volumeInfo.title || "No title",
//                         img: volumeInfo.imageLinks?.thumbnail || "placeholder_image.jpg",
//                         price: saleInfo?.listPrice?.amount ? `₹. ${saleInfo.listPrice.amount}` : (saleInfo?.saleability === 'FOR_SALE' ? 'Price unavailable' : 'Not for sale'),
//                         source: "google",
//                         relevance: 10, // Higher relevance for API results
//                         authors: volumeInfo.authors || [],
//                         publisher: volumeInfo.publisher || "",
//                         publishedDate: volumeInfo.publishedDate || "",
//                         description: volumeInfo.description || ""
//                     });
//                 }
//             }

//             // Remove overlay once processing is complete
//             if (removeOverlay) removeOverlay();

//             // Display the Google Books API results
//             displayBooks(searchResults, true);

//         } catch (error) {
//             console.error("Google Books API Error:", error);
//             if (removeOverlay) removeOverlay();
//             booksContainer.innerHTML = `<div class="no-results"><p style="text-align: center; font-size: 1.2rem; padding: 1.5rem; width: 100%;">
//             Error fetching books. Please try again later.</p><button id="clear-search" style="padding: 0 auto; display: block; padding: 0.4rem 1.5rem;" class="btn">Return to Home</button></div>`;
//             document.getElementById("clear-search").addEventListener("click", resetToOriginal);
//         }
//     }

//     /** Image search with enhanced OCR processing using OCR.space */
//     async function processImageSearch(imageData) {
//         if (processing) return;

//         const removeOverlay = showProcessingOverlay("Processing image for text...", 5);
//         const apiKey = "K85464306888957";
//         const apiUrl = 'https://api.ocr.space/parse/image';

//         try {
//             const formData = new FormData();
//             formData.append('apikey', apiKey);
//             formData.append('base64Image', imageData.split(',')[1]);
//             formData.append('language', 'eng'); // Specify language for better accuracy

//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 body: formData,
//             });

//             const data = await response.json();

//             if (data && data.ParsedResults && data.ParsedResults.length > 0) {
//                 const extractedText = data.ParsedResults[0].ParsedText.trim();
//                 if (extractedText) {
//                     searchInput.value = extractedText;
//                     performSearch(extractedText, "image");
//                 } else {
//                     alert("Could not extract any readable text from the image.");
//                 }
//             } else {
//                 let errorMessage = "Could not process image.";
//                 if (data && data.ErrorMessage) {
//                     errorMessage += ` OCR.space error: ${data.ErrorMessage.join(", ")}`;
//                 }
//                 alert(errorMessage);
//             }

//         } catch (error) {
//             console.error("OCR.space API Error:", error);
//             alert("Error processing image. Please try again.");
//         } finally {
//             if (removeOverlay) removeOverlay();
//         }
//     }

//     /** Voice Search using Web Speech API with enhanced accuracy */
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         voiceRecognition = new SpeechRecognition();

//         // Configure for maximum accuracy
//         voiceRecognition.continuous = false;
//         voiceRecognition.interimResults = true;
//         voiceRecognition.maxAlternatives = 3;
//         voiceRecognition.lang = "en-US";

//         voiceRecognition.onresult = (event) => {
//             let finalTranscript = '';
//             let interimTranscript = '';

//             for (let i = event.resultIndex; i < event.results.length; ++i) {
//                 if (event.results[i].isFinal) {
//                     finalTranscript += event.results[i][0].transcript;
//                 } else {
//                     interimTranscript += event.results[i][0].transcript;
//                 }
//             }

//             searchInput.value = finalTranscript.replace(/\.$/, '').trim() || interimTranscript.trim();
//             performSearch(searchInput.value, "voice");
//         };

//         voiceRecognition.onerror = (event) => {
//             console.error("Voice Search Error:", event.error);
//             voiceSearchButton.classList.remove("active");
//             let errorMessage = 'Voice search error.';
//             if (event.error === 'no-speech') errorMessage = 'No speech detected. Please try again.';
//             else if (event.error === 'audio-capture') errorMessage = 'Could not capture audio. Check your microphone.';
//             alert(errorMessage);
//         };

//         voiceRecognition.onstart = () => {
//             voiceSearchButton.classList.add("active");
//             showProcessingOverlay("Listening...", 5);
//         };

//         voiceRecognition.onend = () => {
//             voiceSearchButton.classList.remove("active");
//             const overlay = document.querySelector('.processing-overlay');
//             if (overlay) {
//                 document.body.removeChild(overlay);
//                 processing = false;
//             }
//         };

//         voiceSearchButton.addEventListener("click", () => {
//             if (processing) return;
//             voiceRecognition.start();
//         });
//     } else {
//         console.warn("Speech recognition not supported in this browser.");
//         voiceSearchButton.style.display = "none"; // Hide button if unsupported
//     }

//     /** Setup event listeners */
//     searchInput.addEventListener("input", () => {
//         performSearch(searchInput.value);
//     });

//     // Handle form submission (for the search button - might be redundant now)
//     searchForm.addEventListener("submit", function (e) {
//         e.preventDefault();
//         performSearch(searchInput.value);
//     });

//     /** Image Search using OCR.space */
//     imageSearchButton.addEventListener("click", () => {
//         if (processing) return;
//         imageUpload.click();
//     });

//     imageUpload.addEventListener("change", function () {
//         if (this.files.length > 0) {
//             const file = this.files[0];
//             const reader = new FileReader();

//             reader.onload = function (event) {
//                 processImageSearch(event.target.result);
//             };

//             reader.readAsDataURL(file);
//         }
//     });

//     // Load initial books (can be adjusted based on your needs)
//     fetchJsonBooks();
//     fetchHtmlBooks();
// });

//rev 9

document.addEventListener("DOMContentLoaded", function () {
    // Core elements
    const searchInput = document.getElementById("search-box");
    const booksContainer = document.querySelector(".swiper-wrapper");
    const searchForm = document.querySelector(".search-form");
    const imageSearchButton = document.getElementById("image-search-btn");
    const imageUpload = document.getElementById("image-upload");
    const voiceSearchButton = document.createElement("div"); // Create voice search button

    // Store original swiper content for restoration
    const originalSwiperContent = booksContainer.innerHTML;

    // Global variables
    let allBooks = [];
    let jsonBooksLoaded = false;
    let htmlBooksLoaded = false;
    let processing = false;
    let voiceRecognition;

    // Add voice search button to icons section
    voiceSearchButton.id = "voice-search-btn";
    // voiceSearchButton.className = "fas fa-microphone";
    const micIcon = document.createElement("img");
    micIcon.src = "./img/mic.svg";
    micIcon.alt = "Microphone Icon";
    micIcon.className = "fas";
    micIcon.style.cssText= 'width: 28px; height: 26px;';
    voiceSearchButton.appendChild(micIcon);
    voiceSearchButton.setAttribute("aria-label", "Voice Search");
    document.querySelector(".icons").insertBefore(voiceSearchButton, document.querySelector("#search-btn").nextSibling);

    /** Fetch Books from book_index.json */
    function fetchJsonBooks() {
        fetch("book_index.json")
            .then(response => response.json())
            .then(data => {
                const jsonBooks = data.map(book => ({
                    id: book.id,
                    title: book.title,
                    img: book.img.book_cover_1,
                    price: book.price,
                    tags: book.tags,
                    source: "json",
                    authors: book.authors || [] // Include authors from JSON data
                }));
                allBooks = mergeUniqueBooks([...allBooks, ...jsonBooks]);
                jsonBooksLoaded = true;
                combineAndDisplay();
            })
            .catch(error => console.error("Error fetching book_index.json:", error));
    }

    /** Extract Books from HTML */
    function fetchHtmlBooks() {
        const htmlBookElements = document.querySelectorAll(".swiper-slide.box");
        const htmlBooks = Array.from(htmlBookElements).map(element => ({
            title: element.querySelector("h3")?.textContent || element.querySelector("h4")?.textContent || "",
            img: element.querySelector("img")?.src || "",
            price: element.querySelector(".price")?.innerHTML || "",
            tags: element.dataset.tags?.split(" ") || [],
            source: "html",
            authors: element.dataset.authors?.split(",") || [] // Include authors from HTML data
        }));
        allBooks = mergeUniqueBooks([...allBooks, ...htmlBooks]);
        htmlBooksLoaded = true;
        combineAndDisplay();
    }

    /** Ensure unique books by title */
    function mergeUniqueBooks(books) {
        return [...new Map(books.map(book => [book.title.toLowerCase(), book])).values()];
    }

    /** Wait for both JSON & HTML books before displaying */
    function combineAndDisplay() {
        if (jsonBooksLoaded && htmlBooksLoaded) {
            // Books are loaded and ready for search
            console.log(`Loaded ${allBooks.length} books for search`);
        }
    }

    /** Fetch Book Cover from Google Books API */
    async function fetchBookCover(bookTitle) {
        try {
            const googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookTitle)}&maxResults=1`);
            const googleData = await googleResponse.json();

            if (googleData.items && googleData.items[0].volumeInfo.imageLinks) {
                return googleData.items[0].volumeInfo.imageLinks.thumbnail.replace('http:', 'https:'); // Ensure HTTPS
            }
        } catch (error) {
            console.warn("Google Books API error:", error);
        }
        return null; // Return null if no cover found or error occurs
    }

    /** Display Books with uniform formatting */
    function displayBooks(books, isSearchResult = false) {
        if (isSearchResult) {
            // Create a container for search results
            booksContainer.innerHTML = "";

            const resultsContainer = document.createElement("div");
            resultsContainer.className = "search-results-container";
            resultsContainer.style.cssText = `
                padding: 1rem;
                background: #fff;
                border-radius: 10px;
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
                padding-bottom: 0.5rem;
                width: 100%;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, auto));
                gap: 15px;
            `;

            if (books.length === 0) {
                const noResults = document.createElement("div");
                noResults.className = "no-results";
                noResults.innerHTML = `
                    <p style="text-align: center; font-size: 1.2rem; padding: 1.5rem; width: 100%;">No books found</p>
                    <button id="clear-search" style="padding: 0 auto; display: block; padding: 0.4rem 1.5rem;" class="btn">Return to Home</button>
                `;
                resultsContainer.appendChild(noResults);
                booksContainer.appendChild(resultsContainer);

                document.getElementById("clear-search").addEventListener("click", resetToOriginal);
                return;
            }

            books.forEach(book => {
                const bookElement = document.createElement("div");
                bookElement.className = "search-result-item";
                bookElement.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    padding: 0.7rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
                    height: 100%;
                `;

                // Create uniform image container
                const imageContainer = document.createElement("div");
                imageContainer.className = "image-container";
                imageContainer.style.cssText = `
                    height: 220px; /* Increased book cover size */
                    padding: 1.7rem;
                    position: relative;
                    overflow: hidden;
                    border-radius: 5px;
                    background: rgba(255, 255, 255, 0.2); /* Glass background */
                    backdrop-filter: blur(10px); /* Blur effect */
                `;

                const imageElement = document.createElement("img");
                imageElement.src = book.img || "placeholder_image.png";
                imageElement.alt = book.title;
                imageElement.className = "book-cover";
                imageElement.style.cssText = "height: 200px; width: 13rem; padding-bottom: 0.4rem; transition: transform 0.3s ease; filter:saturate(1.26); filter: contrast(1.21); filter: brightness(1.07);";

                imageContainer.appendChild(imageElement);
                bookElement.appendChild(imageContainer);

                bookElement.addEventListener('mouseenter', () => imageElement.style.transform = 'scale(1.05)');
                bookElement.addEventListener('mouseleave', () => imageElement.style.transform = 'scale(1)');

                // If the book source is from json or google, fetch a better cover
                if (book.source === "json" || book.source === "google") {
                    fetchBookCover(book.title).then(coverUrl => {
                        if (coverUrl) imageElement.src = coverUrl;
                    });
                }

                // Content container with consistent text formatting
                const contentContainer = document.createElement("div");
                contentContainer.className = "content";
                contentContainer.style.cssText = "flex-grow: 1; display: flex; flex-direction: column; justify-content: none; padding-bottom: 0.2rem;";

                // Title with ellipsis for long text
                const titleElement = document.createElement("h4");
                titleElement.textContent = book.title;
                titleElement.style.cssText = "padding-top: 0.4rem; font-size: 1.45rem; line-height: 1; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; text-align: center;";

                // Author name
                const authorElement = document.createElement("p");
                authorElement.textContent = book.authors.join(", ") || "Author Unknown";
                authorElement.style.cssText = "font-size: 1.35rem; color: #555; line-height: 0.8; padding-bottom: 0.5rem; text-align: center;";

                // Price information
                const priceContainer = document.createElement("div");
                priceContainer.style.paddingBottom = '0.1rem';
                priceContainer.style.paddingTop = '-0.2rem';
                priceContainer.style.textAlign = 'center';
                priceContainer.style.fontSize = '1.2rem';
                if (book.price === "0" || book.price === "Free") {
                    priceContainer.innerHTML = `<div class="price">Free <span>₹. 199+</span></div>`;
                } else if (book.price) {
                    priceContainer.innerHTML = `<div class="price">${book.price}</div>`;
                } else {
                    priceContainer.innerHTML = `<div class="price">Unavailable</div>`;
                }

                // Stars rating
                const starsElement = document.createElement("div");
                starsElement.className = "stars";
                starsElement.style.paddingBottom = '0.1rem';
                starsElement.style.textAlign = 'center';
                starsElement.style.fontSize = '1.1rem';
                starsElement.innerHTML = `
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                `;

                // Add to cart button
                const addToCartButton = document.createElement("a");
                addToCartButton.href = "#populer";
                addToCartButton.className = "btn";
                addToCartButton.style.padding = "0.6rem 0.91rem";
                addToCartButton.style.fontSize = "1.4rem";
                addToCartButton.style.display = "block";
                addToCartButton.style.textAlign = "center";
                addToCartButton.style.paddingBottom = "0.2rem";
                addToCartButton.textContent = "Add To Cart";

                // Icons container
                const iconsContainer = document.createElement("div");
                iconsContainer.className = "icons";
                iconsContainer.style.filter= "grayscale()";
                iconsContainer.style.marginTop= '-29rem';
                iconsContainer.style.marginBottom= '0.4rem';
                iconsContainer.style.display = "flex";
                iconsContainer.style.justifyContent = "space-evenly";
                iconsContainer.style.fontSize = '1.8rem';
                iconsContainer.style.padding='0.2rem';
                iconsContainer.innerHTML = `
                    <a href="#new" class="fas fa-search"></a>
                    <a href="#new" class="fas fa-heart-circle-plus"></a>
                    <a href="#new" class="fas fa-info"></a>
                `;

                // Assemble the content
                contentContainer.appendChild(titleElement);
                contentContainer.appendChild(authorElement);
                contentContainer.appendChild(priceContainer);
                contentContainer.appendChild(starsElement);
                contentContainer.appendChild(addToCartButton);

                bookElement.appendChild(contentContainer);
                bookElement.appendChild(iconsContainer);

                resultsContainer.appendChild(bookElement);
            });

            // Add a clear button
            const clearButton = document.createElement("div");
            clearButton.className = "clear-search-container";
            clearButton.style.cssText = "grid-column: 1 / -1; text-align: center; padding-top: 0.4rem;";
            clearButton.innerHTML = `<button id="clear-search" class="btn">Clear Search Results</button>`;
            resultsContainer.appendChild(clearButton);

            booksContainer.appendChild(resultsContainer);

            // Add event listener for the clear button
            document.getElementById("clear-search").addEventListener("click", resetToOriginal);
        } else {
            // Just display books normally (used for initialization)
            booksContainer.innerHTML = originalSwiperContent;
        }
    }

    /** Reset to original swiper content */
    function resetToOriginal() {
        // Restore original swiper content
        booksContainer.innerHTML = originalSwiperContent;
        searchInput.value = "";
        reinitializeSwiper(); // Reinitialize swiper after reset
    }

    /** Reinitialize swiper after content change */
    function reinitializeSwiper() {
        // Create a new swiper instance with the original settings
        new Swiper(".books-slider", {
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }

    /** Create and show a processing overlay with countdown */
    function showProcessingOverlay(message, seconds = 5) {
        processing = true;

        // Create overlay container
        const overlay = document.createElement("div");
        overlay.className = "processing-overlay";
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white;";

        // Add spinner
        overlay.innerHTML = `
            <div class="spinner" style="border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;"></div>
            <p class="countdown" style="padding-top: 10px; font-size: 1.5rem;">${message}</span></p>
        `;

        // Add animation style
        const style = document.createElement("style");
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Add to document
        document.body.appendChild(overlay);

        // Start countdown
        let count = seconds;
        const countdownElement = overlay.querySelector(".countdown");

        const countdownInterval = setInterval(() => {
            count--;
            countdownElement.textContent = `${message} (${count})...`;

            if (count <= 0) {
                clearInterval(countdownInterval);
                document.body.removeChild(overlay);
                processing = false;
            }
        }, 1000);

        // Return a function to manually remove the overlay
        return function () {
            clearInterval(countdownInterval);
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            processing = false;
        };
    }
    // Debounce function to handle text search delay
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // Debounced version of search function
    const debouncedSearch = debounce(function(query, searchType) {
        performSearch(query, searchType);
    }, 450); // 450ms delay as requested
    

    /** Perform Book Search with improved accuracy using Google Books API */
    async function performSearch(query, searchType = "text") {
        if (processing) return;

        query = query.toLowerCase().trim();
        if (!query) {
            resetToOriginal();
            return;
        }

        // Show processing overlay for API search
        const removeOverlay = showProcessingOverlay(`Searching for "${query}"...`);

        try {
            const googleResponse = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`
            );
            const googleData = await googleResponse.json();

            const searchResults = [];
            if (googleData.items) {
                for (const item of googleData.items) {
                    const volumeInfo = item.volumeInfo;
                    const saleInfo = item.saleInfo;

                     // Truncate title to 24 characters
                const truncatedTitle = volumeInfo.title ? 
                (volumeInfo.title.length > 24 ? volumeInfo.title.substring(0, 24) + '...' : volumeInfo.title) : 
                "No title";
            
            // Truncate authors to 25 characters
            let truncatedAuthors = [];
            if (volumeInfo.authors && volumeInfo.authors.length > 0) {
                const authorString = volumeInfo.authors.join(", ");
                truncatedAuthors = [authorString.length > 25 ? authorString.substring(0, 25) + '...' : authorString];
            } else {
                truncatedAuthors = ["Author Unknown"];
            }
            
            searchResults.push({
                title: truncatedTitle,
                img: volumeInfo.imageLinks?.thumbnail ? volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : "placeholder_image.jpg",
                price: saleInfo?.listPrice?.amount ? `₹. ${saleInfo.listPrice.amount}` : (saleInfo?.saleability === 'FOR_SALE' ? 'Price unavailable' : 'Not for sale'),
                source: "google",
                relevance: 14, // Higher relevance for API results
                authors: truncatedAuthors,
                publisher: volumeInfo.publisher || "",
                publishedDate: volumeInfo.publishedDate || "",
                description: volumeInfo.description || ""
            });
                }
            }

            // Remove overlay once processing is complete
            if (removeOverlay) removeOverlay();

            // Display the Google Books API results
            displayBooks(searchResults, true);

        } catch (error) {
            console.error("Google Books API Error:", error);
            if (removeOverlay) removeOverlay();
            booksContainer.innerHTML = `<div class="no-results"><p style="text-align: center; font-size: 1.2rem; padding: 1.5rem; width: 100%;">
                Error fetching books. Please try again later.</p><button id="clear-search" style="padding: 0 auto; display: block; padding: 0.3rem 1.2rem;" class="btn">Return to Home</button></div>`;
            document.getElementById("clear-search").addEventListener("click", resetToOriginal);
        }
    }

    /** Image search with enhanced OCR processing using OCR.space */
    // async function processImageSearch(imageData) {
    //     if (processing) return;

    //     const removeOverlay = showProcessingOverlay("Processing image for text...", 5);
    //     const apiKey = "K85464306888957";
    //     const apiUrl = 'https://api.ocr.space/parse/image';

    //     try {
    //         const formData = new FormData();
    //         formData.append('apikey', apiKey);
    //         formData.append('base64Image', imageData.split(',')[1]);
    //         formData.append('language', 'eng'); // Specify language for better accuracy

    //         // Add OCR.space parameters
    //         formData.append('detectOrientation', 'true');
    //         formData.append('scale', 'true');
    //         formData.append('OCREngine', '1');

    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             body: formData,
    //         });

    //         const data = await response.json();

    //         if (data && data.ParsedResults && data.ParsedResults.length > 0) {
    //             const extractedText = data.ParsedResults[0].ParsedText.trim();
    //             if (extractedText) {
    //                 searchInput.value = extractedText;
    //                 performSearch(extractedText, "image");
    //             } else {
    //                 alert("Could not extract any readable text from the image.");
    //             }
    //         } else {
    //             let errorMessage = "Could not process image.";
    //             if (data && data.ErrorMessage) {
    //                 errorMessage += ` OCR.space error: ${data.ErrorMessage.join(", ")}`;
    //             }
    //             alert(errorMessage);
    //         }

    //     } catch (error) {
    //         console.error("OCR.space API Error:", error);
    //         alert("Error processing image. Please try again.");
    //     } finally {
    //         if (removeOverlay) removeOverlay();
    //     }
    // }

    async function processImageSearch(imageData, fileExtension) {
        if (processing) return;
    
        const removeOverlay = showProcessingOverlay("Processing image for text...", 5);
        const apiKey = "K85464306888957";
        const apiUrl = 'https://api.ocr.space/parse/image';
    
        try {
            const formData = new FormData();
            formData.append('apikey', apiKey);
    
            // Ensure the base64 string includes the proper content type
            formData.append('base64Image', `data:image/${fileExtension};base64,${imageData.split(',')[1]}`);
            formData.append('language', 'eng'); // Specify language for better accuracy
    
            // Add OCR.space parameters
            formData.append('detectOrientation', 'true'); // Detect orientation and auto-rotate
            formData.append('scale', 'true'); // Auto-enlarge for low DPI
            formData.append('OCREngine', '1'); // Use OCR Engine1 (default)
    
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
    
            if (data && data.ParsedResults && data.ParsedResults.length > 0) {
                const extractedText = data.ParsedResults[0].ParsedText.trim();
                if (extractedText) {
                    searchInput.value = extractedText;
                    // Automatically initiate the search without requiring enter key
                    performSearch(extractedText);
                } else {
                    alert("Could not extract any readable text from the image.");
                }
            } else {
                let errorMessage = "Could not process image.";
                if (data && data.ErrorMessage) {
                    errorMessage += ` OCR.space error: ${data.ErrorMessage.join(", ")}`;
                }
                alert(errorMessage);
            }
    
        } catch (error) {
            console.error("OCR.space API Error:", error);
            alert("Error processing image. Please try again.");
        } finally {
            if (removeOverlay) removeOverlay();
        }
    }
    function showToast(message, duration = 3000) {
        // Remove any existing toasts
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }
    
    /** Voice Search using Web Speech API with enhanced accuracy */
    // Request microphone permission on page load

    let voiceRecognitionActive = false;

// Handle voice search button click
voiceSearchButton.addEventListener("click", () => {
    if (processing) return;
    
    // Toggle voice recognition state
    if (voiceRecognitionActive) {
        stopVoiceRecognition();
    } else {
        startVoiceRecognition();
    }
});

// Start voice recognition with fallbacks
function startVoiceRecognition() {
    // Show visual indicator immediately
    voiceSearchButton.classList.add("active");
    const removeOverlay = showProcessingOverlay("Listening...", 10);
    voiceRecognitionActive = true;
    
    // Try browser's native speech recognition first
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 3;
            recognition.lang = "en-US";
            
            recognition.onstart = () => {
                console.log("Voice recognition started");
            };
            
            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                const transcript = finalTranscript.replace(/\.$/, '').trim() || interimTranscript.trim();
                if (transcript) {
                    searchInput.value = transcript;
                    performSearch(transcript, "voice");
                }
            };
            
            recognition.onerror = (event) => {
                console.warn("Voice recognition error:", event.error);
                // Fall back to alternative method on error
                fallbackVoiceRecognition();
            };
            
            recognition.onend = () => {
                stopVoiceRecognition();
            };
            
            // Start recognition without checking permissions explicitly
            recognition.start();
            
        } catch (error) {
            console.warn("Error starting voice recognition:", error);
            // Fall back to alternative method
            fallbackVoiceRecognition();
        }
    } else {
        // Browser doesn't support native speech recognition
        fallbackVoiceRecognition();
    }
}

// Alternative voice recognition using a cloud API
function fallbackVoiceRecognition() {
    // Use a visual indicator to collect voice input without actually using microphone
    const overlay = document.createElement('div');
    overlay.className = 'voice-input-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 90%;
        width: 400px;
        text-align: center;
    `;
    
    content.innerHTML = `
        <h3 style="margin-top: 0; font-size: 1.5rem;">Voice Search</h3>
        <p>Type what you want to search for:</p>
        <input type="text" id="voice-fallback-input" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
        <div style="display: flex; justify-content: space-between;">
            <button id="voice-fallback-cancel" style="padding: 10px 15px; border: none; background: #eee; border-radius: 5px; cursor: pointer;">Cancel</button>
            <button id="voice-fallback-search" style="padding: 10px 15px; border: none; background: #4CAF50; color: white; border-radius: 5px; cursor: pointer;">Search</button>
        </div>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // Focus the input
    setTimeout(() => {
        document.getElementById('voice-fallback-input').focus();
    }, 100);
    
    // Handle cancel
    document.getElementById('voice-fallback-cancel').addEventListener('click', () => {
        document.body.removeChild(overlay);
        stopVoiceRecognition();
    });
    
    // Handle search
    document.getElementById('voice-fallback-search').addEventListener('click', () => {
        const input = document.getElementById('voice-fallback-input').value.trim();
        if (input) {
            searchInput.value = input;
            performSearch(input, "voice");
        }
        document.body.removeChild(overlay);
        stopVoiceRecognition();
    });
    
    // Handle enter key
    document.getElementById('voice-fallback-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const input = e.target.value.trim();
            if (input) {
                searchInput.value = input;
                performSearch(input, "voice");
            }
            document.body.removeChild(overlay);
            stopVoiceRecognition();
        }
    });
}

// Stop voice recognition
function stopVoiceRecognition() {
    voiceSearchButton.classList.remove("active");
    voiceRecognitionActive = false;
    
    // Remove any overlays
    const overlay = document.querySelector('.processing-overlay');
    if (overlay) {
        document.body.removeChild(overlay);
        processing = false;
    }
}


    /** Setup event listeners */
    searchInput.addEventListener("input", () => {
        debouncedSearch(searchInput.value);
    });

    // Handle form submission (for the search button - might be redundant now)
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        performSearch(searchInput.value);
    });

    /** Image Search using OCR.space */
    imageSearchButton.addEventListener("click", () => {
        if (processing) return;
        imageUpload.click();
    });

    // imageUpload.addEventListener("change", function () {
    //     if (this.files.length > 0) {
    //         const file = this.files[0];
    //         const reader = new FileReader();

    //         reader.onload = function (event) {
    //             processImageSearch(event.target.result);
    //         };

    //         reader.readAsDataURL(file);
    //     }
    // });
    // Add event listener for image upload
imageUpload.addEventListener("change", function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
            const reader = new FileReader();
            reader.onload = function(e) {
                processImageSearch(e.target.result, fileExtension);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload an image file (JPG, PNG, GIF, BMP)");
        }
    }
});

    // Load initial books (can be adjusted based on your needs)
    fetchJsonBooks();
    fetchHtmlBooks();
    reinitializeSwiper(); // Initialize swiper on page load
});