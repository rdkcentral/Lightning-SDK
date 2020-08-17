import {mergeColors, calculateAlpha, isObject, isString} from './utils.js';

let _colors = {
  white: '#ffffff',
  black: '#000000',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  yellow: '#feff00',
  cyan: '#00feff',
  magenta: '#ff00ff'
};

const _normalizedColors = {
  //store for normalized colors
};

export const color = (value, options) => {
  //create color tag for storage
  let tag = `${value}${options !== undefined ? JSON.stringify(options) : ''}`;
  //check if value is not a number, or if options is not undefined
  if(isNaN(value) || options) {
    //check if tag is stored in colors;
    if(_normalizedColors[tag]) {
      //return stored color
      return _normalizedColors[tag];
    }
  }
  //calculate a new color
  const targetColor = _calculateColor(value, options);

  //store calculated color if its not stored
  if(!_normalizedColors[tag]) {
    _normalizedColors[tag] = targetColor;
  }
  return targetColor || 0;
};

const _calculateColor = (value, options) => {
  let targetColor = _normalizeColor(value);
  if(!isNaN(options)) {
    options = {alpha: options};
  }
  if(options && isObject(options)) {
    if(!isNaN(options.darken)) {
      targetColor = mergeColors(targetColor, 0xff000000, 1 - options.darken);
    }

    if(!isNaN(options.lighten)) {
      targetColor = mergeColors(targetColor, 0xffffffff, 1 - options.lighten);
    }

    if(!isNaN(options.opacity)) {
      options.alpha = options.opacity / 100;
    }

    if(!isNaN(options.alpha)) {
      targetColor = calculateAlpha(targetColor, options.alpha);
    }
  }
  return targetColor || 0;
};

const _normalizeColor = (color) => {
  let targetColor = _colors[color];
  if(!targetColor) {
    targetColor = color;
  }
  if(isString(targetColor) && /^#[0-9A-F]{6}$/i.test(targetColor.toUpperCase())) {
    targetColor = `0xff${targetColor.slice(1)}` * 1;
  }
  return targetColor || 0xffffffff;
};

const _cleanUpNormalizedColor = (color) => {
  for(let c in _normalizedColors) {
    if(c.indexOf(color) > -1) {
      _normalizedColors[c] = undefined;
      delete _normalizedColors[c];
    }
  }
};

export const add = (colors, value) => {
  if(isObject(colors)) {
    //clean up _normalizedColors if they exist in the to be added colors
    Object.keys(colors).forEach((color) => _cleanUpNormalizedColor(color));
    _colors = Object.assign({}, _colors, colors);
  }
  else if(isString(colors) && value) {
    _cleanUpNormalizedColor(colors);
    _colors[colors] = value
  }
};

export const mix = (color1, color2, p) => {
  color1 = color(color1);
  color2 = color(color2);
  return mergeColors(color1, color2, p);
};

export default {
  color,
  add,
  mix
};
