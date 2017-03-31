# redux-fusion
[![Build Status](https://travis-ci.org/cif/redux-fusion.svg?branch=master)](https://travis-ci.org/cif/redux-fusion)

### What is this?
This module is a higher order component that serves as an alternative to `react-redux` [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).
There is no additional buy in, all of your redux modules and containers can remain as-is.
You could even wrap an existing connected component with `fuse()` if desired.

### How it works
Redux `createStore` is [observable](https://github.com/reactjs/redux/blob/master/src/createStore.js#L203-L208)
so it is straight forward to access store from root `<Provider>` context, convert to a `state$`
observable and subscribe the wrapped component's props via `mapPropsStream()`.
See [recompose's Observable utilities](https://github.com/acdlite/recompose/blob/master/docs/API.md#observable-utilities)
for more details.

The end result is developer ability to use bi-directional reactive programming to combine state and UI streams:

### Usage Example

```js
import React from 'react'
import { createEventHandler } from 'recompose'
import fuse from 'redux-fusion'
import { someReduxAction } from '../redux/actions'

const hello$ = (state$, dispatch, getState) => (props$) => {
  const {
     handler: handleClick,
     stream: click$
  } = createEventHandler()

  click$
    .debounceTime(300)
    .subscribe(() => dispatch(someReduxAction()))

  const hello$ = state$
    .pluck('hello')
    .map(val => `Hello ${val}`)

  return props$.combineLatest(hello$, (props, hello) => ({
    hello,
    handleClick
  }))   
}

const Hello = ({ handleClick, message }) =>
  (
    <div>
      <h3>{message}</h3>
      <button onClick={handleClick}>Click Me</button>
    </div>
  )

const HelloWorld = fuse(hello$)(Hello)

```

## Stay tuned for more real life examples!
