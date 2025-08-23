<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Statistiques HSE – Rapport #{{ $report->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color:#111; }
        h1 { font-size: 18px; margin: 0 0 8px }
        h2 { font-size: 14px; margin: 16px 0 6px }
        table { width:100%; border-collapse: collapse; margin: 8px 0 }
        th, td { border:1px solid #ccc; padding:6px; text-align:left }
        small { color:#666 }
    </style>
</head>
<body>
    <h1>Rapport Statistiques HSE</h1>
    <small>Date d’émission: {{ $issuedAt }}</small>

    <h2>Indicateurs</h2>
    <table>
        <tr><th>TRIR</th><td>{{ number_format($report->trir, 2) }}</td></tr>
        <tr><th>LTIR</th><td>{{ number_format($report->ltir, 2) }}</td></tr>
        <tr><th>DART</th><td>{{ number_format($report->dart, 2) }}</td></tr>
        <tr><th>Heures totales</th><td>{{ $report->total_hours }}</td></tr>
    </table>

    <h2>Récapitulatif (extrait)</h2>
    <table>
        <tr><th>Accident mortel</th><td>{{ data_get($payload, 'accidents.mortel', 0) }}</td></tr>
        <tr><th>Accident avec arrêt</th><td>{{ data_get($payload, 'accidents.avecArret', 0) }}</td></tr>
        <tr><th>Soins médicaux</th><td>{{ data_get($payload, 'accidents.soinsMedicaux', 0) }}</td></tr>
        <tr><th>Restriction temporaire</th><td>{{ data_get($payload, 'accidents.restrictionTemp', 0) }}</td></tr>
        <tr><th>Heures normales</th><td>{{ data_get($payload, 'personnel.heuresNormales', 0) }}</td></tr>
        <tr><th>Heures supplémentaires</th><td>{{ data_get($payload, 'personnel.heuresSup', 0) }}</td></tr>
    </table>

    <small>PDF généré par ParkX.</small>
</body>
</html>
