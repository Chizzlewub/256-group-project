let editId = null;


function getArticles() {
  return JSON.parse(localStorage.getItem('sd_articles') || '[]');
}

function saveArticles(arr) {
  localStorage.setItem('sd_articles', JSON.stringify(arr));
}



function nextId() {
  const articles = getArticles();
  if (!articles.length) return 'ART-001';
  const highest = Math.max(...articles.map(a => parseInt(a.id.replace('ART-', ''))));
  return 'ART-' + String(highest + 1).padStart(3, '0');
}


function getFormValues() {
  return {
    title:  document.getElementById('f-title').value.trim(),
    sport:  document.getElementById('f-sport').value,
    words:  document.getElementById('f-words').value,
    access: document.getElementById('f-access').value,
    author: document.getElementById('f-author').value.trim(),
  };
}

function clearForm() {
  ['f-id', 'f-title', 'f-sport', 'f-words', 'f-access', 'f-author']
    .forEach(id => document.getElementById(id).value = '');
}

function setFormMode(mode) {
  const isEdit = mode === 'edit';
  document.getElementById('form-title').textContent        = isEdit ? 'Edit Article'   : 'Add New Article';
  document.getElementById('btn-submit').textContent        = isEdit ? 'Save Changes'   : 'Add Article';
  document.getElementById('btn-cancel').style.display      = isEdit ? 'block'          : 'none';
}


function submitForm() {
  const { title, sport, words, access, author } = getFormValues();

  if (!title)                    return alert('Title is required.');
  if (!sport)                    return alert('Please select a sport.');
  if (!words || isNaN(words))    return alert('Enter a valid word count.');
  if (!access)                   return alert('Select an access level.');

  const articles = getArticles();

  if (editId) {
    const article = articles.find(a => a.id === editId);
    if (article) Object.assign(article, { title, sport, words: parseInt(words), access, author });
    editId = null;
    setFormMode('add');
  } else {
    articles.push({ id: nextId(), title, sport, words: parseInt(words), access, author, description: '' });
  }

  saveArticles(articles);
  clearForm();
  renderList();
}

function editArticle(id) {
  const article = getArticles().find(a => a.id === id);
  if (!article) return;

  document.getElementById('f-id').value     = article.id;
  document.getElementById('f-title').value  = article.title;
  document.getElementById('f-sport').value  = article.sport;
  document.getElementById('f-words').value  = article.words;
  document.getElementById('f-access').value = article.access;
  document.getElementById('f-author').value = article.author;

  editId = id;
  setFormMode('edit');
}

function cancelEdit() {
  editId = null;
  clearForm();
  setFormMode('add');
}

function deleteArticle(id) {
  if (!confirm('Delete this article?')) return;
  saveArticles(getArticles().filter(a => a.id !== id));
  renderList();
}


function renderList() {
  const search      = document.getElementById('search').value.toLowerCase();
  const sportFilter = document.getElementById('filter-sport').value;

  const filtered = getArticles().filter(a =>
    (a.title.toLowerCase().includes(search) || a.sport.toLowerCase().includes(search)) &&
    (!sportFilter || a.sport === sportFilter)
  );

  document.getElementById('count').textContent =
    filtered.length + ' article' + (filtered.length !== 1 ? 's' : '');

  document.getElementById('article-list').innerHTML = filtered.length
    ? filtered.map(a => `
        <div class="card mb-2">
          <div class="card-body">
            <span class="badge bg-dark">${a.sport}</span>
            <span class="badge bg-secondary">${a.access}</span>
            <h6 class="mt-2">${a.title}</h6>
            <p class="small text-muted">${a.author ? a.author + ' • ' : ''}${a.words} words</p>
            <button class="btn btn-outline-secondary btn-sm" onclick="editArticle('${a.id}')">Edit</button>
            <button class="btn btn-outline-danger btn-sm"    onclick="deleteArticle('${a.id}')">Delete</button>
          </div>
        </div>`).join('')
    : '<p class="text-muted">No articles found.</p>';
}

init();
