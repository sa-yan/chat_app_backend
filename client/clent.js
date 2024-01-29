const socket = io("http://localhost:3000");
const messages = document.getElementById("messages");
const msgForm = document.getElementById("msgForm");

socket.on("message", (data) => {
  console.log(data);
  appendMessages(data.message);
});

// Set up the event listener first
socket.on("output-message", (data) => {
  console.log(data);
  if (data.length) {
    data.forEach((message) => {
      appendMessages(message.msg);
    });
  }
});

// Then handle other interactions, like form submissions
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("messagedetection", "sayan", msgForm.msg.value);
  console.log("submit from msgfrom", msgForm.msg.value);
  msgForm.msg.value = "";
});

function appendMessages(message) {
  const html = `<div>${message}</div>`;
  messages.innerHTML += html;
}
