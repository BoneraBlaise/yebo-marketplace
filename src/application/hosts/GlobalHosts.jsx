import React from "react";
import { useStateHosts } from "./StateHostProvider";
import { Dialog, Drawer, Toast } from "../../design-system/components";
import { ProgressNotification } from "../../design-system/notifications";

export const ModalHost = () => {
  const { dialogs, closeDialog } = useStateHosts() || {};
  if (!dialogs?.length) return null;
  const active = dialogs[dialogs.length - 1];
  return (
    <Dialog open title={active.title || "Dialog"} onClose={() => closeDialog?.(active.id)}>
      {active.content}
    </Dialog>
  );
};

export const DrawerHost = () => {
  const { drawers, closeDrawer } = useStateHosts() || {};
  if (!drawers?.length) return null;
  const active = drawers[drawers.length - 1];
  return (
    <Drawer open={true} side={active.side}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{active.title || "Drawer"}</h3>
        <button type="button" onClick={() => closeDrawer?.(active.id)} aria-label="Close drawer">×</button>
      </div>
      {active.content}
    </Drawer>
  );
};

export const SheetHost = DrawerHost;

export const ToastHost = () => {
  const { toasts, dismissToast } = useStateHosts() || {};
  return (
    <>
      {toasts?.map((t) => (
        <Toast key={t.id} message={t.message} variant={t.variant} onClose={() => dismissToast?.(t.id)} />
      ))}
    </>
  );
};

export const NotificationHost = ToastHost;

export const CommandPaletteHost = ({ open, children, onClose }) =>
  open ? (
    <div role="dialog" aria-modal="true" aria-label="Command palette" className="fixed inset-0 z-[1400] bg-black/50 flex items-start justify-center pt-[15vh]">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg mx-4 p-4">
        {children}
        <button type="button" className="mt-2 text-sm text-gray-500" onClick={onClose}>Close</button>
      </div>
    </div>
  ) : null;

export const LoadingHost = () => {
  const { loading } = useStateHosts() || {};
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[1500] bg-black/30 flex items-center justify-center" role="status" aria-label="Loading">
      <div className="w-10 h-10 border-2 border-yebone-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export const ProgressOverlayHost = () => {
  const { progress } = useStateHosts() || {};
  if (progress == null) return null;
  return <ProgressNotification message="Processing..." progress={progress} />;
};

export const GlobalHosts = () => (
  <>
    <ModalHost />
    <DrawerHost />
    <ToastHost />
    <LoadingHost />
    <ProgressOverlayHost />
  </>
);

export default GlobalHosts;
