const greeting = document.querySelector("#greeting");
const clock = document.querySelector("#clock");
const date = document.querySelector("#date");
const idea = document.querySelector("#idea");
const ideaButton = document.querySelector("#idea-button");

const ideas = [
  "Build a tiny tool that solves one annoying problem.",
  "Learn one new thing about how the web works.",
  "Make a boring interface feel delightful.",
  "Write a program that explains itself clearly.",
  "Turn a curious question into a weekend experiment.",
  "Improve something by removing unnecessary complexity.",
  "Make something useful that works completely offline."
];

function updateClock() {
  const now = new Date();

  clock.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);

  date.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(now);
}

function updateGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) greeting.textContent = "Good morning, explorer.";
  else if (hour < 18) greeting.textContent = "Good afternoon, explorer.";
  else greeting.textContent = "Good evening, explorer.";
}

function showRandomIdea() {
  const currentIdea = idea.textContent;
  const alternatives = ideas.filter((item) => item !== currentIdea);
  const nextIdea = alternatives[Math.floor(Math.random() * alternatives.length)];

  idea.textContent = nextIdea;
}

ideaButton.addEventListener("click", showRandomIdea);

updateClock();
updateGreeting();
setInterval(updateClock, 1000);
