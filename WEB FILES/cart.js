// 🛒 CART SYSTEM SCRIPT
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const cartTotalDisplay = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Render cart items
  function renderCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalDisplay.textContent = "Total: ₱0.00";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      // Clean price text and convert to number safely
      const priceText = String(item.price).replace(/[^\d.]/g, ""); // keep only numbers and decimal
      const price = parseFloat(priceText) || 0; // if invalid, set 0
      const quantity = item.quantity && !isNaN(item.quantity) ? item.quantity : 1;

      const itemTotal = price * quantity;
      total += itemTotal;

      // Create cart item HTML
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>₱${price.toFixed(2)} × ${quantity}</p>
        </div>
        <div class="item-qty-price">
          <span>Total: ₱${itemTotal.toFixed(2)}</span>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
      cartContainer.appendChild(div);
    });

    cartTotalDisplay.textContent = `Total: ₱${total.toFixed(2)}`;

    // Add remove event
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.dataset.index;
        removeItem(index);
      });
    });
  }

  // Remove item
  function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  // Add to cart (for menu.html)
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", e => {
      const card = e.target.closest(".card");
      const itemName = card.querySelector("h3").textContent;
      const priceText = card.querySelector("p").textContent;
      const imageSrc = card.querySelector("img").src;

      // Extract only the first number in the price text
      const match = priceText.match(/\d+(\.\d+)?/);
      const price = match ? parseFloat(match[0]) : 0;

      const existing = cart.find(i => i.name === itemName);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          name: itemName,
          price: price,
          image: imageSrc,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${itemName} added to your cart!`);
    });
  });

  // Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      alert("Your order has been placed! Please prepare payment upon delivery. Thank you for choosing TresMarias & Prince!");
      localStorage.removeItem("cart");
      cart = [];
      renderCart();
    });
  }

  // Initial load
  renderCart();
});


