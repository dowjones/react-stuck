# React Stuck [![Build Status](https://secure.travis-ci.org/dowjones/react-stuck.png)](http://travis-ci.org/dowjones/react-stuck) [![NPM version](https://badge.fury.io/js/react-stuck.svg)](http://badge.fury.io/js/react-stuck)

This is a react component that loosely implements the
[position: sticky](https://developer.mozilla.org/en-US/docs/Web/CSS/position#Sticky_positioning).

Unlike the native implementation, it does not require a container with a certain height and will
work inside one that has its overflow set to 'hidden'; provided you explicitly provide a `height`.

The `top` works as in the native implementation, so when the browser-window top reaches the defined `top`px
above the sticky content, the content will have `position: fixed` applied to it, and thus will
be `stuck`.

## Usage

```jsx
<Stuck top={10} height={500}>
  <div>sticky content</div>
</Stuck>
```

## License

[MIT](/LICENSE)
