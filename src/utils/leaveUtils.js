/**
 * Calculate the difference in calendar days between two dates, inclusive.
 * @param {string|Date} fromDate
 * @param {string|Date} toDate
 * @returns {number} Number of days
 */
export const calculateLeaveDays = (fromDate, toDate) => {
  if (!fromDate || !toDate) return 0;
  const start = new Date(fromDate);
  const end = new Date(toDate);
  
  // Set times to midnight to avoid issues with daylight saving time
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  if (end < start) return 0;
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

/**
 * Format date to standard enterprise format: DD MMM YYYY (e.g. 05 Aug 2025)
 * @param {string} dateString
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const days = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${days} ${month} ${year}`;
};

/**
 * Exports data objects to a downloadable CSV file.
 * @param {Array<Object>} headers - e.g. [{ key: 'name', label: 'Employee' }]
 * @param {Array<Object>} data - The dataset to export
 * @param {string} filename - Output file name
 */
export const exportToCSV = (headers, data, filename = 'leave_report.csv') => {
  const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map(row => 
    headers.map(h => {
      const val = row[h.key] !== undefined && row[h.key] !== null ? String(row[h.key]) : '';
      return `"${val.replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headerRow, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Opens a print-friendly view of a table to save as PDF.
 * @param {string} title - The title of the document
 * @param {Array<Object>} headers - Column configuration
 * @param {Array<Object>} data - Table data row objects
 */
export const exportToPDF = (title, headers, data) => {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Popup blocker prevented PDF generation. Please allow popups.');
    return;
  }
  
  const rowsHtml = data.map((row, index) => `
    <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
      ${headers.map(h => `
        <td style="padding: 10px 12px; font-size: 13px; color: #334155; text-align: left;">
          ${row[h.key] !== undefined && row[h.key] !== null ? row[h.key] : '-'}
        </td>
      `).join('')}
    </tr>
  `).join('');

  const headersHtml = headers.map(h => `
    <th style="padding: 12px; font-size: 13px; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; text-align: left; background-color: #f1f5f9;">
      ${h.label}
    </th>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, sans-serif; margin: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; }
          .title { font-size: 24px; font-weight: 700; color: #1e3a8a; margin: 0; }
          .date { font-size: 12px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${title}</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #475569;">Employee Management System (EMS)</p>
          </div>
          <div class="date">Generated: ${new Date().toLocaleString()}</div>
        </div>
        <table>
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div class="footer">
          Confidential - Internal HR Document - Employee Management System
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};
