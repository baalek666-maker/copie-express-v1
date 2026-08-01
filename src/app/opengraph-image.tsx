import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export const alt = 'Copie Express — Redeviens un prof. Pas une machine à cliquer.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8DC 50%, #FFFFFF 100%)',
          fontFamily: 'system-ui',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Badge top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '999px',
            background: '#E85D3D20',
            color: '#E85D3D',
            fontSize: '22px',
            fontWeight: 600,
            marginBottom: '40px',
          }}
        >
          ★ 10 copies gratuites, sans carte bancaire
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '84px',
            fontWeight: 800,
            color: '#1A1A1A',
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: '24px',
            maxWidth: '1000px',
          }}
        >
          Redeviens un prof.
        </div>

        <div
          style={{
            fontSize: '76px',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#E85D3D',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '40px',
            maxWidth: '1000px',
          }}
        >
          Pas une machine à cliquer.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            color: '#666',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.3,
            marginBottom: '100px',
          }}
        >
          Brevet blanc, bac blanc, contrôles — 90 copies en 30 secondes.
        </div>

        {/* Logo bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '28px',
            fontWeight: 700,
            color: '#1A1A1A',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: '#E85D3D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 800,
            }}
          >
            C
          </div>
          Copie Express
        </div>
      </div>
    ),
    { ...size }
  );
}
