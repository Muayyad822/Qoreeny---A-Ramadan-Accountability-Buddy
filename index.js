document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((error) =>
        console.error("Service Worker Registration Failed:", error)
      );
  }

  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notifications enabled!");
      }
    });
  }

  function updateNotification() {
    if (Notification.permission === "granted") {
      const completedGoals = goals.filter((goal) => goal.completed).length;
      const remainingGoals = goals.length - completedGoals;

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Ramadan Goals Progress", {
          body: `✅ Completed: ${completedGoals}\n⏳ Remaining: ${remainingGoals}`,
          icon: "https://fav.farm/🌙",
          badge: "https://fav.farm/🌙",
          requireInteraction: true, // Keeps notification persistent
          tag: "ramadan-goals", // Ensures only one notification is active at a time
          renotify: true, // Replaces the previous notification with an update
        });
      });
    }
  }

  // Menu functionalities
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("close-sidebar");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
  });

  const openArchive = document.getElementById("open-archive");
  const archiveOverlay = document.getElementById("archive-overlay");
  const archiveList = document.getElementById("archive-list");
  const closeArchive = document.getElementById("close-archive");
  const clearArchive = document.getElementById("clear-archive");

  // Open archive modal
  openArchive.addEventListener("click", () => {
    archiveList.innerHTML = "";
    const pastGoals = JSON.parse(localStorage.getItem("pastGoals")) || [];

    if (pastGoals.length === 0) {
      archiveList.innerHTML =
        "<li class='text-center text-gray-500'>No past goals recorded.</li>";
    } else {
      pastGoals.forEach((entry) => {
        const entryElement = document.createElement("li");
        entryElement.className = "p-2 bg-gray-200 rounded-lg text-black mb-1";
        entryElement.innerHTML = `<strong>${
          entry.date
        }:</strong> ${entry.completedGoals
          .map((goal) => goal.text)
          .join(", ")}`;
        archiveList.appendChild(entryElement);
      });
    }

    archiveOverlay.classList.remove("hidden");
  });

  // Close archive modal
  closeArchive.addEventListener("click", () => {
    archiveOverlay.classList.add("hidden");
  });

  // Clear archive
  clearArchive.addEventListener("click", () => {
    localStorage.removeItem("pastGoals");
    archiveList.innerHTML =
      "<li class='text-center text-gray-500'>No past goals recorded.</li>";
  });

  // recommended tasks
  const recommendedTasks = [
    "Pray Taraweeh",
    "Give Sadaqah",
    "Read one Juz of the Quran",
    "Make dua for loved ones after Salah",
    "Help prepare Iftar for family or community",
    "Do Istighfar 100 times",
    "Read and reflect a Hadith",
    "Perform Tahajjud ",
    "Avoid gossip and backbiting for the day",
    "Visit a sick person or elderly relative",
    "Call a family member you haven't spoken to in a while",
    "Reflect on a Quranic verse and its meaning",
    "Recite Surah Al-Mulk before sleeping",
    "Donate to a local mosque or charity organization",
    "Memorize a new Surah or Ayah from the Quran",
    "Spend time in Dhikr (remembrance of Allah) daily",
    "Feed a fasting person for Iftar",
    "Avoid wasting time on social media",
    "Pray for the Ummah",
  ];

  const openRecommended = document.getElementById("open-recommended");
  const recommendedOverlay = document.getElementById("recommended-overlay");
  const recommendedList = document.getElementById("recommended-list");
  const closeRecommended = document.getElementById("close-recommended");

  openRecommended.addEventListener("click", () => {
    recommendedList.innerHTML = ""; // Clear before adding
    recommendedTasks.forEach((task) => {
      const li = document.createElement("li");
      li.className =
        "p-2 bg-gray-300 rounded-lg text-black text-center cursor-pointer hover:bg-gray-400";
      li.textContent = task;
      li.addEventListener("click", () => {
        goals.push({ text: task, completed: false });
        saveAndRender();
        recommendedOverlay.classList.add("hidden");
      });
      recommendedList.appendChild(li);
    });
    recommendedOverlay.classList.remove("hidden");
  });

  closeRecommended.addEventListener("click", () => {
    recommendedOverlay.classList.add("hidden");
  });

  const authContainer = document.getElementById("auth-container");
  const mainApp = document.getElementById("main-app");
  const nameInput = document.getElementById("name-input");
  const saveNameBtn = document.getElementById("save-name-btn");
  const userGreeting = document.getElementById("user-greeting");
  const goalInput = document.getElementById("goal-input");
  const addGoalBtn = document.getElementById("add-goal-btn");
  const goalsList = document.getElementById("goals-list");
  const errorDisplay = document.getElementById("error-display");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  let userName = localStorage.getItem("userName");

  let currentTheme = localStorage.getItem("theme") || "dark";
  body.setAttribute("data-theme", currentTheme);
  updateThemeStyles(currentTheme);

  themeToggle.textContent = currentTheme === "dark" ? "🌞" : "🌙 ";

  themeToggle.addEventListener("click", () => {
    const newTheme =
      body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      body.classList.add("transition-colors", "duration-500");
    body.setAttribute("data-theme", newTheme);

    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "🌞" : "🌙 ";
    updateThemeStyles(newTheme);
  });

  function updateThemeStyles(theme) {
    if (theme === "dark") {
      body.classList.remove("bg-white", "text-black");
      body.classList.add("bg-[#1e1e2e]", "text-white");
    } else {
      body.classList.remove("bg-[#1e1e2e]", "text-white");
      body.classList.add("bg-white", "text-black");
    }
  }

  function renderGoals() {
    goalsList.innerHTML = "";
    goals.forEach((goal, index) => {
      const li = document.createElement("li");
      li.className =
        "flex justify-between items-center p-2 bg-gray-600 rounded-lg text-white";

      li.innerHTML = `
                  <input type="checkbox" data-index="${index}" class="goal-checkbox" ${
        goal.completed ? "checked" : ""
      }>
                  <span class="flex-grow ml-2 ${
                    goal.completed ? "line-through text-gray-400" : ""
                  }">${goal.text}</span>
                  <button data-index="${index}" class="delete-btn btn btn-sm btn-error">✖</button>
              `;

      goalsList.appendChild(li);
    });
  }

  function saveAndRender() {
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();
    updateNotification(); // Ensure notifications update when goals change
  }

  addGoalBtn.addEventListener("click", () => {
    const text = goalInput.value.trim();
    try {
      if (text) {
        goals.push({ text, completed: false });
        goalInput.value = "";
        saveAndRender();
      } else {
        throw new Error("Goal input cannot be empty");
      }
    } catch (error) {
      errorDisplay.textContent = error.message;
      setTimeout(() => {
        errorDisplay.textContent = "";
      }, 2000);
    }
  });

  goalsList.addEventListener("click", (event) => {
    const index = event.target.dataset.index;

    if (event.target.classList.contains("goal-checkbox")) {
      goals[index].completed = event.target.checked;
    } else if (event.target.classList.contains("delete-btn")) {
      goals.splice(index, 1);
    }

    saveAndRender();
  });

  function notifyGoalsReset() {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Daily Goals Reset", {
          body: "Your Ramadan goals have been reset for a new day! ✨",
          icon: "https://fav.farm/🌙",
          badge: "https://fav.farm/🌙",
          tag: "goal-reset",
        });
      });
    }
  }

  function resetGoals() {
    goals = []; // Clear all goals
    localStorage.removeItem("goals"); // Remove saved goals from localStorage
    localStorage.setItem("lastResetDate", new Date().toDateString()); // Store today's date
    saveAndRender(); // Ensure UI updates immediately
    notifyGoalsReset(); //
  }

  function resetGoalsAtMidnight() {
    const now = new Date();
    const todayStr = now.toDateString(); // Get today's date as a string
    const lastResetDate = localStorage.getItem("lastResetDate");

    // If the stored date is different from today, reset goals
    if (lastResetDate !== todayStr) {
      resetGoals();
    }

    // Calculate time until midnight
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to next midnight
    const timeUntilMidnight = midnight - now;

    // Schedule reset at next midnight
    setTimeout(() => {
      resetGoals();
      setInterval(resetGoals, 24 * 60 * 60 * 1000); // Repeat reset every 24 hours
    }, timeUntilMidnight);
  }

  function checkUser() {
    if (userName) {
      userGreeting.textContent = `Welcome, ${userName}! 👋`;
      authContainer.classList.add("hidden");
      mainApp.classList.remove("hidden");
    } else {
      authContainer.classList.remove("hidden");
      mainApp.classList.add("hidden");
    }
  }

  saveNameBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name) {
      localStorage.setItem("userName", name);
      userName = name;
      checkUser();
    }
  });

  function displayIslamicDate() {
    const today = new Date();
    const hijriDate = new HijriDate(today);

    const islamicDateStr = `${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year} AH`;

    // let ramadanDay = hijriDate.month === 9 ? `🌙 Ramadan Day: ${hijriDate.day}` : "";

    document.getElementById("islamic-date").innerHTML = ` ${islamicDateStr} `;
  }

  // Simple Hijri Date Conversion
  class HijriDate {
    constructor(gregorianDate) {
      const { year, month, day } = this.gregorianToHijri(gregorianDate);
      this.year = year;
      this.month = month;
      this.day = day;
      this.monthName = this.getMonthName(month);
    }

    gregorianToHijri(date) {
      // Umm al-Qura Calendar approximation
      let jd = Math.floor(date / 86400000) + 2440588; // Convert to Julian Day
      let l = jd - 1948440 + 10632;
      let n = Math.floor((l - 1) / 10631);
      l = l - 10631 * n + 354;
      let j =
        Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
        Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
      l =
        l -
        Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
        Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
        29;
      let month = Math.floor((24 * l) / 709);
      let day = l - Math.floor((709 * month) / 24);
      let year = 30 * n + j - 30;
      return { year, month, day };
    }

    getMonthName(month) {
      const months = [
        "Muharram",
        "Safar",
        "Rabi' al-Awwal",
        "Rabi' al-Thani",
        "Jumada al-Awwal",
        "Jumada al-Thani",
        "Rajab",
        "Sha'ban",
        "Ramadan",
        "Shawwal",
        "Dhul Qa'dah",
        "Dhul Hijjah",
      ];
      return months[month - 1];
    }
  }

  resetGoalsAtMidnight();
  renderGoals();
  checkUser();
  displayIslamicDate();
});
