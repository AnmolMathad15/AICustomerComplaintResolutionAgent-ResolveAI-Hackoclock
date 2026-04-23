export function BackgroundAmbient() {
  const logoUrl = `${import.meta.env.BASE_URL}resolveai-logo.png`;
  return (
    <div className="bg-ambient" aria-hidden>
      <img src={logoUrl} alt="" className="watermark" />
      <div className="orb orb-cyan" />
      <div className="orb orb-purple" />
      <div className="orb orb-pink" />
      <div className="grid-overlay" />
    </div>
  );
}
