/* ---------- Firebase 설정 (절대 수정 X) ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyBRtzAMf8hxhZAUEjvETl9YJ6q7ep1NZhY",
  authDomain: "superlife-5b39e.firebaseapp.com",
  projectId: "superlife-5b39e",
  storageBucket: "superlife-5b39e.firebasestorage.app",
  messagingSenderId: "579164716910",
  appId: "1:579164716910:web:47584c546afe7fc18acb7f",
  measurementId: "G-8D9T03SHBG"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let uid = null;
let userData = {};

/* ---------- 로그인 ---------- */
auth.signInAnonymously();
auth.onAuthStateChanged(user => {
  if (user) {
    uid = user.uid;
    loadData();
  }
});

/* ---------- 데이터 ---------- */
function loadData() {
  db.collection("users").doc(uid).get().then(doc => {
    userData = doc.exists ? doc.data() : {};
    showPage("todo");
  });
}

function saveData() {
  db.collection("users").doc(uid).set(userData);
}

/* ---------- 페이지 ---------- */
const content = document.getElementById("content");

function showPage(page) {
  if (page === "asset") renderAsset();
  if (page === "job") renderJob();
  if (page === "todo") renderTodo();
  if (page === "habit") renderHabit();
}

/* ---------- 자산 ---------- */
function renderAsset() {
  userData.asset ||= { savings:"", living:"" };

  content.innerHTML = `
    <h3>자산</h3>

    <div class="card">
      <label>💰 목돈</label>
      <input value="${userData.asset.savings}"
        oninput="userData.asset.savings=this.value; saveData()">
    </div>

    <div class="card">
      <label>🧾 생활금</label>
      <input value="${userData.asset.living}"
        oninput="userData.asset.living=this.value; saveData()">
    </div>
  `;
}

/* ---------- 알바 ---------- */
function renderJob() {
  userData.jobs ||= [];

  content.innerHTML = `
    <h3>알바</h3>

    <div class="card">
      <input id="jobName" placeholder="알바 이름">
      <input id="jobPlace" placeholder="위치">
      <input id="jobTime" placeholder="시간">
      <button onclick="addJob()">추가</button>
    </div>

    ${userData.jobs.map((j,i)=>`
      <div class="card">
        <strong>${j.name}</strong><br>
        📍 ${j.place}<br>
        ⏰ ${j.time}
        <button onclick="deleteJob(${i})">삭제</button>
      </div>
    `).join("")}
  `;
}

function addJob() {
  if (jobName.value && jobPlace.value && jobTime.value) {
    userData.jobs.push({
      name: jobName.value,
      place: jobPlace.value,
      time: jobTime.value
    });
    saveData();
    renderJob();
  }
}

function deleteJob(i) {
  userData.jobs.splice(i,1);
  saveData();
  renderJob();
}

/* ---------- do it ---------- */
function renderTodo() {
  userData.todos ||= [];

  content.innerHTML = `
    <h3>do it</h3>

    <div class="hero"></div>

    <div class="card">
      <input id="todoInput" placeholder="오늘 반드시 할 것">
      <button onclick="addTodo()">추가</button>
    </div>

    ${userData.todos.map((t,i)=>`
      <div class="card todo ${t.done ? "done" : ""}"
           onclick="toggleTodo(${i})">
        ${t.text}
        <button onclick="deleteTodo(${i});event.stopPropagation()">삭제</button>
      </div>
    `).join("")}
  `;
}

function addTodo() {
  if (todoInput.value) {
    userData.todos.push({ text: todoInput.value, done:false });
    saveData();
    renderTodo();
  }
}

function toggleTodo(i) {
  userData.todos[i].done = !userData.todos[i].done;
  saveData();
  renderTodo();
}

function deleteTodo(i) {
  userData.todos.splice(i,1);
  saveData();
  renderTodo();
}

/* ---------- 매일 ---------- */
function renderHabit() {
  userData.habits ||= [];

  content.innerHTML = `
    <h3>매일</h3>

    <div class="card">
      <input id="habitInput" placeholder="매일 할 습관">
      <button onclick="addHabit()">추가</button>
    </div>

    ${userData.habits.map((h,i)=>`
      <div class="card">✅ ${h}
        <button onclick="deleteHabit(${i})">삭제</button>
      </div>
    `).join("")}
  `;
}

function addHabit() {
  if (habitInput.value) {
    userData.habits.push(habitInput.value);
    saveData();
    renderHabit();
  }
}

function deleteHabit(i) {
  userData.habits.splice(i,1);
  saveData();
  renderHabit();
}

/* ---------- SW ---------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
