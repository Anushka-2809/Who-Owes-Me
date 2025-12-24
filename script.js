document.addEventListener("DOMContentLoaded", () => {
  // ---------- PAGE ELEMENTS ----------
  const landing = document.getElementById("landing");
  const app = document.getElementById("app");
  const getStarted = document.getElementById("getStarted");

  // ---------- FORM ELEMENTS ----------
  const form = document.getElementById("debt-form");
  const nameInput = document.getElementById("name");
  const amountInput = document.getElementById("amount");

  // ---------- DISPLAY ELEMENTS ----------
  const list = document.getElementById("debts-list");
  const emptyState = document.getElementById("empty-state");
  const totalEl = document.getElementById("total");

  // ---------- BUTTONS ----------
  const sortDateBtn = document.getElementById("sort-date");
  const sortAmountBtn = document.getElementById("sort-amount");
  const clearAllBtn = document.getElementById("clear-all");

  // ---------- DATA ----------
  let debts = JSON.parse(localStorage.getItem("debts")) || [];

  // ---------- NAVIGATION ----------
  getStarted.addEventListener("click", () => {
    landing.style.display = "none";
    app.style.display = "block";
    render();
  });

  // ---------- ADD ENTRY ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const amount = Number(amountInput.value); // 👈 FORCE NUMBER

    if (!name || amount <= 0) return;

    debts.push({
      id: Date.now(),
      name: name,
      amount: amount, // 👈 STORED AS NUMBER
      date: new Date().toISOString()
    });

    saveAndRender();
    form.reset();
  });

  // ---------- RENDER ----------
  function render() {
    list.innerHTML = "";

    if (debts.length === 0) {
      emptyState.style.display = "block";
      totalEl.textContent = "Total Owed to You: ₹0";
      return;
    }

    emptyState.style.display = "none";

    // ✅ FIXED TOTAL CALCULATION
    const total = debts.reduce((sum, d) => sum + Number(d.amount), 0);
    totalEl.textContent = `Total Owed to You: ₹${total}`;

    debts.forEach(d => {
      const li = document.createElement("li");

      li.innerHTML = `
        <div>
          <strong>${d.name}</strong><br>
          <small>Owes you ₹${d.amount}</small>
        </div>
        <button onclick="deleteEntry(${d.id})">✕</button>
      `;

      list.appendChild(li);
    });
  }

  // ---------- DELETE ENTRY ----------
  window.deleteEntry = function (id) {
    debts = debts.filter(d => d.id !== id);
    saveAndRender();
  };

  // ---------- SORT ----------
  sortDateBtn.addEventListener("click", () => {
    debts.sort((a, b) => new Date(b.date) - new Date(a.date));
    render();
  });

  sortAmountBtn.addEventListener("click", () => {
    debts.sort((a, b) => b.amount - a.amount);
    render();
  });

  // ---------- CLEAR ALL ----------
  clearAllBtn.addEventListener("click", () => {
    if (confirm("Clear all entries?")) {
      debts = [];
      saveAndRender();
    }
  });

  // ---------- SAVE ----------
  function saveAndRender() {
    localStorage.setItem("debts", JSON.stringify(debts));
    render();
  }
});
