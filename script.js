document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const list = document.getElementById("taskList");
  const plannerSection = document.getElementById("plannerSection");
  const loginSection = document.getElementById("loginSection");
  const welcomeSection = document.getElementById("welcomeSection");
  const signupModal = document.getElementById("signupModal");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    list.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${task.subject}</strong> - ${task.deadline} (${task.startTime} to ${task.endTime})<br>
        ${task.taskDescription}
        <button onclick="removeTask(${index})">Remove</button>
      `;
      list.appendChild(li);
    });
  }

  window.removeTask = function(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = {
      subject: document.getElementById("subject").value,
      starting: document.getElementById("starting").value,
      deadline: document.getElementById("deadline").value,
      taskDescription: document.getElementById("task").value,
      startTime: document.getElementById("startTime").value,
      endTime: document.getElementById("endTime").value,
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    notifyUser(task.subject, task.deadline);
    form.reset();
  });

  function notifyUser(subject, deadline) {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("New Task Added", {
          body: `${subject} due on ${deadline}`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("New Task Added", {
              body: `${subject} due on ${deadline}`,
            });
          }
        });
      }
    }
  }

  window.login = function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email && password) {
      loginSection.style.display = "none";
      welcomeSection.style.display = "block";
      document.getElementById("userName").innerText = email.split("@")[0];
    } else {
      alert("Please enter both email and password.");
    }
  };

  window.openSignupModal = function () {
    signupModal.style.display = "block";
  };

  window.closeSignupModal = function () {
    signupModal.style.display = "none";
  };

  window.handleSignup = function () {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    alert(`Sign-up successful!\nWelcome, ${name}`);
    closeSignupModal();
    loginSection.style.display = "none";
    welcomeSection.style.display = "block";
    document.getElementById("userName").innerText = name;
  };

  window.showPlanner = function () {
    welcomeSection.style.display = "none";
    plannerSection.style.display = "block";
  };

  window.logout = function () {
    plannerSection.style.display = "none";
    welcomeSection.style.display = "none";
    loginSection.style.display = "block";
  };

 
  window.downloadExcel = function () {
    if (tasks.length === 0) {
      alert("No tasks to export!");
      return;
    }

    const worksheetData = tasks.map(task => ({
      Subject: task.subject,
      StartingDate: task.starting,
      Deadline: task.deadline,
      Description: task.taskDescription,
      StartTime: task.startTime,
      EndTime: task.endTime,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "study_tasks.xlsx");
  };

  renderTasks();
});
