import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Copie Express — 90 copies en 30 secondes.';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #FFF5F0 0%, #FFFFFF 100%)',
          padding: '60px',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '700px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#E85D3D',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 800,
              }}
            >
              C
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }}>Copie Express</div>
          </div>
          <div style={{ fontSize: '52px', fontWeight: 800, color: '#1A1A1A', lineHeight: 1.1 }}>
            90 copies en
            <br />
            30 secondes.
          </div>
          <div style={{ fontSize: '24px', color: '#666', marginTop: '20px' }}>
            Pour les profs qui ont mieux à faire.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '24px',
            color: '#E85D3D',
            fontWeight: 600,
          }}
        >
          <div>✓ Photo depuis ton canapé</div>
          <div>✓ Compatible SACoche & Pronote</div>
          <div>✓ RGPD by design</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
