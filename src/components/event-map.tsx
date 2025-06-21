interface EventMapProps {
  address: string;
}

export function EventMap({ address }: EventMapProps) {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    address
  )}&output=embed`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={mapSrc}
        title={`Map of ${address}`}
        aria-label={`Map of ${address}`}
      ></iframe>
    </div>
  );
}
