// blog.js - Handle dynamic blog posts
document.addEventListener("DOMContentLoaded", function() {
    // Generate random date within the past two months
    function getRandomRecentDate() {
        const today = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(today.getMonth() - 2);
        
        const randomTimestamp = twoMonthsAgo.getTime() + Math.random() * (today.getTime() - twoMonthsAgo.getTime());
        const randomDate = new Date(randomTimestamp);
        
        return randomDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Sample blog posts
    const blogPosts = [
        {
            title: "10 Must-Read Books for 2025",
            excerpt: "Discover the books that are shaping conversations and imaginations this year...",
            content: "As we move further into 2025, the literary world continues to evolve with fresh voices and innovative storytelling. From breathtaking debuts to long-awaited returns from beloved authors, this year's must-read list spans genres and styles to cater to every reader's taste. Whether you're looking for thought-provoking literary fiction, edge-of-your-seat thrillers, or immersive fantasy worlds, our curated selection has something for everyone.",
            author: "Amrita Singh",
            category: "Recommendations",
            image: "blog1.jpg",
            date: getRandomRecentDate()
        },
        {
            title: "The Evolution of Digital Reading",
            excerpt: "How e-books and reading apps are changing our relationship with literature...",
            content: "The digital revolution has transformed nearly every aspect of our lives, and reading is no exception. With the rise of e-readers, tablets, and smartphone apps dedicated to reading, the way we consume books has fundamentally changed. This shift brings both conveniences and challenges as readers navigate between traditional paper books and their digital counterparts. In this article, we explore the latest advancements in digital reading technology and how they're shaping the future of literature.",
            author: "Vikram Desai",
            category: "Technology",
            image: "blog2.jpg",
            date: getRandomRecentDate()
        },
        {
            title: "Independent Bookstores Making a Comeback",
            excerpt: "Local bookshops are thriving again. Here's why...",
            content: "After years of struggling against online retailers and large chains, independent bookstores are experiencing a renaissance. Across India, local bookshops are finding innovative ways to attract customers and build communities around their shared love of reading. From hosting author events and book clubs to creating cozy reading spaces and curating personalized recommendations, these stores offer experiences that cannot be replicated online. This resurgence reflects a growing desire for authentic, community-based shopping experiences in our increasingly digital world.",
            author: "Neha Kapoor",
            category: "Book Industry",
            image: "blog3.jpg",
            date: getRandomRecentDate()
        },
        {
            title: "Reading for Mental Wellbeing",
            excerpt: "How books can help reduce stress and improve mental health...",
            content: "In our fast-paced, screen-dominated world, reading offers a valuable respite for our overstimulated minds. Recent research continues to highlight the mental health benefits of regular reading, from reduced stress and improved sleep to increased empathy and cognitive function. Bibliotherapy—the use of books as therapy—is gaining recognition among mental health professionals as an effective complementary approach to traditional treatments for anxiety and depression. This article explores the science behind reading's positive impact on our brains and provides recommendations for books that can particularly support mental wellbeing.",
            author: "Dr. Ravi Kumar",
            category: "Health",
            image: "blog4.jpg",
            date: getRandomRecentDate()
        }
    ];
    
    // Check if blog section exists
    const blogSection = document.getElementById('daily-posts');
    if (blogSection) {
        let htmlContent = `
            <h2 class="text-center mb-4">Our Daily Posts</h2>
            <div class="row">
        `;
        
        blogPosts.forEach(post => {
            htmlContent += `
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <img src="./img/${post.image}" class="card-img-top" alt="${post.title}" onerror="this.src='/api/placeholder/400/200'">
                        <div class="card-body">
                            <span class="badge bg-secondary mb-2">${post.category}</span>
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.excerpt}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">By ${post.author}</small>
                                <small class="text-muted">${post.date}</small>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-top-0">
                            <button class="btn btn-sm btn-outline-primary read-more" data-id="${blogPosts.indexOf(post)}">Read More</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        htmlContent += `
            </div>
            
            <!-- Blog Post Modal -->
            <div class="modal fade" id="blogModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="blogModalTitle"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="blogModalBody">
                        </div>
                        <div class="modal-footer">
                            <small class="text-muted me-auto" id="blogModalMeta"></small>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Share</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        blogSection.innerHTML = htmlContent;
        
        // Add event listeners to "Read More" buttons
        document.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', function() {
                const postId = this.getAttribute('data-id');
                const post = blogPosts[postId];
                
                document.getElementById('blogModalTitle').textContent = post.title;
                document.getElementById('blogModalBody').innerHTML = `
                    <img src="./img/${post.image}" class="img-fluid mb-3" alt="${post.title}" onerror="this.src='/api/placeholder/800/400'">
                    <p>${post.content}</p>
                `;
                document.getElementById('blogModalMeta').textContent = `By ${post.author} on ${post.date}`;
                
                const blogModal = new bootstrap.Modal(document.getElementById('blogModal'));
                blogModal.show();
            });
        });
    }
    
    // Check if reviews section exists
    const reviewsSection = document.getElementById('customer-reviews');
    if (reviewsSection) {
        const reviews = [
            {
                name: "Arjun Sharma",
                rating: 5,
                comment: "E-Bookopolis has transformed my reading experience! The interface is intuitive, and their collection of books is vast and well-curated. I especially love their recommendation engine - it's introduced me to several authors I now adore.",
                date: getRandomRecentDate()
            },
            {
                name: "Meera Patel",
                rating: 4,
                comment: "I've been using E-Bookopolis for about three months now, and I'm impressed by the selection and pricing. Their customer service is exceptional - they helped me quickly when I had trouble downloading a book. The only reason I'm not giving 5 stars is that the search feature could be a bit more refined.",
                date: getRandomRecentDate()
            },
            {
                name: "Rohit Kapoor",
                rating: 5,
                comment: "As an avid reader, I've tried many online bookstores, but E-Bookopolis stands out. The website is sleek and fast, the books are reasonably priced, and delivery is prompt. I especially appreciate the detailed book descriptions and preview options.",
                date: getRandomRecentDate()
            },
            {
                name: "Priya Verma",
                rating: 5,
                comment: "E-Bookopolis is a bibliophile's dream! Their collection spans every genre imaginable, and they frequently update with new releases. The monthly reading challenges have added a fun dimension to my reading habits. Highly recommended!",
                date: getRandomRecentDate()
            },
            {
                name: "Ankit Malhotra",
                rating: 4,
                comment: "The variety of formats available on E-Bookopolis is impressive - from e-books to audiobooks, they have it all. Their app is well-designed and syncs perfectly across my devices. My only suggestion would be to offer more regional language books.",
                date: getRandomRecentDate()
            }
        ];
        
        let reviewHTML = `
            <h2 class="text-center mb-4">What Our Customers Say</h2>
            <div class="reviews-slider swiper-container">
                <div class="swiper-wrapper">
        `;
        
        reviews.forEach(review => {
            const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
            
            reviewHTML += `
                <div class="swiper-slide">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <h5 class="card-title">${review.name}</h5>
                                <span class="text-warning">${stars}</span>
                            </div>
                            <p class="card-text">${review.comment}</p>
                            <p class="text-muted mt-3">${review.date}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        reviewHTML += `
                </div>
                <div class="swiper-pagination"></div>
            </div>
        `;
        
        reviewsSection.innerHTML = reviewHTML;
    }
});