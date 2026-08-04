import { useState } from 'react';

export default function SafeImage({ src, alt, className = '', width, height, loading = 'lazy', fetchPriority, decoding = 'async', objectFit = 'cover', objectPosition = 'center', ...props }) {
  const [failed, setFailed] = useState(false);
  const style = { objectFit, objectPosition, ...props.style };
  return (
    <span className={`safe-image ${failed ? 'safe-image--failed' : ''} ${className}`} style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}>
      {!failed && src ? <img src={src} alt={alt} width={width} height={height} loading={loading} fetchPriority={fetchPriority} decoding={decoding} style={style} onError={() => setFailed(true)} /> : null}
    </span>
  );
}
