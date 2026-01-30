import { LitElement, html, css } from 'https://unpkg.com/lit@3/index.js?module';
import { TableCore } from './table-core.js';
import './table.css';

export class CustomTable extends LitElement {
  static properties = {
    fields: { type: Array },
    records: { type: Array },
    pageSize: { type: Number }
  };

  constructor() {
    super();
    this.fields = [];
    this.records = [];
    this.pageSize = 20;
    this.tableCore = null;
  }

  render() {
    return html`
      <div id="table-root"></div>
      <div id="pagination-root"></div>
    `;
  }

  firstUpdated() {
    const tableMount = this.renderRoot.querySelector('#table-root');
    const paginationMount = this.renderRoot.querySelector('#pagination-root');

    this.tableCore = new TableCore({
      mount: tableMount,
      fields: this.fields,
      pageSize: this.pageSize,
      renderRow: window.renderRowContents,   // 👈 直接用你原本的
      renderPagination: ({ totalPages, currentPage, onChange }) => {
        paginationMount.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement('button');
          btn.innerText = i;
          if (i === currentPage) btn.disabled = true;
          btn.onclick = () => onChange(i);
          paginationMount.appendChild(btn);
        }
      }
    });

    this.tableCore.init();
    this.tableCore.setData(this.records);
  }

  updated(changed) {
    if (changed.has('records') && this.tableCore) {
      this.tableCore.setData(this.records);
    }
  }
}

customElements.define('custom-table', CustomTable);