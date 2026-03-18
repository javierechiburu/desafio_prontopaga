import { Component, type ReactNode } from 'react'

interface AsyncBoundaryProps {
  children: ReactNode
  resetKeys?: unknown[]
  fallback: (error: Error, reset: () => void) => ReactNode
}

interface AsyncBoundaryState {
  error: Error | null
}

function haveResetKeysChanged(previousKeys: unknown[] = [], nextKeys: unknown[] = []) {
  if (previousKeys.length !== nextKeys.length) {
    return true
  }

  return previousKeys.some((key, index) => !Object.is(key, nextKeys[index]))
}

export class AsyncBoundary extends Component<AsyncBoundaryProps, AsyncBoundaryState> {
  override state: AsyncBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error): AsyncBoundaryState {
    return { error }
  }

  override componentDidUpdate(previousProps: AsyncBoundaryProps) {
    if (this.state.error && haveResetKeysChanged(previousProps.resetKeys, this.props.resetKeys)) {
      this.setState({ error: null })
    }
  }

  reset = () => {
    this.setState({ error: null })
  }

  override render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset)
    }

    return this.props.children
  }
}
