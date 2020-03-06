import Settings from '../Settings/index';
import { initDefaults, defaults } from './defaults';

let getInfo = (key)=>{
  const value = Settings.get('profile', key);
  if(value) return value;
  return defaults[key];
};

let setInfo = (key, params)=>{
  if(key in defaults) defaults[key] = params;
};

export const initProfile = config=>{
  getInfo = config.getInfo;
  setInfo = config.setInfo;
  initDefaults();
};

const getOrSet = (key, params)=>(params ? setInfo(key, params) : getInfo(key));

// public API
export default {
  ageRating(params){
    return getOrSet('ageRating', params);
  },
  city(params){
    return getOrSet('city', params);
  },
  countryCode(params){
    return getOrSet('countryCode', params);
  },
  ip(params){
    return getOrSet('ip', params);
  },
  household(params){
    return getOrSet('household', params);
  },
  language(params){
    return getOrSet('language', params);
  },
  latlon(params){
    return getOrSet('latlon', params);
  },
  locale(params){
    return getOrSet('locale', params);
  },
  mac(params){
    return getOrSet('mac', params);
  },
  operator(params){
    return getOrSet('operator', params);
  },
  platform(params){
    return getOrSet('platform', params);
  },
  packages(params){
    return getOrSet('packages', params);
  },
  uid(params){
    return getOrSet('uid', params);
  },
  stbType(params){
    return getOrSet('stbType', params);
  }
};
