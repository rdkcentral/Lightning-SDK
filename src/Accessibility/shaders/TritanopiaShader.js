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

export default class TritanopiaShader extends ColorShift {}

TritanopiaShader.fragmentShaderSource = `
    ${ColorShift.before}
    vec4 filter( vec4 color )
    {
        vec3 opponentColor = RGBtoOpponentMat * vec3(color.r, color.g, color.b);
        opponentColor.x -= ((3.0 * opponentColor.z) - opponentColor.y) * 0.25;
        vec3 rgbColor = OpponentToRGBMat * opponentColor;
        return vec4(rgbColor.r, rgbColor.g, rgbColor.b, color.a);
    }

    vec4 vision(vec4 color)
    {
        vec4 r = vec4( 0.97,  0.11, -0.08, 0.0 );
        vec4 g = vec4( 0.02,  0.82,  0.16, 0.0 );
        vec4 b = vec4(-0.06,  0.88,  0.18, 0.0 );

        return vec4(dot(color, r), dot(color, g), dot(color, b), color.a);
    }
    ${ColorShift.after}
`
