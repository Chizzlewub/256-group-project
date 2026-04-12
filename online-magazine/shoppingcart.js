const { useState, useEffect } = React;

const PRODUCTS = [
  { id: 1, name: "Basketball Journal", category: "Books", price: 12.99 },
  { id: 2, name: "Soccer Ball", category: "Equipment", price: 29.99 },
  { id: 3, name: "Tennis Racket", category: "Equipment", price: 79.99 },
  { id: 4, name: "Sports Daily Hoodie", category: "Clothing", price: 39.99 },
  { id: 5, name: "Football Poster", category: "Decor", price: 9.99 }
];

function ShoppingCartApp() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("sd_cart") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("sd_cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function changeQty(id, delta) {
    setCart(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, qty: Math.max(1, i.qty + delta) }
          : i
      )
    );
  }

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  return React.createElement(
    "div",
    null,

    /* NAVBAR */
    React.createElement(
      "nav",
      { className: "navbar navbar-expand navbar-light border-bottom px-3" },
      React.createElement(
        "a",
        { className: "navbar-brand fw-bold", href: "home-page.html" },
        "Sports Daily"
      ),
      React.createElement(
        "div",
        { className: "navbar-nav" },
        navLink("Home", "home-page.html"),
        navLink("Article Catalog", "articles.html"),
        navLink("Subscribe", "subscriber.html"),
        navLink("Store", "shoppingcart.html", true)
      )
    ),

    /* HEADER */
    React.createElement(
      "div",
      { className: "bg-light border-bottom py-4 px-3 mb-4" },
      React.createElement("h1", { className: "h3 fw-bold" }, "Sports Articles & Merch"),
      React.createElement(
        "p",
        { className: "text-muted mb-2" },
        "Browse products and add them to your shopping cart"
      ),
      React.createElement("input", {
        className: "form-control",
        placeholder: "Search products by name or category...",
        value: search,
        onChange: e => setSearch(e.target.value)
      })
    ),

    /* CONTENT */
    React.createElement(
      "div",
      { className: "container-fluid px-3" },
      React.createElement(
        "div",
        { className: "row" },

        /* PRODUCTS */
        React.createElement(
          "div",
          { className: "col-md-8" },
          React.createElement(
            "div",
            { className: "row" },
            filteredProducts.length
              ? filteredProducts.map(p =>
                  React.createElement(ProductCard, {
                    key: p.id,
                    product: p,
                    addToCart
                  })
                )
              : React.createElement(
                  "p",
                  { className: "text-muted" },
                  "No products found."
                )
          )
        ),

        /* CART */
        React.createElement(
          "div",
          { className: "col-md-4" },
          React.createElement(
            "div",
            { className: "mt-4" },
            React.createElement(
              "h5",
              null,
              "Shopping Cart (",
              totalItems,
              " items)"
            ),
            React.createElement(
              "div",
              { className: "border p-2 mb-2" },
              cart.length
                ? cart.map(item =>
                    React.createElement(CartItem, {
                      key: item.id,
                      item,
                      changeQty,
                      removeFromCart
                    })
                  )
                : React.createElement(
                    "p",
                    { className: "text-muted" },
                    "Cart is empty."
                  )
            ),
            React.createElement(
              "div",
              { className: "fw-bold" },
              "Total: $",
              totalPrice.toFixed(2)
            )
          )
        )
      )
    )
  );
}

/* COMPONENTS */

function ProductCard({ product, addToCart }) {
  return React.createElement(
    "div",
    { className: "col-md-4 mb-3" },
    React.createElement(
      "div",
      { className: "card h-100" },
      React.createElement(
        "div",
        {
          className: "card-body d-flex flex-column justify-content-between"
        },
        React.createElement(
          "div",
          null,
          React.createElement(
            "h6",
            { className: "card-title" },
            product.name
          ),
          React.createElement(
            "p",
            { className: "card-text text-muted" },
            product.category
          ),
          React.createElement(
            "p",
            { className: "card-text fw-bold" },
            "$",
            product.price.toFixed(2)
          )
        ),
        React.createElement(
          "button",
          {
            className: "btn btn-success btn-sm mt-2",
            onClick: () => addToCart(product)
          },
          "Add to Cart"
        )
      )
    )
  );
}

function CartItem({ item, changeQty, removeFromCart }) {
  return React.createElement(
    "div",
    {
      className:
        "d-flex justify-content-between align-items-center mb-2"
    },
    React.createElement(
      "div",
      null,
      React.createElement(
        "h6",
        { className: "mb-1" },
        item.name
      ),
      React.createElement(
        "p",
        { className: "small text-muted" },
        item.category,
        " • $",
        item.price.toFixed(2)
      ),
      React.createElement(
        "div",
        {
          className: "input-group input-group-sm",
          style: { width: "120px" }
        },
        button("-", () => changeQty(item.id, -1)),
        React.createElement("input", {
          className: "form-control text-center",
          value: item.qty,
          readOnly: true
        }),
        button("+", () => changeQty(item.id, 1))
      )
    ),
    React.createElement(
      "div",
      null,
      React.createElement(
        "span",
        { className: "fw-bold" },
        "$",
        (item.price * item.qty).toFixed(2)
      ),
      React.createElement(
        "button",
        {
          className: "btn btn-outline-danger btn-sm ms-2",
          onClick: () => removeFromCart(item.id)
        },
        "Remove"
      )
    )
  );
}

function button(label, onClick) {
  return React.createElement(
    "button",
    {
      className: "btn btn-outline-secondary btn-sm",
      type: "button",
      onClick
    },
    label
  );
}

function navLink(label, href, active = false) {
  return React.createElement(
    "a",
    {
      href,
      className: "nav-link" + (active ? " fw-bold active" : "")
    },
    label
  );
}

/* MOUNT */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(ShoppingCartApp));
``