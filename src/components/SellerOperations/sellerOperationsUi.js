import React from "react";

export const SellerOperationsStatusBanner = ({ tone = "info", title, message, action = null }) => {
  const toneClasses = {
    info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
    error: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100",
    success: "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-100",
    warning:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${toneClasses[tone] || toneClasses.info}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {title ? <p className="font-medium">{title}</p> : null}
      {message ? <p className={`text-sm ${title ? "mt-1" : ""}`}>{message}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
};

export const ResponsiveDataTable = ({ columns, rows, emptyMessage = "No records yet." }) => (
  <>
    <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900/60">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-top">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="md:hidden space-y-3">
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">{emptyMessage}</p>
      ) : (
        rows.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-2"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between gap-3 text-sm">
                <span className="text-gray-500">{col.label}</span>
                <span className="text-right font-medium">{col.render ? col.render(row) : row[col.key]}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  </>
);
