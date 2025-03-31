// payment.js - Handle RazorPay payment integration using localStorage
document.addEventListener("DOMContentLoaded", function() {
    // Initialize orders database if not exists
    if (!localStorage.getItem("orders")) {
        localStorage.setItem("orders", JSON.stringify([]));
    }
    
    // Check if checkout button exists
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (!isLoggedIn()) {
                alert("Please login to checkout");
                window.location.href = "login.html";
                return;
            }
            
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
                alert("Your cart is empty");
                return;
            }
            
            // Calculate total (in a real app, you'd have prices)
            // Here we're just using a dummy calculation
            const total = cart.length * 499; // ₹499 per book
            
            // Create a RazorPay order (simulated)
            const orderID = "ORD" + Math.floor(Math.random() * 1000000);
            
            // RazorPay integration (this would normally connect to RazorPay's API)
            const options = {
                key: "rzp_test_YOUR_KEY_HERE", // This would be your actual RazorPay key
                amount: total * 100, // Amount in paisa
                currency: "INR",
                name: "E-Bookopolis",
                description: "Book Purchase",
                order_id: orderID,
                handler: function(response) {
                    // Capture payment success
                    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                    const users = JSON.parse(localStorage.getItem("users"));
                    const orders = JSON.parse(localStorage.getItem("orders"));
                    
                    // Create new order
                    const newOrder = {
                        id: orderID,
                        user: currentUser.username,
                        items: cart,
                        total: total,
                        payment_id: response.razorpay_payment_id,
                        date: new Date().toISOString(),
                        status: "completed"
                    };
                    
                    orders.push(newOrder);
                    localStorage.setItem("orders", JSON.stringify(orders));
                    
                    // Update user's purchases
                    const userIndex = users.findIndex(u => u.username === currentUser.username);
                    if (userIndex !== -1) {
                        users[userIndex].purchases.push(orderID);
                        users[userIndex].cart = []; // Empty cart after purchase
                        localStorage.setItem("users", JSON.stringify(users));
                    }
                    
                    // Clear cart
                    localStorage.setItem("cart", JSON.stringify([]));
                    
                    alert("Payment successful! Order ID: " + orderID);
                    window.location.href = "order-confirmation.html?id=" + orderID;
                },
                prefill: {
                    name: currentUser ? currentUser.username : "",
                    email: currentUser ? currentUser.email : ""
                },
                theme: {
                    color: "#385b64"
                }
            };
            
            // In a real implementation, you would create a Razorpay instance
            // const rzp = new Razorpay(options);
            // rzp.open();
            
            // For this demo, we'll just simulate a successful payment
            if (confirm(`Proceed to pay ₹${total} for ${cart.length} books?`)) {
                // Simulate successful payment
                const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                const users = JSON.parse(localStorage.getItem("users"));
                const orders = JSON.parse(localStorage.getItem("orders"));
                
                // Create new order
                const newOrder = {
                    id: orderID,
                    user: currentUser.username,
                    items: cart,
                    total: total,
                    payment_id: "pay_" + Math.random().toString(36).substr(2, 9),
                    date: new Date().toISOString(),
                    status: "completed"
                };
                
                orders.push(newOrder);
                localStorage.setItem("orders", JSON.stringify(orders));
                
                // Update user's purchases
                const userIndex = users.findIndex(u => u.username === currentUser.username);
                if (userIndex !== -1) {
                    users[userIndex].purchases.push(orderID);
                    users[userIndex].cart = []; // Empty cart after purchase
                    localStorage.setItem("users", JSON.stringify(users));
                }
                
                // Clear cart
                localStorage.setItem("cart", JSON.stringify([]));
                
                alert("Payment successful! Order ID: " + orderID);
                window.location.reload();
            }
        });
    }
    
    // Display orders if on order history page
    const orderHistory = document.getElementById('order-history');
    if (orderHistory && isLoggedIn()) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const userOrders = orders.filter(order => order.user === currentUser.username);
        
        if (userOrders.length > 0) {
            let orderHTML = `
                <h3>Your Order History</h3>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            userOrders.forEach(order => {
                const date = new Date(order.date).toLocaleDateString();
                
                orderHTML += `
                    <tr>
                        <td>${order.id}</td>
                        <td>${date}</td>
                        <td>${order.items.length} books</td>
                        <td>₹${order.total}</td>
                        <td><span class="badge bg-success">${order.status}</span></td>
                    </tr>
                `;
            });
            
            orderHTML += `
                        </tbody>
                    </table>
                </div>
            `;
            
            orderHistory.innerHTML = orderHTML;
        } else {
            orderHistory.innerHTML = `
                <div class="alert alert-info">
                    You haven't placed any orders yet. 
                    <a href="index.html">Browse our collection</a>
                </div>
            `;
        }
    }
});