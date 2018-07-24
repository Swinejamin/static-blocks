import React, { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.error(error);
    console.info(info);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p content="Somtehing wen">Something went wrong.</p>;
    }
    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.object
};

export default ErrorBoundary;
