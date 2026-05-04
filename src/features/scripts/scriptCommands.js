/**
 * Commandes simulées affichées dans le terminal pour chaque script.
 * Format: { type, text }
 *   type: 'cmd' (préfixe $), 'out' (sortie standard), 'ok' (✓ vert),
 *         'warn' (jaune), 'err' (rouge), 'info' (cyan), 'blank'
 */

const FCFA = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

export function buildCommands(slug, params, result) {
  const r = result?.result || {}

  switch (slug) {
    case 'facture-pdf': {
      const client = params.client || 'Client'
      const montant = params.montant || 0
      const email = params.email
      return [
        { type: 'cmd', text: `cd ~/akili/scripts/facturation` },
        { type: 'cmd', text: `php generate_invoice.php --client="${client}" --montant=${montant}` },
        { type: 'info', text: `[1/4] Initialisation du moteur PDF (TCPDF v6.6)...` },
        { type: 'out',  text: `       Loading template: invoice_default.html.twig` },
        { type: 'info', text: `[2/4] Récupération des données client...` },
        { type: 'out',  text: `       → ${client} <${email || 'no-email'}>` },
        { type: 'info', text: `[3/4] Calcul TVA + génération du PDF...` },
        { type: 'out',  text: `       Numéro: ${r.numero_facture || 'AK-XXXX'}` },
        { type: 'out',  text: `       Montant: ${FCFA(montant)}` },
        { type: 'info', text: `[4/4] Écriture sur disque...` },
        { type: 'ok',   text: `✓ ${r.file || 'facture.pdf'} (${r.file_size || '? KB'})` },
        ...(email ? [
          { type: 'cmd', text: `mail -s "Votre facture" -a ${r.file || 'facture.pdf'} ${email}` },
          { type: 'ok',  text: `✓ Email envoyé à ${email}` },
        ] : [
          { type: 'warn', text: `⚠ Aucun email fourni — envoi désactivé` },
        ]),
      ]
    }

    case 'facture-relance': {
      const client = params.client || 'Client'
      const email = params.email || 'client@email.com'
      return [
        { type: 'cmd', text: `php relance.php --client="${client}" --email=${email}` },
        { type: 'info', text: `Calcul du retard...` },
        { type: 'out',  text: `       Jours de retard: ${r.jours_retard ?? '?'}` },
        { type: 'out',  text: `       Type de relance: ${r.type_relance || 'rappel'}` },
        { type: 'info', text: `Génération du courrier...` },
        { type: 'cmd', text: `mail -s "Rappel paiement" ${email}` },
        { type: 'ok',   text: `✓ Email envoyé — ${r.montant_du || ''}` },
      ]
    }

    case 'devis-auto': {
      const client = params.client || 'Client'
      return [
        { type: 'cmd', text: `php devis.php --client="${client}" --remise=${params.remise || 0}` },
        { type: 'info', text: `[1/3] Construction du devis...` },
        { type: 'out',  text: `       Numéro: ${r.numero_devis || 'DV-XXXX'}` },
        { type: 'out',  text: `       Montant HT: ${r.montant_ht || ''}` },
        { type: 'info', text: `[2/3] Application remise ${r.remise_appliquee || '0%'}...` },
        { type: 'out',  text: `       Montant final: ${r.montant_final || ''}` },
        { type: 'info', text: `[3/3] Export PDF...` },
        { type: 'ok',   text: `✓ ${r.file || 'devis.pdf'} (${r.file_size || ''}) — valable ${r.validite || '30j'}` },
      ]
    }

    case 'renommage-lot': {
      const dossier = params.dossier || '~/Documents'
      const pattern = params.pattern || '{date}_{n}'
      return [
        { type: 'cmd', text: `cd "${dossier}"` },
        { type: 'cmd', text: `python rename_batch.py --pattern="${pattern}"` },
        { type: 'info', text: `Scan du dossier...` },
        { type: 'out',  text: `       ${r.fichiers_renommes || 0} fichiers détectés` },
        { type: 'info', text: `Application du pattern...` },
        ...(r.exemples || []).map(ex => ({ type: 'out', text: `       → ${ex}` })),
        { type: 'ok',   text: `✓ ${r.fichiers_renommes || 0} fichiers renommés` },
      ]
    }

    case 'compression-images': {
      const dossier = params.dossier || '~/Images'
      return [
        { type: 'cmd', text: `cd "${dossier}"` },
        { type: 'cmd', text: `node compress.js --quality=${params.qualite || 85} --max-width=${params.largeur_max || 1200} --format=${params.format || 'webp'}` },
        { type: 'info', text: `Analyse des images...` },
        { type: 'out',  text: `       ${r.images_compressees || 0} images trouvées (${r.taille_avant || '? MB'})` },
        { type: 'info', text: `Compression en cours...` },
        { type: 'out',  text: `       [████████████░░░░] 75%` },
        { type: 'out',  text: `       [████████████████] 100%` },
        { type: 'ok',   text: `✓ ${r.images_compressees || 0} images → ${r.taille_apres || '? MB'}` },
        { type: 'ok',   text: `✓ Économie: ${r.economie || ''}` },
      ]
    }

    case 'tri-dossiers': {
      const dossier = params.dossier || '~/Downloads'
      const cats = r.categories_creees || {}
      return [
        { type: 'cmd', text: `cd "${dossier}"` },
        { type: 'cmd', text: `python sort_files.py` },
        { type: 'info', text: `Analyse MIME types...` },
        { type: 'out',  text: `       ${r.fichiers_tries || 0} fichiers à trier` },
        { type: 'info', text: `Création des sous-dossiers...` },
        ...Object.entries(cats).map(([k, n]) => ({ type: 'out', text: `       mkdir ${k}/  → ${n} fichiers` })),
        { type: 'ok',   text: `✓ ${r.fichiers_tries || 0} fichiers triés` },
      ]
    }

    case 'email-campagne': {
      return [
        { type: 'cmd', text: `node campaign.js --list=${params.liste || 'contacts.csv'} --subject="${params.sujet || ''}"` },
        { type: 'info', text: `Lecture du fichier de contacts...` },
        { type: 'out',  text: `       ${r.total_destinataires || 0} destinataires chargés` },
        { type: 'info', text: `Connexion SMTP...` },
        { type: 'out',  text: `       Connected: smtp.akili.dev:587 (TLS)` },
        { type: 'info', text: `Envoi en cours...` },
        { type: 'out',  text: `       [████████████████] 100%` },
        { type: 'ok',   text: `✓ ${r.emails_envoyes || 0} emails envoyés` },
        ...(r.emails_echoues > 0 ? [{ type: 'warn', text: `⚠ ${r.emails_echoues} échecs` }] : []),
      ]
    }

    case 'email-reponse-auto': {
      return [
        { type: 'cmd', text: `python autoreply.py --keywords="${params.mots_cles || ''}"` },
        { type: 'info', text: `Configuration des règles IMAP...` },
        ...(r.mots_cles_actifs || []).map(k => ({ type: 'out', text: `       + filter: "${k}"` })),
        { type: 'ok',   text: `✓ Réponse automatique active (${r.nombre_mots_cles || 0} mots-clés)` },
      ]
    }

    case 'rapport-csv': {
      return [
        { type: 'cmd', text: `php export_report.php --periode="${params.periode || ''}" --format=${params.format || 'csv'}` },
        { type: 'info', text: `Requête SQL en cours...` },
        { type: 'out',  text: `       SELECT * FROM script_runs WHERE created_at >= ...` },
        { type: 'out',  text: `       ${r.lignes || 0} lignes retournées` },
        { type: 'info', text: `Écriture du fichier...` },
        { type: 'ok',   text: `✓ ${r.file || 'rapport.csv'} (${r.file_size || ''})` },
      ]
    }

    case 'rapport-hebdo': {
      return [
        { type: 'cmd', text: `php weekly_report.php --to=${params.email || ''}` },
        { type: 'info', text: `Agrégation des stats de la semaine...` },
        { type: 'out',  text: `       Scripts exécutés: ${r.contenu?.scripts_executes || 0}` },
        { type: 'out',  text: `       Taux de succès: ${r.contenu?.taux_succes || ''}` },
        { type: 'out',  text: `       Heures économisées: ${r.contenu?.heures_economisees || ''}` },
        { type: 'info', text: `Génération du HTML + envoi SMTP...` },
        { type: 'ok',   text: `✓ Rapport envoyé à ${params.email || ''}` },
      ]
    }

    case 'backup-drive': {
      return [
        { type: 'cmd', text: `rclone sync "${params.source || ''}" gdrive:"${params.destination || ''}"${params.compression ? ' --compress' : ''}` },
        { type: 'info', text: `Connexion à Google Drive (OAuth)...` },
        { type: 'out',  text: `       Authenticated as akili-backup@google.com` },
        { type: 'info', text: `Upload en cours...` },
        { type: 'out',  text: `       ${r.fichiers_sauvegardes || 0} fichiers — ${r.taille_totale || ''}` },
        { type: 'out',  text: `       [████████████████] 100% • ${r.duree_upload || ''}` },
        { type: 'ok',   text: `✓ Backup ${r.version || ''} → ${r.destination_drive || ''}` },
      ]
    }

    case 'sync-dossiers': {
      return [
        { type: 'cmd', text: `rsync -av${params.bidirectionnel ? 'u' : ''} "${params.source || ''}" "${params.destination || ''}"` },
        { type: 'info', text: `Comparaison des arborescences...` },
        { type: 'out',  text: `       ${r.ajoutes || 0} ajout(s), ${r.modifies || 0} modif(s), ${r.supprimes || 0} suppr.` },
        { type: 'info', text: `Synchronisation...` },
        { type: 'ok',   text: `✓ ${r.fichiers_synchronises || 0} fichiers synchronisés (${r.mode || ''})` },
      ]
    }

    default:
      return [
        { type: 'cmd', text: `run ${slug}` },
        { type: 'info', text: `Exécution du script...` },
        { type: 'ok',   text: `✓ Terminé` },
      ]
    }
}
