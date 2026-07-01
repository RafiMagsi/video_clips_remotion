import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 2 — Mistake #1: Building Features Nobody Asked For
//  Visual: Feature counter rising, customer counter falling to 0,
//          button grid expanding while customer dots disappear
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const RED    = '#EF4444';
const GREEN  = '#10B981';

const FEATURE_LABELS = [
  'Dark Mode','CSV Export','Custom Themes','Analytics V2','API Keys',
  'Bulk Edit','Webhooks','Tags','Comments','Audit Log',
  'AI Summary','Zapier Sync','PDF Export','Multi-lang','2FA',
  'Custom Fields','Role Mgmt','White Label','Mobile App','SSO',
];

export const Slide2_Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  // Animated counters
  const featureCount = Math.round(interpolate(frame, [20, 190], [0, 20], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  const customerCount = Math.round(interpolate(frame, [50, 200], [1240, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));

  // Springs
  const badgeSp  = sp(frame, fps,  4, { stiffness: 70, damping: 16 });
  const h1Sp     = sp(frame, fps, 12, { stiffness: 68, damping: 14 });
  const h2Sp     = sp(frame, fps, 24, { stiffness: 68, damping: 14 });
  const subSp    = sp(frame, fps, 38, { stiffness: 65, damping: 14 });
  const statsSp  = sp(frame, fps, 52, { stiffness: 55, damping: 14 });
  const gridSp   = sp(frame, fps, 72, { stiffness: 50, damping: 14 });

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── MISTAKE #1 badge ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 192, left: SAFE_H,
        opacity: interpolate(badgeSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(badgeSp, [0, 1], [14, 0])}px)`,
        display: 'inline-flex', alignItems: 'center',
        background: 'rgba(255,107,43,0.12)', border: '1.5px solid rgba(255,107,43,0.32)',
        borderRadius: 20, padding: '7px 18px',
      }}>
        <span style={{ fontSize: 16, fontWeight: 800, fontFamily: FONT_MONO, color: ORANGE, letterSpacing: '1.5px' }}>
          MISTAKE #1
        </span>
      </div>

      {/* ── "Building Features" ──────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 258, left: SAFE_H,
        opacity: interpolate(h1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h1Sp, [0, 1], [28, 0])}px)`,
        filter: blurFade(h1Sp, 12),
      }}>
        <span style={{ fontSize: 88, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-3px', lineHeight: 1 }}>
          Building Features
        </span>
      </div>

      {/* ── "Nobody Asked For" ───────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 352, left: SAFE_H,
        opacity: interpolate(h2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h2Sp, [0, 1], [24, 0])}px)`,
        filter: blurFade(h2Sp, 10),
      }}>
        <span style={{
          fontSize: 88, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-3px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFB040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          Nobody Asked For
        </span>
      </div>

      {/* ── "More features ≠ More customers" ─────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 468, left: SAFE_H,
        opacity: interpolate(subSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(subSp, [0, 1], [18, 0])}px)`,
        filter: blurFade(subSp, 8),
      }}>
        <span style={{ fontSize: 40, fontWeight: 600, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.50)', lineHeight: 1.4 }}>
          More features{' '}
          <span style={{ fontWeight: 900, color: RED }}>≠</span>
          {' '}More customers
        </span>
      </div>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 548, left: SAFE_H, right: SAFE_H,
        display: 'flex', gap: 16,
        opacity: interpolate(statsSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(statsSp, [0, 1], [28, 0])}px)`,
        filter: blurFade(statsSp, 8),
      }}>
        {/* Features built */}
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.88)', borderRadius: 18,
          padding: '20px 18px', textAlign: 'center',
          border: '2px solid rgba(255,107,43,0.20)',
          boxShadow: '0 4px 20px rgba(255,107,43,0.08)',
        }}>
          <div style={{ fontSize: 13, fontFamily: FONT_MONO, color: 'rgba(0,0,0,0.42)', letterSpacing: '1px', marginBottom: 6 }}>
            FEATURES BUILT
          </div>
          <div style={{ fontSize: 68, fontWeight: 900, fontFamily: FONT_HEAD, color: ORANGE, lineHeight: 1 }}>
            {featureCount}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_MONO, color: ORANGE, marginTop: 4 }}>↑ RISING</div>
        </div>

        {/* Customers won */}
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.88)', borderRadius: 18,
          padding: '20px 18px', textAlign: 'center',
          border: `2px solid ${customerCount === 0 ? `${RED}40` : 'rgba(16,185,129,0.20)'}`,
          boxShadow: `0 4px 20px ${customerCount === 0 ? `${RED}15` : 'rgba(16,185,129,0.08)'}`,
        }}>
          <div style={{ fontSize: 13, fontFamily: FONT_MONO, color: 'rgba(0,0,0,0.42)', letterSpacing: '1px', marginBottom: 6 }}>
            CUSTOMERS WON
          </div>
          <div style={{
            fontSize: 68, fontWeight: 900, fontFamily: FONT_HEAD, lineHeight: 1,
            color: customerCount === 0 ? RED : GREEN,
          }}>
            {customerCount.toLocaleString()}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_MONO, color: customerCount === 0 ? RED : GREEN, marginTop: 4 }}>
            {customerCount === 0 ? '✗ ZERO' : '↓ FALLING'}
          </div>
        </div>
      </div>

      {/* ── Feature button grid ───────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 766, left: SAFE_H, right: SAFE_H,
        background: 'rgba(255,255,255,0.82)',
        borderRadius: 20, padding: '16px 18px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        opacity: interpolate(gridSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(gridSp, [0, 1], [24, 0])}px)`,
      }}>
        <div style={{ fontSize: 12, fontFamily: FONT_MONO, color: 'rgba(0,0,0,0.38)', letterSpacing: '1px', marginBottom: 12 }}>
          PRODUCT ROADMAP — SPRINT 47
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FEATURE_LABELS.slice(0, featureCount).map((label, i) => (
            <div key={i} style={{
              background: `rgba(255,107,43,${0.08 + (i % 3) * 0.04})`,
              border: '1px solid rgba(255,107,43,0.24)',
              borderRadius: 10, padding: '6px 12px',
              fontSize: 13, fontWeight: 700, fontFamily: FONT_HEAD,
              color: ORANGE, letterSpacing: '0.2px',
            }}>
              {label}
            </div>
          ))}
          {featureCount > 0 && (
            <div style={{
              background: 'rgba(239,68,68,0.10)',
              border: '1px solid rgba(239,68,68,0.24)',
              borderRadius: 10, padding: '6px 12px',
              fontSize: 13, fontWeight: 700, fontFamily: FONT_HEAD,
              color: RED, letterSpacing: '0.2px', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              + more loading...
            </div>
          )}
        </div>
      </div>

    </SceneCanvas>
  );
};
