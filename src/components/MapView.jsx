import { useEffect, useRef } from 'react';

/**
 * Renders an OpenStreetMap tile layer via Leaflet.
 * Leaflet is loaded dynamically so it doesn't break SSR / Vite build.
 */
export default function MapView({ latitude, longitude, title }) {
  const containerRef  = useRef(null);
  const mapRef        = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      // Leaflet's default icon path breaks in Vite — fix it
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,  // less jarring on detail pages
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom SVG pin marker
      const pinIcon = L.divIcon({
        html: `
          <div style="
            width: 30px; height: 30px;
            background: #0A0A0A;
            border: 3px solid #FFFDF2;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 3px 12px rgba(0,0,0,0.35);
          "></div>`,
        iconSize:   [30, 30],
        iconAnchor: [15, 30],
        className:  '',
      });

      L.marker([latitude, longitude], { icon: pinIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600">${title}</div>
           <div style="font-family:'DM Mono',monospace;font-size:11px;color:#666;margin-top:2px">
             ${parseFloat(latitude).toFixed(6)}, ${parseFloat(longitude).toFixed(6)}
           </div>`,
          { offset: [0, -20], maxWidth: 220 }
        )
        .openPopup();

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, title]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden border border-black/10"
      style={{ height: '420px' }}
      role="img"
      aria-label={`Map showing location of ${title} at ${latitude}, ${longitude}`}
    />
  );
}
