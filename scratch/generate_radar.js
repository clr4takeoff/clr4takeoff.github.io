const fs = require('fs');

const W = 600;
const CX = W / 2;
const CY = W / 2;
const R = W * 0.43;

const INTERESTS = [
    { name: 'Aviation', desc: '비행기 조종 및 관제', northDeg: 338, dist: 0.55, iconPath: 'M12 1 L9 9 L1 11 L9 13 L9 20 L11 19 L12 17 L13 19 L15 20 L15 13 L23 11 L15 9 Z' },
    { name: 'Trip', desc: '새로운 곳 탐험하기', northDeg: 32, dist: 0.70, iconPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' },
    { name: 'HCI', desc: '인간-컴퓨터 상호작용', northDeg: 102, dist: 0.52, iconPath: 'M20 3H4C2.9 3 2 3.9 2 5v10c0 1.1.9 2 2 2h5v2H8v2h8v-2h-1v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H4V5h16v10z' },
    { name: 'Productivity', desc: '효율적으로 살기', northDeg: 152, dist: 0.63, iconPath: 'M13 2L6 14h5v8l7-12h-5z' },
    { name: 'Human', desc: '사람에 대한 관심', northDeg: 208, dist: 0.62, iconPath: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
    { name: 'Language', desc: '언어와 소통', northDeg: 257, dist: 0.56, iconPath: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' },
    { name: 'Music', desc: '음악 듣고 만들기', northDeg: 296, dist: 0.44, iconPath: 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z' },
    { name: 'Journal', desc: '기록하기', northDeg: 68, dist: 0.60, iconPath: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
];

function toCanvasAngle(northDeg) {
  return ((northDeg - 90) * Math.PI) / 180;
}

function generateSVG(theme) {
  const isDark = theme === 'dark';
  
  const bg = 'transparent';
  const gridSolid = isDark ? 'rgba(140, 190, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)';
  const gridDash = isDark ? 'rgba(140, 190, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const textDir = isDark ? 'rgba(140, 190, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)';
  const textLabel = isDark ? 'rgba(230, 240, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)';
  const dotCenter = isDark ? 'rgba(140, 190, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)';
  const sweepBg = isDark ? 'rgba(100, 170, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)';
  const sweepLine = isDark ? 'rgba(100, 170, 255, 0.8)' : 'rgba(0, 0, 0, 0.3)';
  const iconColor = isDark ? '#6eb4ff' : 'rgba(0, 0, 0, 0.7)';
  const glowColor = isDark ? '#6eb4ff' : 'rgba(0, 0, 0, 0.15)';
  const glowOpacity = isDark ? 0.5 : 1;

  let out = [];
  out.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + W + '" width="100%" height="100%" style="background-color: transparent; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">');

  // Define gradients
  out.push('<defs><radialGradient id="glow" cx="50%" cy="50%" r="50%">');
  out.push('<stop offset="0%" stop-color="' + glowColor + '" stop-opacity="' + glowOpacity + '" />');
  out.push('<stop offset="100%" stop-color="' + glowColor + '" stop-opacity="0" />');
  out.push('</radialGradient></defs>');

  // Grid
  out.push('<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="none" stroke="' + gridSolid + '" stroke-width="1.2" />');
  out.push('<circle cx="' + CX + '" cy="' + CY + '" r="' + (R*0.66) + '" fill="none" stroke="' + gridDash + '" stroke-width="0.8" stroke-dasharray="4 7" />');
  out.push('<circle cx="' + CX + '" cy="' + CY + '" r="' + (R*0.33) + '" fill="none" stroke="' + gridDash + '" stroke-width="0.8" stroke-dasharray="4 7" />');

  // Axes
  out.push('<line x1="' + (CX - R) + '" y1="' + CY + '" x2="' + (CX + R) + '" y2="' + CY + '" stroke="' + gridDash + '" stroke-width="0.8" stroke-dasharray="4 7" />');
  out.push('<line x1="' + CX + '" y1="' + (CY - R) + '" x2="' + CX + '" y2="' + (CY + R) + '" stroke="' + gridDash + '" stroke-width="0.8" stroke-dasharray="4 7" />');

  // Directions
  out.push('<text x="' + CX + '" y="' + (CY - R - 20) + '" font-size="16" font-weight="600" fill="' + textDir + '" text-anchor="middle" dominant-baseline="middle">N</text>');
  out.push('<text x="' + (CX + R + 20) + '" y="' + CY + '" font-size="16" font-weight="600" fill="' + textDir + '" text-anchor="middle" dominant-baseline="middle">E</text>');
  out.push('<text x="' + CX + '" y="' + (CY + R + 20) + '" font-size="16" font-weight="600" fill="' + textDir + '" text-anchor="middle" dominant-baseline="middle">S</text>');
  out.push('<text x="' + (CX - R - 20) + '" y="' + CY + '" font-size="16" font-weight="600" fill="' + textDir + '" text-anchor="middle" dominant-baseline="middle">W</text>');

  // Center
  out.push('<circle cx="' + CX + '" cy="' + CY + '" r="4" fill="' + dotCenter + '" />');

  // Sweep
  let sweepX = CX - R * Math.sin(Math.PI/3);
  let sweepY = CY - R * Math.cos(Math.PI/3);
  out.push('<path d="M ' + CX + ' ' + CY + ' L ' + CX + ' ' + (CY - R) + ' A ' + R + ' ' + R + ' 0 0 0 ' + sweepX + ' ' + sweepY + ' Z" fill="' + sweepBg + '" />');
  out.push('<line x1="' + CX + '" y1="' + CY + '" x2="' + CX + '" y2="' + (CY - R) + '" stroke="' + sweepLine + '" stroke-width="1.5" />');

  // Blips
  INTERESTS.forEach((interest) => {
    const a = toCanvasAngle(interest.northDeg);
    const x = CX + Math.cos(a) * interest.dist * R;
    const y = CY + Math.sin(a) * interest.dist * R;
    const onLeft = x < CX;

    out.push('<circle cx="' + x + '" cy="' + y + '" r="22" fill="url(#glow)" />');
    
    const iconSize = 18;
    const scale = iconSize / 24;
    const transX = x - iconSize / 2;
    const transY = y - iconSize / 2;
    
    out.push('<g transform="translate(' + transX + ', ' + transY + ') scale(' + scale + ')">');
    out.push('<path d="' + interest.iconPath + '" fill="' + iconColor + '" />');
    out.push('</g>');

    const labelX = onLeft ? x - 16 : x + 16;
    const alignClass = onLeft ? 'end' : 'start';
    out.push('<text x="' + labelX + '" y="' + y + '" font-size="18" font-weight="600" fill="' + textLabel + '" text-anchor="' + alignClass + '" dominant-baseline="middle">' + interest.name + '</text>');
  });

  out.push('</svg>');
  
  const path = '/Users/clr/Desktop/ACTIV/devlog/clr4takeoff.github.io/assets/images/interest_radar_' + theme + '.svg';
  fs.writeFileSync(path, out.join('\\n'));
  console.log('Saved ' + path);
}

generateSVG('light');
generateSVG('dark');
