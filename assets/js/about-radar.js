(function () {
  'use strict';

  // iconPath: 24×24 viewBox 기준 SVG path
  const INTERESTS = [
    {
      name: 'Aviation', desc: '비행기 조종 및 관제', northDeg: 338, dist: 0.55,
      // 위에서 본 비행기
      iconPath: 'M12 1 L9 9 L1 11 L9 13 L9 20 L11 19 L12 17 L13 19 L15 20 L15 13 L23 11 L15 9 Z',
    },
    {
      name: 'Trip', desc: '새로운 곳 탐험하기', northDeg: 32, dist: 0.70,
      // 위치 핀
      iconPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    },
    {
      name: 'HCI', desc: '인간-컴퓨터 상호작용', northDeg: 102, dist: 0.52,
      // 모니터
      iconPath: 'M20 3H4C2.9 3 2 3.9 2 5v10c0 1.1.9 2 2 2h5v2H8v2h8v-2h-1v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H4V5h16v10z',
    },
    {
      name: 'Productivity', desc: '효율적으로 살기', northDeg: 152, dist: 0.63,
      // 번개
      iconPath: 'M13 2L6 14h5v8l7-12h-5z',
    },
    {
      name: 'Human', desc: '사람에 대한 관심', northDeg: 208, dist: 0.62,
      // 사람 실루엣
      iconPath: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    },
    {
      name: 'Language', desc: '언어와 소통', northDeg: 257, dist: 0.56,
      // 말풍선
      iconPath: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z',
    },
    {
      name: 'Music', desc: '음악 듣고 만들기', northDeg: 296, dist: 0.44,
      // 음표
      iconPath: 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z',
    },
    {
      name: 'Journal', desc: '기록하기', northDeg: 68, dist: 0.60,
      // 연필
      iconPath: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    },
  ];

  const SWEEP_MS        = 5800;
  const BLIP_FADE_MS    = 1800;
  const BLIP_R          = 6;
  const ICON_SIZE       = 15;       // 아이콘 표시 크기 (논리 px)
  const HIT_RADIUS_MULT = 2.5;
  const ICON_COLOR      = '#1e64dc';

  let canvas, ctx, tooltip, container;
  let W, R, CX, CY;
  let dpr = 1;
  let sweep    = norm(-Math.PI / 2);
  let prevSweep = sweep;
  let lastTs   = 0;
  let glowAt   = {};

  function norm(a) {
    return ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  }

  function toCanvasAngle(northDeg) {
    return norm((northDeg - 90) * Math.PI / 180);
  }

  function blipXY(interest) {
    const a = toCanvasAngle(interest.northDeg);
    return {
      x: CX + Math.cos(a) * interest.dist * R,
      y: CY + Math.sin(a) * interest.dist * R,
    };
  }

  function crossed(prevA, curA, target) {
    const arc = norm(curA - prevA);
    return norm(curA - target) <= arc;
  }

  function makeSVGImage(pathD, size) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}"><path d="${pathD}" fill="${ICON_COLOR}"/></svg>`;
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);
    return img;
  }

  function init() {
    container = document.getElementById('radar-container');
    canvas    = document.getElementById('radar-canvas');
    tooltip   = document.getElementById('radar-tooltip');
    if (!canvas) return;

    dpr = window.devicePixelRatio || 1;

    // 아이콘 이미지 미리 생성
    INTERESTS.forEach((b) => {
      b.iconImg = makeSVGImage(b.iconPath, ICON_SIZE * dpr);
    });

    resize();
    window.addEventListener('resize', debounce(resize, 200));
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

    requestAnimationFrame(frame);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W  = rect.width;
    CX = W / 2;
    CY = W / 2;
    R  = W * 0.43;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(W * dpr);
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }

  function frame(ts) {
    const dt = lastTs ? Math.min(ts - lastTs, 64) : 16;
    lastTs = ts;

    prevSweep = sweep;
    sweep = norm(sweep + (2 * Math.PI / SWEEP_MS) * dt);

    INTERESTS.forEach((interest, i) => {
      if (crossed(prevSweep, sweep, toCanvasAngle(interest.northDeg))) {
        glowAt[i] = ts;
      }
    });

    draw(ts);
    updateHUD();
    requestAnimationFrame(frame);
  }

  function updateHUD() {
    const hdgEl = document.getElementById('radar-hdg');
    const clkEl = document.getElementById('radar-clock');
    if (hdgEl) {
      // canvas 0 = 동쪽(90°), 시계방향 → 나침반 변환
      const deg = Math.round((sweep * 180 / Math.PI + 90 + 360) % 360);
      hdgEl.textContent = 'HDG: ' + String(deg).padStart(3, '0') + '°';
    }
    if (clkEl) {
      const now = new Date();
      clkEl.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((n) => String(n).padStart(2, '0')).join(':');
    }
  }

  function draw(ts) {
    ctx.clearRect(0, 0, W, W);
    drawGrid();
    drawSweep();
    drawBlips(ts);
  }

  function drawGrid() {
    [0.33, 0.66, 1.0].forEach((f) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R * f, 0, Math.PI * 2);
      if (f === 1.0) {
        ctx.strokeStyle = 'rgba(80, 140, 200, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(80, 140, 200, 0.18)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 7]);
      }
      ctx.stroke();
      ctx.restore();
    });

    ctx.save();
    ctx.strokeStyle = 'rgba(80, 140, 200, 0.15)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 7]);
    [[CX - R, CY, CX + R, CY], [CX, CY - R, CX, CY + R]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
    ctx.restore();

    const dirs = [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]];
    ctx.save();
    ctx.font = `600 ${W * 0.028}px -apple-system, sans-serif`;
    ctx.fillStyle = 'rgba(30, 80, 140, 0.3)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    dirs.forEach(([label, dx, dy]) => {
      ctx.fillText(label, CX + dx * (R + W * 0.042), CY + dy * (R + W * 0.042));
    });
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30, 100, 200, 0.5)';
    ctx.fill();
    ctx.restore();
  }

  function drawSweep() {
    const TRAIL = Math.PI * 0.5;
    const STEPS = 24;
    for (let i = 0; i < STEPS; i++) {
      const t0 = sweep - TRAIL * (1 - i / STEPS);
      const t1 = sweep - TRAIL * (1 - (i + 1) / STEPS);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.arc(CX, CY, R, t0, t1);
      ctx.closePath();
      ctx.fillStyle = `rgba(30, 100, 200, ${((i / STEPS) * 0.22).toFixed(3)})`;
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.lineTo(CX + Math.cos(sweep) * R, CY + Math.sin(sweep) * R);
    ctx.strokeStyle = 'rgba(30, 110, 210, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function drawBlips(ts) {
    INTERESTS.forEach((interest, i) => {
      const { x, y } = blipXY(interest);
      const age  = glowAt[i] !== undefined ? ts - glowAt[i] : Infinity;
      const glow = age < BLIP_FADE_MS ? Math.max(0, 1 - age / BLIP_FADE_MS) : 0;
      const baseAlpha = 0.38 + glow * 0.62;

      // 잔광 헤일로
      if (glow > 0) {
        const haloR = BLIP_R * (2.0 + glow * 1.5);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, haloR);
        grad.addColorStop(0, `rgba(80, 170, 255, ${(glow * 0.5).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(80, 170, 255, 0)');
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      // SVG 아이콘
      if (interest.iconImg) {
        ctx.save();
        ctx.globalAlpha = baseAlpha;
        ctx.drawImage(
          interest.iconImg,
          x - ICON_SIZE / 2,
          y - ICON_SIZE / 2,
          ICON_SIZE,
          ICON_SIZE
        );
        ctx.restore();
      }

      // 레이블
      const labelAlpha = 0.42 + glow * 0.58;
      ctx.save();
      ctx.font = `${glow > 0.3 ? '600' : '500'} ${W * 0.032}px -apple-system, sans-serif`;
      ctx.fillStyle = `rgba(26, 58, 92, ${labelAlpha.toFixed(3)})`;
      const onLeft = x < CX;
      ctx.textAlign = onLeft ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(interest.name, onLeft ? x - BLIP_R - 5 : x + BLIP_R + 5, y);
      ctx.restore();
    });
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = -1;
    INTERESTS.forEach((interest, i) => {
      const { x, y } = blipXY(interest);
      if (Math.hypot(mx - x, my - y) < BLIP_R * HIT_RADIUS_MULT) found = i;
    });

    if (found >= 0) {
      const b = INTERESTS[found];
      const { x, y } = blipXY(b);
      tooltip.textContent = b.desc;
      tooltip.style.display = 'block';
      if (x < CX) {
        tooltip.style.left  = 'auto';
        tooltip.style.right = (W - x + BLIP_R + 8) + 'px';
      } else {
        tooltip.style.right = 'auto';
        tooltip.style.left  = (x + BLIP_R + 8) + 'px';
      }
      tooltip.style.top = y + 'px';
    } else {
      tooltip.style.display = 'none';
    }
  }

  function debounce(fn, ms) {
    let t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
