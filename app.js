/* ---------- Firebase 설정 ---------- */
const firebaseConfig = {
    apiKey: "AIzaSyBRtzAMf8hxhZAUEjvETl9YJ6q7ep1NZhY",
    authDomain: "superlife-5b39e.firebaseapp.com",
    projectId: "superlife-5b39e",
    storageBucket: "superlife-5b39e.firebasestorage.app",
    messagingSenderId: "579164716910",
    appId: "1:579164716910:web:47584c546afe7fc18acb7f",
    measurementId: "G-8D9T03SHBG"
};

/* Firebase 초기화 */
firebase.initializeApp(firebaseConfig);

/* Firebase 서비스 객체 */
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

/* ---------- 데이터 로드 & 저장 ---------- */
function loadData() {
  db.collection("users").doc(uid).get().then(doc => {
    userData = doc.exists ? doc.data() : {};
    showPage("todo");
  });
}

function saveData() {
  db.collection("users").doc(uid).set(userData);
}

/* ---------- 화면 ---------- */
const content = document.getElementById("content");

function showPage(page) {
  if (page === "asset") assetPage();
  if (page === "job") jobPage();
  if (page === "todo") todoPage();
  if (page === "habit") habitPage();
}

/* ---------- 자산 ---------- */
function assetPage() {
  content.innerHTML = `
    <h3>자산</h3>
    <input placeholder="현재 자산"
      value="${userData.money || ""}"
      oninput="userData.money=this.value; saveData();">
  `;
}

/* ---------- 알바 ---------- */
function jobPage() {
  userData.jobs ||= [];
  content.innerHTML = `
    <h3>알바</h3>
    <input id="job" placeholder="알바 내용">
    <input id="pay" placeholder="금액">
    <button onclick="addJob()">추가</button>
    ${userData.jobs.map(j => `<div class="item">${j}</div>`).join("")}
  `;
}

function addJob() {
  const j = document.getElementById("job").value;
  const p = document.getElementById("pay").value;
  if (j && p) {
    userData.jobs.push(`${j} - ${p}원`);
    saveData();
    jobPage();
  }
}

/* ---------- 할 일 ---------- */
function todoPage() {
  userData.todos ||= [];
  content.innerHTML = `
    <h3>할 일</h3>
    <input id="todo" placeholder="할 일">
    <button onclick="addTodo()">추가</button>
    ${userData.todos.map((t,i)=>`
      <div class="item">
        <input type="checkbox" onchange="removeTodo(${i})"> ${t}
      </div>`).join("")}
  `;
}

function addTodo() {
  const todo = document.getElementById("todo").value;
  if (todo) {
    userData.todos.push(todo);
    saveData();
    todoPage();
  }
}

function removeTodo(i) {
  userData.todos.splice(i,1);
  saveData();
  todoPage();
}

/* ---------- 매일 ---------- */
function habitPage() {
  userData.habits ||= [];
  content.innerHTML = `
    <h3>매일</h3>
    <input id="habit" placeholder="습관">
    <button onclick="addHabit()">추가</button>
    ${userData.habits.map(h => `<div class="item">✅ ${h}</div>`).join("")}
  `;
}

function addHabit() {
  const habit = document.getElementById("habit").value;
  if (habit) {
    userData.habits.push(habit);
    saveData();
    habitPage();
  }
}

/* ---------- Service Worker 등록 ---------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
