import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Trooka';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          backgroundColor: '#0a0a0a',
          color: 'white',
          borderTop: '20px solid #a855f7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <svg viewBox="0 0 24 24" width="220" height="220" fill="none" style={{ marginRight: '-10px', marginTop: '10px' }}>
            <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="#a855f7" />
          </svg>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: '0.02em', display: 'flex', alignItems: 'flex-end' }}>
            ROOKA
          </div>
        </div>
        <div style={{ fontSize: 42, color: '#a3a3a3', marginTop: '20px', fontWeight: 500 }}>
          Conectando Você às Melhores Ofertas
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
