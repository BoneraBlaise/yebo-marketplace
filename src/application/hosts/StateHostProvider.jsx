import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

const HostContext = createContext(null);

/** Global state hosts — dialogs, toasts, drawers, etc. — Phase 8H.1 */
export const StateHostProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]);
  const [drawers, setDrawers] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  const openDialog = useCallback((dialog) => setDialogs((d) => [...d, { id: `dlg-${Date.now()}`, ...dialog }]), []);
  const closeDialog = useCallback((id) => setDialogs((d) => d.filter((x) => x.id !== id)), []);
  const openDrawer = useCallback((drawer) => setDrawers((d) => [...d, { id: `drw-${Date.now()}`, ...drawer }]), []);
  const closeDrawer = useCallback((id) => setDrawers((d) => d.filter((x) => x.id !== id)), []);
  const openSheet = useCallback((sheet) => setSheets((s) => [...s, { id: `sht-${Date.now()}`, ...sheet }]), []);
  const closeSheet = useCallback((id) => setSheets((s) => s.filter((x) => x.id !== id)), []);
  const showToast = useCallback((toast) => setToasts((t) => [...t, { id: `tst-${Date.now()}`, ...toast }]), []);
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const pushNotification = useCallback((n) => setNotifications((list) => [...list, n]), []);
  const showLoading = useCallback(() => setLoading(true), []);
  const hideLoading = useCallback(() => setLoading(false), []);
  const showProgress = useCallback((value) => setProgress(value), []);
  const hideProgress = useCallback(() => setProgress(null), []);

  const value = useMemo(
    () => ({
      dialogs, drawers, sheets, toasts, notifications, loading, progress,
      openDialog, closeDialog, openDrawer, closeDrawer, openSheet, closeSheet,
      showToast, dismissToast, pushNotification, showLoading, hideLoading, showProgress, hideProgress,
    }),
    [dialogs, drawers, sheets, toasts, notifications, loading, progress,
      openDialog, closeDialog, openDrawer, closeDrawer, openSheet, closeSheet,
      showToast, dismissToast, pushNotification, showLoading, hideLoading, showProgress, hideProgress]
  );

  return <HostContext.Provider value={value}>{children}</HostContext.Provider>;
};

export const useStateHosts = () => useContext(HostContext);

export default StateHostProvider;
