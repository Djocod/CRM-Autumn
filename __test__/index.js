const input = document.querySelector("input");
const form = document.querySelector("form");
const result = document.querySelector(".result");
// const btn = document.querySelector(".btn-product");
const USER_ID = "69ac1fdfc8ca3d2dc1b8ea15";
// let products = [];
function productDisplay() {
  fetch(`http://localhost:3000/api/product/`)
    .then((res) => res.json())
    .then((data) => {
      data.products.forEach((product) => {
        const li = document.createElement("li");

        const button = document.createElement("button");
        button.dataset.id = product._id;
        button.textContent = `${product.title}`;
        button.addEventListener("click", () => addToUser(product._id));
        document.body.appendChild(button);

        li.appendChild(button);
        result.appendChild(li);
        // console.log(button, li);
      });
    });
}

async function addToUser(productId) {
  const res = await fetch(
    `http://localhost:3000/api/product/${productId}/purchase`,

    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID }),
    },
  );
  const data = await res.json();
  console.log("Produits achetés :", data.purchasedProducts);
}

productDisplay();
//   fetch("http://localhost:3000/api/product/search?brand=" + brand)
//     .then((res) => res.json())
//     .then((data) => {
//       data.forEach((product) => {
//         console.log(product.title);
//       });
//     });
