let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
let editIndex = -1;

const form = document.getElementById("subscriberForm");
const subscriberList = document.getElementById("subscriberList");
const messageBox = document.getElementById("messageBox");

function showMessage(message, type) {
  messageBox.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}

function displaySubscribers() {
  subscriberList.innerHTML = "";

  if (subscribers.length === 0) {
    subscriberList.innerHTML = `<div class="alert alert-secondary">No subscribers yet.</div>`;
    return;
  }

  subscribers.forEach((sub, index) => {
    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${sub.name}</h5>
        <p class="card-text mb-1"><strong>Email:</strong> ${sub.email}</p>
        <p class="card-text mb-1"><strong>Age/Level:</strong> ${sub.age}</p>
        <p class="card-text mb-1"><strong>Affiliation:</strong> ${sub.address}</p>
        <p class="card-text mb-2"><strong>Phone:</strong> ${sub.phone || "N/A"}</p>
        <button class="btn btn-warning btn-sm me-2" onclick="editSubscriber(${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteSubscriber(${index})">Delete</button>
      </div>
    `;
    subscriberList.appendChild(card);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const newSub = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    age: document.getElementById("age").value.trim(),
    address: document.getElementById("address").value.trim(),
    phone: document.getElementById("phone").value.trim()
  };

  if (!newSub.name || !newSub.email || !newSub.age || !newSub.address) {
    showMessage("Please fill in all required fields.", "danger");
    return;
  }

  if (editIndex === -1) {
    subscribers.push(newSub);
    showMessage("Subscriber added successfully.", "success");
  } else {
    subscribers[editIndex] = newSub;
    editIndex = -1;
    showMessage("Subscriber updated successfully.", "success");
  }

  localStorage.setItem("subscribers", JSON.stringify(subscribers));
  displaySubscribers();
  form.reset();
});

function editSubscriber(index) {
  const sub = subscribers[index];
  document.getElementById("name").value = sub.name;
  document.getElementById("email").value = sub.email;
  document.getElementById("age").value = sub.age;
  document.getElementById("address").value = sub.address;
  document.getElementById("phone").value = sub.phone;

  editIndex = index;
  showMessage("Editing subscriber. Update the form and click Subscribe.", "info");
}

function deleteSubscriber(index) {
  subscribers.splice(index, 1);
  localStorage.setItem("subscribers", JSON.stringify(subscribers));
  displaySubscribers();
  showMessage("Subscriber deleted successfully.", "success");
}

displaySubscribers();
