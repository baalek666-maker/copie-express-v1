'use client';

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);

  let color, label, icon;
  if (pct >= 90) {
    color = 'bg-green-100 text-green-800 border-green-300';
    label = 'Fiable';
    icon = '✓';
  } else if (pct >= 70) {
    color = 'bg-amber-100 text-amber-800 border-amber-300';
    label = 'À vérifier';
    icon = '~';
  } else {
    color = 'bg-red-100 text-red-800 border-red-300';
    label = 'Incertain';
    icon = '?';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${color}`}
      title={`Fiabilité d'extraction : ${pct}% (${label})`}
    >
      <span>{icon}</span>
      <span>{pct}%</span>
    </span>
  );
}