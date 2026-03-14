/* ==========================================================================
   Airplane Cursor — 전방향 회전 + 연속 비행운 + 호버 손가락
   ========================================================================== */

(function () {
  "use strict";

  /* ── 동적 style 태그 (호버 시 손가락 커서 복원용)
        main.scss의 cursor:none !important보다 source order상 나중에 추가되므로
        동일 specificity(*)일 때 반드시 이김 → 가장 확실한 방법               ── */
  const cursorOverrideStyle = document.createElement("style");
  cursorOverrideStyle.id = "airplane-cursor-pointer-override";
  document.head.appendChild(cursorOverrideStyle);

  function setCursorPointer(on) {
    cursorOverrideStyle.textContent = on
      ? "*, *::before, *::after { cursor: pointer !important; }"
      : "";
  }

  /* ── 설정 ── */
  const IMG_SRC        = "/assets/cursor/airplane.png";
  const SIZE           = 40;      // 커서 크기 (px)
  const ROT_SMOOTH     = 0.09;    // 회전 lerp 계수
  const TRAIL_SPACING  = 5;       // 경로 포인트 추가 간격 (px)
  const TRAIL_LIFE     = 1400;    // 비행운 총 수명 (ms)

  const INTERACTIVE_SEL =
    "a, button, input, textarea, select, label, " +
    "[role='button'], [tabindex]:not([tabindex='-1'])";

  /* ── 상태 ── */
  let mouseX = -999, mouseY = -999;
  let lastPX = -999, lastPY = -999;
  let curAngle = 0, targetAngle = 0;
  let isMoving = false;
  let overInteractive = false;
  const path = []; // { x, y, t }

  /* ── DOM: 비행기 엘리먼트 ── */
  const plane = document.createElement("div");
  plane.id = "custom-airplane-cursor";
  Object.assign(plane.style, {
    position:        "fixed",
    top:             "0",
    left:            "0",
    width:           SIZE + "px",
    height:          SIZE + "px",
    pointerEvents:   "none",
    zIndex:          "999999",
    willChange:      "transform",
    transformOrigin: "center center",
    transition:      "opacity 0.12s",
  });
  const img = document.createElement("img");
  img.src = IMG_SRC;
  img.alt = "";
  Object.assign(img.style, { width: "100%", height: "100%", display: "block" });
  plane.appendChild(img);

  /* ── DOM: 비행운 캔버스 ── */
  const canvas = document.createElement("canvas");
  canvas.id = "airplane-contrail-canvas";
  Object.assign(canvas.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    pointerEvents: "none", zIndex: "999998",
  });

  document.body.appendChild(canvas);
  document.body.appendChild(plane);
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  /* ── 인터랙티브 호버 상태 적용 ── */
  function setInteractiveMode(on) {
    if (on === overInteractive) return;
    overInteractive = on;
    if (on) {
      plane.style.opacity = "0";
      setCursorPointer(true);   // 동적 style 태그로 손가락 커서 강제 적용
    } else {
      plane.style.opacity = "1";
      setCursorPointer(false);  // 손가락 커서 해제 → cursor:none으로 복귀
    }
  }

  /* ── 마우스 이벤트 ── */
  document.addEventListener("mousemove", function (e) {
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;
    const speed = Math.sqrt(dx * dx + dy * dy);

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (speed > 0.8) {
      isMoving = true;
      // atan2 기반 전방향 회전 (12시=머리 기준 +90° 보정)
      // 점대칭: 반대 방향이면 정확히 180° 반대 → 수학적으로 점대칭 성립
      const raw = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const delta = ((raw - targetAngle) % 360 + 540) % 360 - 180;
      targetAngle += delta; // 연속각도 (360° 점프 방지)
    } else {
      isMoving = false;
    }

    // elementFromPoint로 인터랙티브 요소 감지
    // pointer-events:none인 canvas/plane은 자동으로 투과됨
    const el = document.elementFromPoint(e.clientX, e.clientY);
    setInteractiveMode(!!(el && el.closest(INTERACTIVE_SEL)));
  });

  document.addEventListener("mouseleave", function () {
    plane.style.opacity = "0";
    setCursorPointer(false);
  });
  document.addEventListener("mouseenter", function () {
    if (!overInteractive) plane.style.opacity = "1";
  });

  /* ── 메인 루프 ── */
  function loop(now) {
    requestAnimationFrame(loop);

    /* 회전 lerp */
    curAngle += (targetAngle - curAngle) * ROT_SMOOTH;
    plane.style.transform =
      `translate(${mouseX - SIZE / 2}px, ${mouseY - SIZE / 2}px) rotate(${curAngle}deg)`;

    /* 경로 포인트 추가 */
    const d = Math.hypot(mouseX - lastPX, mouseY - lastPY);
    if (isMoving && !overInteractive && d >= TRAIL_SPACING) {
      path.push({ x: mouseX, y: mouseY, t: now });
      lastPX = mouseX;
      lastPY = mouseY;
    }

    /* 수명 지난 포인트 제거 */
    while (path.length > 0 && now - path[0].t > TRAIL_LIFE) {
      path.shift();
    }

    /* 캔버스 초기화 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (path.length < 2) return;

    /* 비행운 드로우: 세그먼트별로 나이에 따라 두께/투명도 변화
       - 오래된 세그먼트(꼬리쪽) → 넓고 흐림 (확산된 비행운)
       - 새로운 세그먼트(머리쪽) → 좁고 밝음 (막 생성된 응결 흔적)
       - lineWidth > TRAIL_SPACING 이므로 캡이 겹쳐 끊김 없이 연속 */
    ctx.lineCap    = "round";
    ctx.lineJoin   = "round";

    for (let i = 0; i < path.length - 1; i++) {
      const p0  = path[i];
      const p1  = path[i + 1];
      const age = now - p0.t;
      const tf  = Math.min(age / TRAIL_LIFE, 1); // 0=신선, 1=소멸 직전

      const a = 1 - tf; // 알파 기반값

      /* ① 외곽 확산 안개 (넓고 투명) */
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineWidth   = 10 + tf * 18;           // 점점 퍼짐
      ctx.strokeStyle = `rgba(200,220,255,${(a * 0.14).toFixed(3)})`;
      ctx.stroke();

      /* ② 중간 연기층 */
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineWidth   = 4 + tf * 8;
      ctx.strokeStyle = `rgba(220,235,255,${(a * 0.25).toFixed(3)})`;
      ctx.stroke();

      /* ③ 밝은 코어 (초반에만 뚜렷) */
      if (tf < 0.45) {
        const coreA = (1 - tf / 0.45) * 0.45;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineWidth   = 2;
        ctx.strokeStyle = `rgba(240,248,255,${coreA.toFixed(3)})`;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(loop);
})();
