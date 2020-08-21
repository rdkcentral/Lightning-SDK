

export const mergeColors = (c1, c2, p) => {
    let r1 = ((c1 / 65536) | 0) % 256;
    let g1 = ((c1 / 256) | 0) % 256;
    let b1 = c1 % 256;
    let a1 = ((c1 / 16777216) | 0);
    let r2 = ((c2 / 65536) | 0) % 256;
    let g2 = ((c2 / 256) | 0) % 256;
    let b2 = c2 % 256;
    let a2 = ((c2 / 16777216) | 0);
    let r = r1 * p + r2 * (1 - p);
    let g = g1 * p + g2 * (1 - p);
    let b = b1 * p + b2 * (1 - p);
    let a = a1 * p + a2 * (1 - p);
    return Math.round(a) * 16777216 + Math.round(r) * 65536 + Math.round(g) * 256 + Math.round(b);
};

export const calculateAlpha = (argb, p) => {
    if(p > 1) {
        p /= 100;
    }
    else if(p < 0) {
        p = 0;
    }
    let r = ((argb / 65536) | 0) % 256;
    let g = ((argb / 256) | 0) % 256;
    let b = argb % 256;
    return (r << 16) + (g << 8) + b + (((p * 255) | 0) * 16777216);
};

export const mergeColorAlpha = (c, alpha) => {
    let a = ((c / 16777216 | 0) * alpha) | 0;
    return (((((c >> 16) & 0xff) * a) / 255) & 0xff) +
        ((((c & 0xff00) * a) / 255) & 0xff00) +
        (((((c & 0xff) << 16) * a) / 255) & 0xff0000) +
        (a << 24);
};

export const isObject = v => {
    return typeof v === 'object' && v !== null
};

export const isString = v => {
    return typeof v === 'string'
};

export const getRgbaComponents = (argb) => {
    let r = ((argb / 65536) | 0) % 256;
    let g = ((argb / 256) | 0) % 256;
    let b = argb % 256;
    let a = ((argb / 16777216) | 0);
    return [r, g, b, a];
};