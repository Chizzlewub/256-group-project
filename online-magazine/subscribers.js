let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];

const form = document.getElementById("subscriberForm");
const subscriberList = document.getElementById("subscriberList");

function displaySubscribers(){
    subscriberList.innerHTML = "";
    subscribers.forEach((sub,index) =>{
        const card = document.createElement("div");
        card.className = "subscriber-card";
        card.innerHTML=`
        <strong> ${sub.name}</strong><br>
        Email: ${sub.email}<br>
        Age/level: ${sub.age}<br>
        Address: ${sub.address}<br>
        Phone: ${sub.phone}<br>
        <button onclick="editSubscriber(${index})">Edit</button>
        <button onclick="deleteSubscriber(${index})">Delete</button>
        `;
        subscriberList.appendChild(card);
    });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const newSub = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value
  };

  subscribers.push(newSub);
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

  subscribers.splice(index, 1);
  localStorage.setItem("subscribers", JSON.stringify(subscribers));
  displaySubscribers();
}

function deleteSubscriber(index) {
  subscribers.splice(index, 1);
  localStorage.setItem("subscribers", JSON.stringify(subscribers));
  displaySubscribers();
}


displaySubscribers();

