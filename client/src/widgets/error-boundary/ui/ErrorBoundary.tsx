import { Component } from "react";
import { ErrorMessage } from "../../../shared";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage>{ JSON.stringify(this.state, null, 2) }</ErrorMessage>;
    }

    return this.props.children;
  }
}
