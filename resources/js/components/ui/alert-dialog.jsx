import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

const AlertDialogContext = createContext();

const AlertDialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

const AlertDialogTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { setIsOpen } = useContext(AlertDialogContext);

  return (
    <button
      ref={ref}
      onClick={() => setIsOpen(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});

const AlertDialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(AlertDialogContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div
        ref={ref}
        className={cn(
          "relative z-50 max-w-lg w-full mx-4 bg-white rounded-lg shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

const AlertDialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 text-center sm:text-left p-6 pb-2", className)}
    {...props}
  />
));

const AlertDialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-2", className)}
    {...props}
  />
));

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => {
  const { setIsOpen } = useContext(AlertDialogContext);

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-50 transition-colors hover:bg-gray-900/90 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e);
        setIsOpen(false);
      }}
      {...props}
    />
  );
});

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => {
  const { setIsOpen } = useContext(AlertDialogContext);

  return (
    <button
      ref={ref}
      className={cn(
        "mt-2 inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e);
        setIsOpen(false);
      }}
      {...props}
    />
  );
});

AlertDialogTrigger.displayName = "AlertDialogTrigger";
AlertDialogContent.displayName = "AlertDialogContent";
AlertDialogHeader.displayName = "AlertDialogHeader";
AlertDialogFooter.displayName = "AlertDialogFooter";
AlertDialogTitle.displayName = "AlertDialogTitle";
AlertDialogDescription.displayName = "AlertDialogDescription";
AlertDialogAction.displayName = "AlertDialogAction";
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
