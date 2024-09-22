const inputText = document.querySelector(".input-text");
const inputPrice = document.querySelector(".input-num");
const btnSearchPrice = document.querySelector(".btn-price");
const filterButtons = document.querySelectorAll(".filter-btn");
const content = document.querySelector(".cards");
const container = document.querySelector(".container");

fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((data) => {
    const cards = document.querySelector(".cards");
    data.forEach((item) => {
      const div = document.createElement("div");
      div.dataset.category = item.category;
      div.classList.add("products");

      const img = document.createElement("img");
      img.src = item.image;

      const title = document.createElement("h3");
      title.innerHTML = item.title;

      const description = document.createElement("p");
      description.classList.add("description");
      description.innerHTML = item.description;

      const price = document.createElement("p");
      price.classList.add("price");
      price.innerHTML = item.price;

      const btnCart = document.createElement("button");
      btnCart.innerHTML = "Add to cart";
      btnCart.classList.add("add-to-cart");
      btnCart.dataset.id = item.id;
      btnCart.dataset.name = item.title;
      btnCart.dataset.price = item.price;

      div.append(img, title, description, price, btnCart);
      cards.append(div);

      ////////////////////////////////////////////////////////////////////////

      const inputWordHandler = (event) => {
        const phrase = event.target.value.toLowerCase().trim();
        const title = item.title.toLowerCase();
        if (title.includes(phrase)) {
          div.style.display = "grid";
        } else div.style.display = "none";
      };
      inputText.addEventListener("keyup", inputWordHandler);

      ////////////////////////////////////////////////////////////////////////

      const inputPriceHandler = () => {
        const phrase = inputPrice.value;
        console.log(+phrase);

        const price = item.price;

        if (price === +phrase) {
          div.style.display = "grid";
        } else div.style.display = "none";
      };
      btnSearchPrice.addEventListener("click", inputPriceHandler);
    });

    ////////////////////////////////////////////////////////////////////////

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filterValue = button.getAttribute("data-filter");
        filterContent(filterValue);
      });
    });

    ////////////////////////////////////////////////////////////////////////

    function filterContent(filterValue) {
      const products = content.querySelectorAll(".products");
      products.forEach((item) => {
        if (filterValue === "all" || item.dataset.category === filterValue) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    }

    ////////////////////////////////////////////////////////////////////////

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        const name = button.getAttribute("data-name");
        const price = button.getAttribute("data-price");

        const existingProduct = cart.find((item) => item.id === id);

        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            quantity: 1,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
      });
    });

    function updateCartUI() {
      const cartItemsContainer = document.getElementById("cart-items");
      const totalPriceElement = document.getElementById("total-price");
      cartItemsContainer.innerHTML = "";
      let totalPrice = 0;

      cart.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <div class="item-title"><p>قیمت: ${item.price} تومان</p>
      <p>تعداد: <button class="decrease-qty" data-id="${item.id}">-</button> ${item.quantity} <button class="increase-qty" data-id="${item.id}">+</button></p>
      <button class="remove-item" data-id="${item.id}">حذف</button></div>
    `;

        cartItemsContainer.appendChild(itemDiv);
        totalPrice += item.price * item.quantity;
      });

      totalPriceElement.innerText = totalPrice;

      document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.getAttribute("data-id");
          cart = cart.filter((item) => item.id !== id);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartUI();
        });
      });

      document.querySelectorAll(".decrease-qty").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.getAttribute("data-id");
          const product = cart.find((item) => item.id === id);
          if (product.quantity > 1) {
            product.quantity--;
          } else {
            cart = cart.filter((item) => item.id !== id);
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartUI();
        });
      });

      document.querySelectorAll(".increase-qty").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.getAttribute("data-id");
          const product = cart.find((item) => item.id === id);
          product.quantity++;
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartUI();
        });
      });
    }

    document.addEventListener("DOMContentLoaded", updateCartUI);
  });
