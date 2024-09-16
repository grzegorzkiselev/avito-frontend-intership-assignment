import { Component } from "react";
import { ErrorMessage } from "../../../shared";
import classes from "./ErrorBoundary.module.css";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.toString() };
  }

  render() {
    if (this.state.hasError) {
      return <div className={classes.wrapper}>
        <ErrorMessage>{ this.state.error }</ErrorMessage>
      </div>;
    }

    return this.props.children;
  }
}
