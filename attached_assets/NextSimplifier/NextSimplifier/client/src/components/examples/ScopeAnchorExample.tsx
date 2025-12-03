import ScopeAnchor from "../passport/ScopeAnchor";

export default function ScopeAnchorExample() {
  return (
    <div className="p-6 bg-gameforge-dark min-h-[200px]">
      <ScopeAnchor
        genre="Action RPG"
        platform="PC / Web"
        status="In Development"
        timeline="Q2 2025"
      />
    </div>
  );
}
