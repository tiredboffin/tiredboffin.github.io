// assets/js/enable-tables.js
document.addEventListener("DOMContentLoaded", function () {
  const tables = document.querySelectorAll("table.datatable");

  tables.forEach((table) => {

    if (!table.rows || table.rows.length <= 1) return;

    new simpleDatatables.DataTable(table, {
      searchable: true,
      perPage: 25,
      fixedHeight: false,
      columns: [
        {
          // 0-based index of the date column
          select: 1,
          type: "date",
          format: "MM/DD/YY"
        }
    });
  });
});
