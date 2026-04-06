const PRODUCTS = [
  { id: 1, name: "Basketball Journal", category: "Books", price: 12.99 },
  { id: 2, name: "Soccer Ball", category: "Equipment", price: 29.99 },
  { id: 3, name: "Tennis Racket", category: "Equipment", price: 79.99 },
  { id: 4, name: "Sports Daily Hoodie", category: "Clothing", price: 39.99 },
  { id: 5, name: "Football Poster", category: "Decor", price: 9.99 },
];

let cart = JSON.parse(localStorage.getItem('sd_cart') || '[]');

function renderProducts() {
  const search = $('#search').val().toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search)
  );

  const html = filtered.map(p => `
    <div class="col-md-4 mb-3">
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h6 class="card-title">${p.name}</h6>
            <p class="card-text text-muted">${p.category}</p>
            <p class="card-text fw-bold">$${p.price.toFixed(2)}</p>
          </div>
          <button class="btn btn-success btn-sm mt-2" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  $('#product-list').html(html || '<p class="text-muted">No products found.</p>');
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) item.qty = 1;
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('sd_cart', JSON.stringify(cart));
}

function renderCart() {
  let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  let totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  let html = cart.length
    ? cart.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <p class="small text-muted">${item.category} • $${item.price.toFixed(2)}</p>
            <div class="input-group input-group-sm" style="width:120px">
              <button class="btn btn-outline-secondary btn-sm" onclick="changeQty(${item.id}, -1)">-</button>
              <input type="text" class="form-control text-center" value="${item.qty}" readonly>
              <button class="btn btn-outline-secondary btn-sm" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
          </div>
          <div>
            <span class="fw-bold">$${(item.price * item.qty).toFixed(2)}</span>
            <button class="btn btn-outline-danger btn-sm ms-2" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      `).join('')
    : '<p class="text-muted">Cart is empty.</p>';

  $('#cart-summary').html(html);
  $('#cart-count').text(totalItems);
  $('#cart-total').text('$' + totalPrice.toFixed(2));
}

$('#search').on('input', renderProducts);

$(document).ready(function() {
  renderProducts();
  renderCart();
});