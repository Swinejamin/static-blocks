import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// Your top level component
import App from "./App";
import ErrorBoundary from "./utilities/ErrorBoundary";

// Export your top level component as JSX (for static rendering)
export default App;

// Render your app
if (typeof document !== "undefined") {
  const renderMethod = module.hot
    ? ReactDOM.render
    : ReactDOM.hydrate || ReactDOM.render;
  const render = Comp => {
    renderMethod(
      <ErrorBoundary>
        <BrowserRouter>
          <Comp />
        </BrowserRouter>
      </ErrorBoundary>,
      document.getElementById("root")
    );
  };

  // Render!
  render(App);
}
