export default function Loading({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="loading-state">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
