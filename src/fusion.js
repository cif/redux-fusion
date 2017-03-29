import { Component, createElement, PropTypes } from 'react'
import { mapPropsStream } from 'recompose'
import { Observable } from 'rxjs'

export default (propStream$, StreamedComponent) => {
  class ComponentFromStream extends Component {
    render() {
      if (!this.context.store) {
        throw new Error(
          `fuse() error: Missing Redux store in context.
           Did you forget to <Provide> it?`
        )
      }
      const store$ = Observable.from(this.context.store)
      return createElement(mapPropsStream(propStream$(store$))(StreamedComponent))
    }
  }
  ComponentFromStream.contextTypes = {
    store: (props, propName, componentName) => {
      // custom validation via Observable.from
      try {
        Observable.from(props[propName])
      } catch (e) {
        return
          `fuse() error: context.store must implement observable`
      }
      return null
    }
  }

  return ComponentFromStream
}
