import * as React from "react";

const Dialog = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </div>
    </div>
  );
});

Dialog.displayName = "Dialog";

export default Dialog;
