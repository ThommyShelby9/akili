-- Seed: Bibliothèque de scripts Akili (10-15 scripts prêts à l'emploi)
INSERT INTO scripts (slug, name, description, category, params_schema) VALUES

-- Facturation
('facture-pdf', 'Génération de facture PDF', 'Génère une facture PDF professionnelle à partir des paramètres fournis et l''envoie par email au client.', 'facturation', '{"required": ["client", "montant"], "properties": {"client": {"type": "string", "label": "Nom du client"}, "montant": {"type": "number", "label": "Montant (FCFA)"}, "devise": {"type": "string", "label": "Devise", "default": "FCFA"}, "email": {"type": "string", "label": "Email client"}}}'),

('facture-relance', 'Relance de facture impayée', 'Envoie un email de relance pour les factures en retard de paiement.', 'facturation', '{"required": ["client", "email", "montant", "date_echeance"], "properties": {"client": {"type": "string", "label": "Nom du client"}, "email": {"type": "string", "label": "Email client"}, "montant": {"type": "number", "label": "Montant dû"}, "date_echeance": {"type": "string", "label": "Date échéance"}}}'),

('devis-auto', 'Génération de devis', 'Crée un devis personnalisé en PDF à partir d''un template et des données client.', 'facturation', '{"required": ["client", "prestations"], "properties": {"client": {"type": "string", "label": "Nom du client"}, "prestations": {"type": "string", "label": "Liste des prestations"}, "remise": {"type": "number", "label": "Remise (%)", "default": 0}}}'),

-- Fichiers
('renommage-lot', 'Renommage de fichiers en lot', 'Renomme tous les fichiers d''un dossier selon une convention de nommage définie.', 'fichiers', '{"required": ["dossier", "pattern"], "properties": {"dossier": {"type": "string", "label": "Dossier source"}, "pattern": {"type": "string", "label": "Pattern de renommage (ex: {client}_{date}_{n})"}}}'),

('compression-images', 'Compression d''images', 'Compresse et redimensionne les images d''un dossier en conservant la qualité.', 'fichiers', '{"required": ["dossier"], "properties": {"dossier": {"type": "string", "label": "Dossier source"}, "qualite": {"type": "number", "label": "Qualité (%)", "default": 85}, "largeur_max": {"type": "number", "label": "Largeur max (px)", "default": 1200}, "format": {"type": "string", "label": "Format sortie", "default": "webp"}}}'),

('tri-dossiers', 'Tri automatique de fichiers', 'Organise les fichiers d''un dossier en sous-dossiers par type (images, docs, vidéos, etc).', 'fichiers', '{"required": ["dossier"], "properties": {"dossier": {"type": "string", "label": "Dossier à trier"}}}'),

-- Emails
('email-campagne', 'Campagne email', 'Envoie un email personnalisé à une liste de destinataires depuis un fichier CSV.', 'emails', '{"required": ["sujet", "template", "liste"], "properties": {"sujet": {"type": "string", "label": "Sujet de l''email"}, "template": {"type": "string", "label": "Corps du message (supporte {nom}, {email})"}, "liste": {"type": "string", "label": "Fichier CSV (nom, email)"}}}'),

('email-reponse-auto', 'Réponse automatique', 'Configure une réponse automatique pour les emails entrants contenant certains mots-clés.', 'emails', '{"required": ["mots_cles", "reponse"], "properties": {"mots_cles": {"type": "string", "label": "Mots-clés (séparés par virgule)"}, "reponse": {"type": "string", "label": "Message de réponse automatique"}}}'),

-- Rapports
('rapport-csv', 'Export rapport CSV', 'Génère un rapport CSV à partir des données d''activité sur une période donnée.', 'rapports', '{"required": ["periode"], "properties": {"periode": {"type": "string", "label": "Période (ex: avril-2026)"}, "format": {"type": "string", "label": "Format", "default": "csv"}}}'),

('rapport-hebdo', 'Rapport hebdomadaire', 'Génère un résumé d''activité de la semaine et l''envoie par email.', 'rapports', '{"required": ["email"], "properties": {"email": {"type": "string", "label": "Email destinataire"}, "inclure_stats": {"type": "boolean", "label": "Inclure statistiques", "default": true}}}'),

-- Stockage
('backup-drive', 'Sauvegarde Google Drive', 'Sauvegarde un dossier local vers Google Drive avec versioning.', 'stockage', '{"required": ["source", "destination"], "properties": {"source": {"type": "string", "label": "Dossier local"}, "destination": {"type": "string", "label": "Dossier Drive"}, "compression": {"type": "boolean", "label": "Compresser avant upload", "default": false}}}'),

('sync-dossiers', 'Synchronisation de dossiers', 'Synchronise deux dossiers en gardant la version la plus récente de chaque fichier.', 'stockage', '{"required": ["source", "destination"], "properties": {"source": {"type": "string", "label": "Dossier source"}, "destination": {"type": "string", "label": "Dossier destination"}, "bidirectionnel": {"type": "boolean", "label": "Sync bidirectionnelle", "default": false}}}');
