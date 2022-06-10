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

import ColorShift from './ColorShift'

export default class DeuteranopiaShader extends ColorShift {}

DeuteranopiaShader.fragmentShaderSource = `
    ${ColorShift.before}
    vec4 filter( vec4 color )
    {
        vec3 opponentColor = RGBtoOpponentMat * vec3(color.r, color.g, color.b);
        opponentColor.x -= opponentColor.y * 1.5;
        vec3 rgbColor = OpponentToRGBMat * opponentColor;
        return vec4(rgbColor.r, rgbColor.g, rgbColor.b, color.a);
    }

    vec4 vision(vec4 color)
    {
        vec4 r = vec4( 0.43,  0.72, -0.15, 0.0 );
        vec4 g = vec4( 0.34,  0.57,  0.09, 0.0 );
        vec4 b = vec4(-0.02,  0.03,  1.00, 0.0 );

        return vec4(dot(color, r), dot(color, g), dot(color, b), color.a);
    }
    ${ColorShift.after}
`
