/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Lightning from '../../Lightning'

export default class ColorShift extends Lightning.shaders.WebGLDefaultShader {
  set brightness(v) {
    this._brightness = (v - 50) / 100
    this.redraw()
  }

  set contrast(v) {
    this._contrast = (v + 50) / 100
    this.redraw()
  }

  set gamma(v) {
    this._gamma = (v + 50) / 100
    this.redraw()
  }

  setupUniforms(operation) {
    super.setupUniforms(operation)
    const gl = this.gl
    this._setUniform(
      'colorAdjust',
      [this._brightness || 0.0, this._contrast || 1.0, this._gamma || 1.0],
      gl.uniform3fv
    )
  }
}

ColorShift.before = `
    #ifdef GL_ES
    # ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    # else
    precision lowp float;
    # endif
    #endif
        
    varying vec2 vTextureCoord;
    varying vec4 vColor;
    uniform sampler2D uSampler;
    uniform vec3 colorAdjust;
    
    const mat3 RGBtoOpponentMat = mat3(0.2814, -0.0971, -0.0930, 0.6938, 0.1458,-0.2529, 0.0638, -0.0250, 0.4665);
    const mat3 OpponentToRGBMat = mat3(1.1677, 0.9014, 0.7214, -6.4315, 2.5970, 0.1257, -0.5044, 0.0159, 2.0517);    
`

ColorShift.after = `    
    vec3 brightnessContrast(vec3 value, float brightness, float contrast)
    {
        return (value - 0.5) * contrast + 0.5 + brightness;
    }   
    
    vec3 updateGamma(vec3 value, float param)
    {
        return vec3(pow(abs(value.r), param),pow(abs(value.g), param),pow(abs(value.b), param));
    } 
       
    void main(void){
        vec4 fragColor = texture2D(uSampler, vTextureCoord);        
        vec4 color = filter(fragColor) * vColor;       
        
        vec3 bc = brightnessContrast(color.rgb,colorAdjust[0],colorAdjust[1]);        
        vec3 ga = updateGamma(bc.rgb, colorAdjust[2]);  
              
        gl_FragColor = vec4(ga.rgb, color.a);          
    }    
`
