<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>VOD #<?php echo e($vod->id); ?></title>
  <style>
    /* Styles simples compatibles DomPDF */
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color:#111; }
    .muted { color:#666; }
    .box { border:1px solid #ddd; padding:10px; border-radius:6px; }
    ul { margin:0; padding-left:16px; }
    table { width:100%; border-collapse: collapse; }
    th, td { border:1px solid #eee; padding:6px; text-align:left; vertical-align: top; }
    img { max-width: 180px; max-height: 120px; object-fit: cover; margin: 6px 6px 0 0; border:1px solid #eee; }

    /* --- Bandeau top --- */
    .topbar { width:100%; color:#fff; background:#0a2a5a; border:1px solid #0a2a5a; }
    .topbar td { border:1px solid #0a2a5a; padding:10px 12px; }
    .topbar .logo  { width:22%; }
    .topbar .title { width:56%; text-align:center; font-weight:bold; }
    .topbar .meta  { width:22%; text-align:right; font-size:12px; line-height:1.5; }
    .title-main { font-size:16px; }
    .top-divider { height:2px; background:#0a2a5a; margin:6px 0 18px; border:none; }

    /* --- Titres de section (barres noires centrées) --- */
    .section-bar {
      background:#000; color:#fff; text-align:center;
      font-weight:bold; padding:6px 10px; margin:22px 0 10px;
    }
    .section-bar small { font-weight:normal; font-style:italic; }

    /* Grille infos (table pour dompdf) */
    .info-grid td{ border:1px solid #ddd; padding:8px 10px; }
    .w-33{ width:33.33%; }
    .w-50{ width:50%; }
  </style>
</head>
<body>
<?php
    // Date d’émission (création du VOD) ou aujourd’hui
    $emission = $vod->created_at
        ? \Carbon\Carbon::parse($vod->created_at)->format('d/m/Y')
        : now()->format('d/m/Y');

    // Date de la visite (robuste même si string)
    $dateVisite = '—';
    $d = $vod->getAttribute('date'); // peut être Carbon ou string
    if ($d instanceof \Carbon\CarbonInterface) {
        $dateVisite = $d->format('d/m/Y');
    } elseif (!empty($d)) {
        try { $dateVisite = \Carbon\Carbon::parse($d)->format('d/m/Y'); }
        catch (\Throwable $e) { $dateVisite = (string)$d; }
    }
?>

<!-- Bandeau top -->
<table class="topbar">
  <tr>
    <td class="logo">
      <!-- Mets ton logo ici -->
      <img src="<?php echo e(public_path('images/wh.png')); ?>" alt="Logo" style="max-height:36px; border:none;">
    </td>
    <td class="title">
      <div class="title-main">Formulaire</div>
      <div>« Visites Observation et ronde HSE »</div>
    </td>
    <td class="meta">
      <div>Date d’émission<br><strong><?php echo e($emission); ?></strong></div>
    </td>
  </tr>
</table>

<hr class="top-divider">

<!-- Informations -->
<div class="section-bar">Informations</div>
<table class="info-grid">
  <tr>
    <td class="w-33"><strong>Date :</strong> <?php echo e($dateVisite); ?></td>
    <td class="w-33"><strong>Projet :</strong> <?php echo e($vod->projet); ?></td>
    <td class="w-33"><strong>Activité :</strong> <?php echo e($vod->activite); ?></td>
  </tr>
  <tr>
    <td class="w-33"><strong>Observateur :</strong> <?php echo e($vod->observateur); ?></td>
    <td class="w-33">
      <strong>Personnes observées :</strong>
      <div class="muted">
        <?php $__currentLoopData = $vod->personnes_observees ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $p): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          • <?php echo e($p); ?><br>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </div>
    </td>
    <td class="w-33">
      <strong>Entreprise observée :</strong>
      <div class="muted">
        <?php $__currentLoopData = $vod->entreprise_observee ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $e): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          • <?php echo e($e); ?><br>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </div>
    </td>
  </tr>
</table>

<!-- Bonnes pratiques -->
<div class="section-bar">Bonnes pratiques</div>
<?php if(!empty($vod->pratiques)): ?>
  <table>
    <thead><tr><th>Description</th><th style="width:220px">Photo</th></tr></thead>
    <tbody>
      <?php $__currentLoopData = $vod->pratiques; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $p): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
          <td><?php echo e($p['text'] ?? ''); ?></td>
          <td>
            <?php if(!empty($p['photo'])): ?>
              <img src="<?php echo e(public_path('storage/' . $p['photo'])); ?>" style="max-width:200px; max-height:140px;">
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
  </table>
<?php else: ?>
  <div class="muted">Aucune.</div>
<?php endif; ?>

<!-- Comportements dangereux -->
<div class="section-bar">Comportements dangereux</div>
<?php if(!empty($vod->comportements)): ?>
  <table>
    <thead><tr><th>Type</th><th>Description</th><th style="width:220px">Photo</th></tr></thead>
    <tbody>
      <?php $__currentLoopData = $vod->comportements; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $c): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
          <td><?php echo e($c['type'] ?? ''); ?></td>
          <td><?php echo e($c['description'] ?? ''); ?></td>
          <td>
            <?php if(!empty($c['photo'])): ?>
              <img src="<?php echo e(public_path('storage/' . $c['photo'])); ?>" style="max-width:200px; max-height:140px;">
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
  </table>
<?php else: ?>
  <div class="muted">Aucun.</div>
<?php endif; ?>

<!-- Conditions dangereuses (avec sous-texte style capture) -->
<div class="section-bar">
  Conditions dangereuses
  <br><small>Cocher en cas de détection d'une ou plusieurs anomalies.</small>
</div>
<?php $conds = $vod->conditions ?? []; ?>
<?php if(!empty($conds)): ?>
  <ul>
    <?php $__currentLoopData = $conds; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $v): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <?php if($v): ?> <li><?php echo e($k); ?></li> <?php endif; ?>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </ul>
<?php else: ?>
  <div class="muted">Aucune.</div>
<?php endif; ?>

<!-- Actions correctives -->
<div class="section-bar">Actions correctives</div>
<?php $corr = $vod->correctives ?? []; ?>
<?php if(!empty($corr)): ?>
  <?php $__currentLoopData = $corr; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $fields): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <div class="box" style="margin-bottom:8px">
      <strong><?php echo e($k); ?></strong><br>
      <?php if(!empty($fields['action'])): ?> Action : <?php echo e($fields['action']); ?><br><?php endif; ?>
      <?php if(!empty($fields['responsable'])): ?> Responsable : <?php echo e($fields['responsable']); ?><br><?php endif; ?>
      <?php if(!empty($fields['statut'])): ?> Statut : <?php echo e($fields['statut']); ?><br><?php endif; ?>
      <?php if(!empty($fields['photo'])): ?>
        <img src="<?php echo e(public_path('storage/' . $fields['photo'])); ?>" style="max-width:220px; max-height:150px;">
      <?php endif; ?>
    </div>
  <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php else: ?>
  <div class="muted">Aucune.</div>
<?php endif; ?>

</body>
</html>
<?php /**PATH C:\Users\pc\OneDrive\Bureau\parkx\resources\views/vods/pdf.blade.php ENDPATH**/ ?>