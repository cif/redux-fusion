import React, { createElement } from 'react'
import { mapPropsStream } from 'recompose'
import { Observable } from 'rxjs'

export default propStream$ => (StreamedComponent) => {
  class ComponentFromStream extends React.Component {
    constructor(props, context) {
      super(props, context);
      const { store } = context;
      if (!store) {
        throw new Error(
          `fuse() error: Missing Redux store in context.
           Did you forget to <Provide> it?`
        )
      }
      this.WrappedComponent = mapPropsStream(
        propStream$(Observable.from(store), store.dispatch)
      )(StreamedComponent)
    }

    render() {
      return createElement(this.WrappedComponent)
    }
  }
  ComponentFromStream.contextTypes = {
    store: (props, propName) => {
      // custom validation via Observable.from
      try {
        Observable.from(props[propName])
      } catch (e) {
        return
          `fuse() error: context.store must implement observable` // eslint-disable-line
      }
      return null
    }
  }

  return ComponentFromStream
}
