// ====================
// CLEANUP (safety)
// ====================
document.querySelectorAll('span.delete-btn').forEach(btn => {
  if (!btn.closest('.card')) btn.remove();
});

// ====================
// DRAG & DROP SETUP
// ====================

const lists = document.querySelectorAll('.list');

function initCard(card) {
  card.addEventListener('dragstart', dragStart);
  card.addEventListener('dragend', dragEnd);
  addDeleteButton(card);
}

document.querySelectorAll('.card').forEach(initCard);

lists.forEach(list => {
  list.addEventListener('dragover', dragOver);
  list.addEventListener('dragenter', dragEnter);
  list.addEventListener('dragleave', dragLeave);
  list.addEventListener('drop', dragDrop);
});

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  setTimeout(() => (e.target.style.display = 'none'), 0);
}

function dragEnd(e) {
  e.target.style.display = 'block';
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add('over');
}

function dragLeave(e) {
  this.classList.remove('over');
}

function dragDrop(e) {
  e.preventDefault();

  const id = e.dataTransfer.getData('text/plain');
  const card = document.getElementById(id);

  let target = e.target;
  while (!target.classList.contains('list')) {
    target = target.parentNode;
  }

  target.insertBefore(card, target.querySelector('.add-card'));
  target.classList.remove('over');

  saveBoardToLocalStorage();
}

// ====================
// ADD CARD
// ====================

document.querySelectorAll('.add-card button').forEach(button => {
  button.addEventListener('click', () => {
    const wrapper = button.parentElement;
    const input = wrapper.querySelector('.card-input');
    const priority = wrapper.querySelector('.card-priority').value;
    const text = input.value.trim();

    if (!text) return;

    const card = document.createElement('div');
    card.className = `card ${priority}`;
    card.draggable = true;
    card.id = `card-${Date.now()}`;

    const textSpan = document.createElement('span');
    textSpan.className = 'card-text';
    textSpan.textContent = text;

    card.appendChild(textSpan);
    initCard(card);

    wrapper.closest('.list').insertBefore(card, wrapper);
    input.value = '';

    saveBoardToLocalStorage();
  });
});

// ====================
// DELETE CARD
// ====================

function addDeleteButton(card) {
  if (card.querySelector('.delete-btn')) return;

  const btn = document.createElement('span');
  btn.className = 'delete-btn';
  btn.textContent = '❌';

  btn.addEventListener('click', () => {
    card.remove();
    saveBoardToLocalStorage();
  });

  card.appendChild(btn);
}

// ====================
// LOCAL STORAGE
// ====================

function saveBoardToLocalStorage() {
  const data = [];

  document.querySelectorAll('.card').forEach(card => {
    const textSpan = card.querySelector('.card-text');
    if (!textSpan) return;

    data.push({
      id: card.id,
      text: textSpan.textContent,
      priority: card.classList.contains('high')
        ? 'high'
        : card.classList.contains('medium')
        ? 'medium'
        : 'low',
      listId: card.closest('.list').id,
      description: card.dataset.description || ''
    });
  });

  localStorage.setItem('kanbanBoard', JSON.stringify(data));
}

function loadBoardFromLocalStorage() {
  const saved = localStorage.getItem('kanbanBoard');
  if (!saved) return;

  // Remove existing cards
  document.querySelectorAll('.card').forEach(card => card.remove());

  JSON.parse(saved).forEach(item => {
    const card = document.createElement('div');
    card.className = `card ${item.priority}`;
    card.draggable = true;
    card.id = item.id;

    const textSpan = document.createElement('span');
    textSpan.className = 'card-text';
    textSpan.textContent = item.text;

    card.appendChild(textSpan);
    initCard(card);

    const list = document.getElementById(item.listId);
    list.insertBefore(card, list.querySelector('.add-card'));
  });
}

loadBoardFromLocalStorage();



// dark mode toggle
const themeToggle = document.getElementById('toggleTheme');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '🌞 Toggle Light Mode';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '🌞 Toggle Light Mode' : '🌙 Toggle Dark Mode';
});




// ====================
// MODAL SETUP
// ====================

const modal = document.getElementById('cardModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const saveBtn = document.getElementById('saveCardDetails');
const closeBtn = document.querySelector('.close-btn');

let activeCard = null; // the card being edited

// Open modal on card click
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Prevent clicks on delete button from opening modal
    if (e.target.classList.contains('delete-btn')) return;

    activeCard = card;

    modalTitle.textContent = card.querySelector('.card-text')?.textContent || '';
    modalDescription.value = card.dataset.description || '';

    modal.classList.remove('hidden');
  });
});


// Save card details
saveBtn.addEventListener('click', () => {
  if (!activeCard) return;

  // Save title
  const textSpan = activeCard.querySelector('.card-text');
  if (textSpan) {
    textSpan.textContent = modalTitle.textContent.trim();
  }

  // Save description as dataset
  activeCard.dataset.description = modalDescription.value.trim();

  modal.classList.add('hidden');
  saveBoardToLocalStorage(); // include description in save later
});

// Close modal
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});
