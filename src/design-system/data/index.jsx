import React from "react";
import { Card, DataTable, EmptyState } from "../components";

export const List = ({ items = [], renderItem }) => (
  <ul className="divide-y divide-gray-200 dark:divide-gray-700">{items.map((item, i) => <li key={item.id || i} className="py-3">{renderItem ? renderItem(item) : item.label}</li>)}</ul>
);

export const Timeline = ({ events = [] }) => (
  <ol className="relative border-l border-gray-200 ml-3">{events.map((e) => (
    <li key={e.id} className="mb-4 ml-4"><span className="absolute -left-1.5 w-3 h-3 bg-yebone-primary rounded-full" /><p className="text-sm font-medium">{e.title}</p><p className="text-xs text-gray-500">{e.time}</p></li>
  ))}</ol>
);

export const ActivityFeed = ({ activities = [] }) => <Timeline events={activities.map((a) => ({ id: a.id, title: a.message, time: a.timestamp }))} />;

export const Statistics = ({ stats = [] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{stats.map((s) => <Card key={s.id}><p className="text-sm text-gray-500">{s.label}</p><p className="text-xl font-bold">{s.value}</p></Card>)}</div>
);

export const Metrics = Statistics;

export const Logs = ({ entries = [] }) => (
  <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-64 font-mono">{entries.map((e) => `[${e.time}] ${e.message}\n`).join("")}</pre>
);

export const DataList = ({ columns, rows, emptyTitle }) => rows?.length ? <DataTable columns={columns} rows={rows} /> : <EmptyState title={emptyTitle} />;

export default { List, Timeline, ActivityFeed, Statistics, Metrics, Logs, DataList };
