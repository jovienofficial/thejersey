import React, { useEffect, useRef } from 'react';

const BackgroundShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform float time;
      uniform vec2 resolution;

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        vec3 g = h - floor(h + 0.5);
        vec3 ox = floor(a0 + 0.5);
        vec3 zh = 1.0 - 5.5 * (ox * ox + g * g);
        vec3 b0 = vec3( a0.xy, zh.x );
        vec3 b1 = vec3( a0.zw, zh.y );
        vec3 s0 = floor(b0)*2.0 + 1.0;
        vec3 s1 = floor(b1)*2.0 + 1.0;
        vec3 sh = -step(h, vec3(0.0));
        vec3 a1 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec3 a2 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 i3 = vec3(a1.xy, a2.x);
        vec3 i4 = vec3(a1.zw, a2.y);
        vec3 p2 = permute(permute(i3) + i4);
        vec4 j = fract(p2 * C.www);
        vec4 norm = 1.79284291400159 - 0.85373472095314 * j;
        vec4 m2 = m.xxxx * (x0.x * x0.x + x0.y * x0.y) + m.yyyy * (x12.x * x12.x + x12.y * x12.y) + m.zzzz * (x12.z * x12.z + x12.w * x12.w);
        return 130.0 * dot(m, g * x0 + h * x12.xy + a0 * x12.zw);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float t = time * 0.1;
        
        vec3 colorBg = vec3(0.023, 0.023, 0.058); // #06060f
        vec3 colorPurple = vec3(0.486, 0.227, 0.929); // #7c3aed
        vec3 colorOrange = vec3(0.976, 0.451, 0.086); // #f97316
        vec3 colorBlue = vec3(0.176, 0.357, 0.89); // #2d5be3

        float n1 = snoise(uv * 2.0 + t);
        float n2 = snoise(uv * 3.0 - t * 1.2);
        float n3 = snoise(uv * 1.5 + vec2(t, -t));

        vec3 color = colorBg;
        color = mix(color, colorPurple, smoothstep(0.1, 0.8, n1) * 0.4);
        color = mix(color, colorOrange, smoothstep(0.2, 0.9, n2) * 0.2);
        color = mix(color, colorBlue, smoothstep(0.0, 0.7, n3) * 0.3);

        gl_FragColor = vec4(color, 0.6);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!program || !vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'time');
    const resLoc = gl.getUniformLocation(program, 'resolution');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    let start: number | null = null;
    const render = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000;

      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
};

export default BackgroundShader;
