import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat-container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "...") element.textContent = "";
  }, 300);
}

function typeText(element, text) {
  let i = 0;

  let interval = setInterval(() => {
    if (i < text.length) element.innertHTML += text.charAt(i++);
    else clearInterval(interval);
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexaString = randomNumber.toString();

  return `${timestamp}-${hexaString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img 
            src="${isAi ? bot : user}"
            alt="${isAi ? "bot" : "user"}"
          />
        </div>
        <div class="message" id="${uniqueId}>${value}</div>
      </div>
    </div>
    `;
}

function handleSubmit(e) {
  e.preventDefault();
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.code === 13) handleSubmit();
});
