import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") element.textContent = "";
  }, 300);
}

function typeText(element, text) {
  let i = 0;

  let interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i++);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else clearInterval(interval);
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
                    src=${isAi ? bot : user} 
                    alt="${isAi ? "bot" : "user"}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
`;
}

async function makeRequest(message) {
  const response = await fetch("http://localhost:5000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: message,
    }),
  });
  const data = await response.json();

  return data;
}

async function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(form);

  //user's message
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();

  //bot's message
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  form.querySelector("textarea").disabled = true;
  const replyText = await makeRequest(data.get("prompt"));

  clearInterval(loadInterval);
  form.querySelector("textarea").disabled = false;
  form.querySelector("textarea").focus();

  messageDiv.textContent = "";

  if (replyText.success) typeText(messageDiv, replyText.bot.trim());
  else typeText(messageDiv, "Something went wrong. Please try again!");
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) handleSubmit(e);
});
