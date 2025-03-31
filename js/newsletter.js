// newsletter.js - Handle newsletter subscriptions
document.addEventListener("DOMContentLoaded", function() {
    // Initialize newsletter subscribers if not exists
    if (!localStorage.getItem("newsletter")) {
        localStorage.setItem("newsletter", JSON.stringify([]));
    }
    
    // Check if newsletter form exists
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email').value;
            if (!email) {
                alert("Please enter your email");
                return;
            }
            
            const subscribers = JSON.parse(localStorage.getItem("newsletter"));
            
            // Check if already subscribed
            if (subscribers.includes(email)) {
                alert("You're already subscribed!");
                return;
            }
            
            // Add new subscriber
            subscribers.push(email);
            localStorage.setItem("newsletter", JSON.stringify(subscribers));
            
            alert("Thank you for subscribing to our newsletter!");
            document.getElementById('newsletter-email').value = '';
        });
    }
    
    // Auto-populate newsletter section if it exists
    const newArrivalsSection = document.getElementById('new-arrivals');
    if (newArrivalsSection) {
        // Sample new arrivals (in a real scenario, this would come from a database)
        const newBooks = [
            { title: "The Silent Echo", author: "Priya Sharma", date: "March 1, 2025", cover: "book1.jpg" },
            { title: "Beyond the Horizon", author: "Rajiv Patel", date: "March 4, 2025", cover: "book2.jpg" },
            { title: "Whispers in the Wind", author: "Ananya Mehta", date: "February 28, 2025", cover: "book3.jpg" }
        ];
        
        let htmlContent = `
            <h3>New Arrivals</h3>
            <div class="row">
        `;
        
        newBooks.forEach(book => {
            htmlContent += `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <img src="./img/${book.cover}" class="card-img-top" alt="${book.title}">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">By ${book.author}</p>
                            <p class="text-muted">Added on ${book.date}</p>
                            <button class="btn btn-sm btn-primary">View Details</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        htmlContent += `
            </div>
            <div class="newsletter-container mt-4 p-4 bg-light rounded">
                <h4>Stay Updated with New Releases</h4>
                <p>Subscribe to our newsletter to get notified about new books!</p>
                <form id="newsletter-form" class="d-flex">
                    <input type="email" id="newsletter-email" class="form-control me-2" placeholder="Your email address" required>
                    <button type="submit" class="btn btn-primary">Subscribe</button>
                </form>
            </div>
        `;
        
        newArrivalsSection.innerHTML = htmlContent;
    }
});