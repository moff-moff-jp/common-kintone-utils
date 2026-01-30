export class TableCore {
  constructor(options) {
    this.mount = options.mount;
    this.fields = options.fields;
    this.pageSize = options.pageSize || 20;

    this.renderRow = options.renderRow;   // 🔑 外部注入
    this.renderPagination = options.renderPagination;

    this.currentPage = 1;
    this.currentSort = { field: null, order: 'asc' };
    this.records = [];
    this.sortedRecords = [];

    this.table = null;
  }

  init() {
    this.createTableShell();
  }

  setData(records) {
    this.records = records || [];
    this.sortedRecords = [...this.records];
    this.renderPage(1);
  }

  /* ---------- table shell ---------- */

  createTableShell() {
    this.table = document.createElement('table');
    this.table.className = 'custom-table';

    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    // 詳細欄
    const thLink = document.createElement('th');
    thLink.innerText = '詳細';
    thLink.style.width = '35px';
    tr.appendChild(thLink);

    this.fields.forEach(field => {
      const th = document.createElement('th');
      th.innerHTML = field.label.replace(/[(（]/g, '<br>$&');
      th.dataset.fieldCode = field.code;
      th.classList.add('sortable');

      th.onclick = () => this.sortByField(field.code);

      tr.appendChild(th);
    });

    const thEdit = document.createElement('th');
    thEdit.innerText = '編集';
    tr.appendChild(thEdit);

    thead.appendChild(tr);
    this.table.appendChild(thead);

    this.mount.innerHTML = '';
    this.mount.appendChild(this.table);
  }

  /* ---------- sort ---------- */

  sortByField(field) {
    if (this.currentSort.field === field) {
      this.currentSort.order =
        this.currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.field = field;
      this.currentSort.order = 'asc';
    }

    this.sortedRecords.sort((a, b) => {
      const v1 = a[field]?.value ?? '';
      const v2 = b[field]?.value ?? '';
      return this.currentSort.order === 'asc'
        ? String(v1).localeCompare(String(v2))
        : String(v2).localeCompare(String(v1));
    });

    this.renderPage(1);
  }

  /* ---------- pagination ---------- */

  renderPage(page) {
    const total = this.sortedRecords.length;
    const totalPages = Math.ceil(total / this.pageSize);

    this.currentPage = Math.min(Math.max(1, page), totalPages || 1);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageRecords = this.sortedRecords.slice(start, end);

    this.renderBody(pageRecords);

    if (this.renderPagination) {
      this.renderPagination({
        total,
        totalPages,
        currentPage: this.currentPage,
        onChange: p => this.renderPage(p)
      });
    }
  }

  /* ---------- tbody ---------- */

  renderBody(records) {
    let tbody = this.table.querySelector('tbody');
    if (tbody) tbody.remove();

    tbody = document.createElement('tbody');

    records.forEach(rec => {
      const tr = document.createElement('tr');
      this.renderRow(tr, rec, this.table); // 🔑 你原本那坨還在外面
      tbody.appendChild(tr);
    });

    this.table.appendChild(tbody);
  }
}