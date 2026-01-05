// =================== DONNÉES ET VARIABLES GLOBALES ===================
let etudiants = [
    { id: 1, Nom: "Hamadellah", Prenom: "Othmane", groupe: "G1" },
    { id: 2, Nom: "Errachid", Prenom: "Youssef", groupe: "G2" },
    { id: 3, Nom: "Aqras", Prenom: "Mohamed", groupe: "G3" },
    { id: 4, Nom: "Dramé", Prenom: "Fadal", groupe: "G4" }
];

let etudiantASupprimer = null;
let etudiantAModifier = null;
let etudiantConnecte = null;
let statsChart = null;

// =================== INITIALISATION ===================
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé - Initialisation...");
    chargerDonnees();
    initialiserAffichage();
    configurerTousLesBoutons();
    configurerNavigation();
    configurerBoutonsGlobaux();
    
    // Afficher la section tableau par défaut
    afficherSection('section-tableau');
});

// =================== GESTION DES SECTIONS ===================
function afficherSection(sectionId) {
    console.log("Afficher section:", sectionId);
    
    // Cacher toutes les sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Cacher toutes les modales
    document.querySelectorAll('.modal-section').forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Afficher la section demandée
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        window.scrollTo(0, 0);
        
        // Rafraîchir le contenu si nécessaire
        switch(sectionId) {
            case 'section-tableau':
                afficherTableauEtudiants();
                break;
            case 'section-presence':
                afficherTableauPresence();
                break;
            case 'section-historique':
                afficherHistoriqueReel();
                break;
            case 'section-dashboard':
                if (etudiantConnecte) {
                    mettreAJourDashboard();
                }
                break;
            case 'section-profil':
                if (etudiantConnecte) {
                    mettreAJourProfil();
                }
                break;
            case 'section-statistiques':
                if (etudiantConnecte) {
                    calculerEtAfficherStatistiques();
                }
                break;
            case 'section-historique-etudiant':
                if (etudiantConnecte) {
                    afficherHistoriqueEtudiantTableau();
                }
                break;
        }
    }
}

// =================== NAVIGATION PRINCIPALE ===================
function retourTableau() {
    afficherSection('section-tableau');
}

// =================== ESPACE ÉTUDIANT - NAVIGATION ===================
function afficherLoginEtudiant() {
    afficherSection('section-login');
    document.getElementById('login-result').textContent = '';
    document.getElementById('userinput1').value = '';
    document.getElementById('userinput2').value = '';
    document.getElementById('userinput3').value = '';
}

function retourLogin() {
    afficherSection('section-login');
}

function afficherDashboard() {
    afficherSection('section-dashboard');
}

function retourDashboard() {
    afficherSection('section-dashboard');
}

function afficherProfil() {
    afficherSection('section-profil');
}

function afficherStatistiquesEtudiant() {
    afficherSection('section-statistiques');
}

function afficherHistoriqueEtudiant() {
    afficherSection('section-historique-etudiant');
}

// =================== CONFIGURER TOUS LES BOUTONS ===================
function configurerTousLesBoutons() {
    console.log("Configuration de tous les boutons...");
    
    // Bouton Espace Étudiant dans le header
    const btnStudentSpace = document.getElementById('btn-studentspace');
    if (btnStudentSpace) {
        btnStudentSpace.addEventListener('click', afficherLoginEtudiant);
        console.log("Bouton espace étudiant configuré");
    }
    
    // Bouton "Se connecter" dans le login
    const btnConnecter = document.querySelector('#section-login button[onclick*="verifier"]');
    if (btnConnecter) {
        btnConnecter.onclick = verifierLogin;
        console.log("Bouton se connecter configuré");
    }
    
    // Boutons dans le dashboard étudiant
    const btnProfil = document.querySelector('#section-dashboard button:nth-child(1)');
    if (btnProfil) {
        btnProfil.onclick = afficherProfil;
        console.log("Bouton profil configuré");
    }
    
    const btnHistorique = document.querySelector('#section-dashboard button:nth-child(2)');
    if (btnHistorique) {
        btnHistorique.onclick = afficherHistoriqueEtudiant;
        console.log("Bouton historique étudiant configuré");
    }
    
    const btnStatistiques = document.querySelector('#section-dashboard button:nth-child(3)');
    if (btnStatistiques) {
        btnStatistiques.onclick = afficherStatistiquesEtudiant;
        console.log("Bouton statistiques configuré");
    }
    
    // Boutons Retour dans chaque section
    configurerBoutonsRetour();
    
    console.log("Tous les boutons configurés");
}

function configurerBoutonsRetour() {
    // Retour du dashboard vers login
    const btnRetourDashboard = document.querySelector('#section-dashboard .btn-secondary');
    if (btnRetourDashboard) {
        btnRetourDashboard.onclick = retourLogin;
    }
    
    // Retour du profil vers dashboard
    const btnRetourProfil = document.querySelector('#section-profil .btn-light');
    if (btnRetourProfil) {
        btnRetourProfil.onclick = retourDashboard;
    }
    
    // Retour des statistiques vers dashboard
    const btnRetourStats = document.querySelector('#section-statistiques .btn-secondary');
    if (btnRetourStats) {
        btnRetourStats.onclick = retourDashboard;
    }
    
    // Retour historique étudiant vers dashboard
    const btnRetourHistEtudiant = document.querySelector('#section-historique-etudiant .btn-secondary');
    if (btnRetourHistEtudiant) {
        btnRetourHistEtudiant.onclick = retourDashboard;
    }
    
    // Retour login vers tableau
    const btnRetourLogin = document.querySelector('#section-login .btn-secondary');
    if (btnRetourLogin) {
        btnRetourLogin.onclick = retourTableau;
    }
}

// =================== GESTION LOCALSTORAGE ===================
function chargerDonnees() {
    const donnees = localStorage.getItem('etudiants');
    const presences = localStorage.getItem('presences');
    
    if (donnees) etudiants = JSON.parse(donnees);
    if (!presences) localStorage.setItem('presences', JSON.stringify({}));
}

function sauvegarderEtudiants() {
    localStorage.setItem('etudiants', JSON.stringify(etudiants));
}

// =================== GESTION DES MODALES ===================
function afficherModal(modalName) {
    const modal = document.getElementById(`modal-${modalName}`);
    if (modal) {
        modal.style.display = 'block';
    }
}

function cacherModal(modalName) {
    const modal = document.getElementById(`modal-${modalName}`);
    if (modal) {
        modal.style.display = 'none';
    }
}

// =================== GESTION DU TABLEAU PRINCIPAL ===================
function afficherTableauEtudiants() {
    const tbody = document.querySelector("#table-etudiant tbody");
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    etudiants.forEach(etudiant => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${etudiant.Nom}</td>
            <td>${etudiant.Prenom}</td>
            <td>${etudiant.groupe}</td>
            <td>
                <button class="btn btn-sm btn-warning btn-modifier" data-id="${etudiant.id}">
                    modifier
                </button>
                <button class="btn btn-sm btn-danger btn-supprimer" data-id="${etudiant.id}">
                    supprimer
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    configurerBoutonsTableau();
}

function configurerBoutonsTableau() {
    document.querySelectorAll('.btn-modifier').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            preparerModification(id);
        });
    });
    
    document.querySelectorAll('.btn-supprimer').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            demanderSuppression(id);
        });
    });
}

// =================== GESTION DES ÉTUDIANTS ===================
function preparerAjout() {
    document.getElementById('nouveauNom').value = '';
    document.getElementById('nouveauPrenom').value = '';
    document.getElementById('nouveauGroupe').value = 'G1';
    afficherModal('ajouter');
}

function ajouterEtudiant() {
    const nom = document.getElementById('nouveauNom').value.trim();
    const prenom = document.getElementById('nouveauPrenom').value.trim();
    const groupe = document.getElementById('nouveauGroupe').value;
    
    if (!nom || !prenom) {
        alert("Veuillez remplir tous les champs!");
        return;
    }
    
    const nouvelId = etudiants.length > 0 ? Math.max(...etudiants.map(e => e.id)) + 1 : 1;
    
    etudiants.push({
        id: nouvelId,
        Nom: nom,
        Prenom: prenom,
        groupe: groupe
    });
    
    sauvegarderEtudiants();
    afficherTableauEtudiants();
    cacherModal('ajouter');
    alert("Étudiant ajouté avec succès!");
}

function demanderSuppression(id) {
    etudiantASupprimer = id;
    afficherModal('confirmation');
}

function supprimerEtudiant() {
    if (etudiantASupprimer === null) return;
    
    etudiants = etudiants.filter(e => e.id !== etudiantASupprimer);
    sauvegarderEtudiants();
    afficherTableauEtudiants();
    cacherModal('confirmation');
    alert("Étudiant supprimé avec succès!");
    etudiantASupprimer = null;
}

function annulerSuppression() {
    cacherModal('confirmation');
    etudiantASupprimer = null;
}

function preparerModification(id) {
    etudiantAModifier = id;
    const etudiant = etudiants.find(e => e.id === id);
    
    if (etudiant) {
        document.getElementById('apprenantName').value = etudiant.Nom;
        document.getElementById('apprenantPrenom').value = etudiant.Prenom;
        document.getElementById('typeofthegroup').value = etudiant.groupe;
        afficherModal('modifier');
    }
}

function modifierEtudiant() {
    if (etudiantAModifier === null) return;
    
    const nom = document.getElementById('apprenantName').value;
    const prenom = document.getElementById('apprenantPrenom').value;
    const groupe = document.getElementById('typeofthegroup').value;
    
    const index = etudiants.findIndex(e => e.id === etudiantAModifier);
    if (index !== -1) {
        etudiants[index] = { ...etudiants[index], Nom: nom, Prenom: prenom, groupe: groupe };
        sauvegarderEtudiants();
        afficherTableauEtudiants();
        cacherModal('modifier');
        alert("Étudiant modifié avec succès!");
    }
    
    etudiantAModifier = null;
}

// =================== GESTION DE LA PRÉSENCE ===================
function afficherTableauPresence() {
    const tbody = document.querySelector("#tableau-presence tbody");
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    etudiants.forEach(etudiant => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="align-middle text-start">
                <strong>${etudiant.Nom} ${etudiant.Prenom}</strong><br>
                <small class="text-muted">${etudiant.groupe}</small>
            </td>
            <td class="align-middle">
                <button class="btn btn-outline-success btn-sm w-100 btn-presence" 
                        data-id="${etudiant.id}" data-statut="present">
                    Présent
                </button>
            </td>
            <td class="align-middle">
                <button class="btn btn-outline-danger btn-sm w-100 btn-presence" 
                        data-id="${etudiant.id}" data-statut="absent">
                    Absent
                </button>
            </td>
            <td class="align-middle">
                <button class="btn btn-outline-warning btn-sm w-100 btn-presence btn-retard" 
                        data-id="${etudiant.id}" data-statut="retard">
                    En retard
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    configurerBoutonsPresence();
    chargerPresencesDuJour();
}

function configurerBoutonsPresence() {
    document.querySelectorAll('.btn-presence').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const statut = this.getAttribute('data-statut');
            
            if (statut === 'retard') {
                preparerEnregistrementRetard(id);
                return;
            }
            
            enregistrerPresence(id, statut);
            mettreEnEvidenceBouton(this, statut);
        });
    });
}

function mettreEnEvidenceBouton(bouton, statut) {
    const ligne = bouton.closest('tr');
    ligne.querySelectorAll('.btn-presence').forEach(btn => {
        btn.classList.remove('btn-success', 'btn-danger', 'btn-warning', 'active');
        btn.classList.add('btn-outline-success', 'btn-outline-danger', 'btn-outline-warning');
    });
    
    bouton.classList.remove('btn-outline-success', 'btn-outline-danger', 'btn-outline-warning');
    
    switch(statut) {
        case 'present': 
            bouton.classList.add('btn-success', 'active'); 
            break;
        case 'absent': 
            bouton.classList.add('btn-danger', 'active'); 
            break;
    }
}

function enregistrerPresence(id, statut) {
    const presences = JSON.parse(localStorage.getItem('presences')) || {};
    const etudiant = etudiants.find(e => e.id === id);
    
    if (etudiant) {
        const aujourdhui = new Date();
        const dateFormat = aujourdhui.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const heureFormat = aujourdhui.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        presences[id] = {
            id: id,
            nom: etudiant.Nom,
            prenom: etudiant.Prenom,
            groupe: etudiant.groupe,
            statut: statut,
            date: dateFormat,
            heure: heureFormat,
            timestamp: aujourdhui.getTime()
        };
        
        localStorage.setItem('presences', JSON.stringify(presences));
        console.log(`Présence enregistrée: ${etudiant.Nom} ${etudiant.Prenom} - ${statut} - ${dateFormat}`);
    }
}

function chargerPresencesDuJour() {
    const presences = JSON.parse(localStorage.getItem('presences')) || {};
    const aujourdhui = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    Object.keys(presences).forEach(id => {
        if (presences[id].date === aujourdhui) {
            const bouton = document.querySelector(`.btn-presence[data-id="${id}"][data-statut="${presences[id].statut}"]`);
            if (bouton) {
                mettreEnEvidenceBouton(bouton, presences[id].statut);
            }
        }
    });
}

// =================== GESTION DES RETARDS ===================
function preparerEnregistrementRetard(id) {
    etudiantAModifier = id;
    const etudiant = etudiants.find(e => e.id === id);
    
    if (etudiant) {
        document.getElementById('nomRetard').textContent = `${etudiant.Nom} ${etudiant.Prenom}`;
        document.getElementById('heureArrivee').value = '';
        document.getElementById('motifRetard').value = '';
        afficherModal('retard-details');
    }
}

function enregistrerRetard() {
    if (etudiantAModifier === null) return;
    
    const heure = document.getElementById('heureArrivee').value;
    const motif = document.getElementById('motifRetard').value;
    
    if (!heure) {
        alert("Veuillez saisir l'heure d'arrivée!");
        return;
    }
    
    const presences = JSON.parse(localStorage.getItem('presences')) || {};
    const etudiant = etudiants.find(e => e.id === etudiantAModifier);
    
    if (etudiant) {
        const aujourdhui = new Date();
        const dateFormat = aujourdhui.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const heureFormat = aujourdhui.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        presences[etudiantAModifier] = {
            id: etudiantAModifier,
            nom: etudiant.Nom,
            prenom: etudiant.Prenom,
            groupe: etudiant.groupe,
            statut: 'retard',
            heureRetard: heure,
            motifRetard: motif,
            date: dateFormat,
            heure: heureFormat,
            timestamp: aujourdhui.getTime()
        };
        
        localStorage.setItem('presences', JSON.stringify(presences));
        cacherModal('retard-details');
        
        const bouton = document.querySelector(`.btn-presence[data-id="${etudiantAModifier}"][data-statut="retard"]`);
        if (bouton) {
            const ligne = bouton.closest('tr');
            ligne.querySelectorAll('.btn-presence').forEach(btn => {
                btn.classList.remove('btn-success', 'btn-danger', 'btn-warning', 'active');
                btn.classList.add('btn-outline-success', 'btn-outline-danger', 'btn-outline-warning');
            });
            bouton.classList.remove('btn-outline-warning');
            bouton.classList.add('btn-warning', 'active');
        }
        
        alert("Retard enregistré!");
        etudiantAModifier = null;
    }
}

// =================== GESTION DE L'HISTORIQUE ===================
function afficherHistoriqueReel() {
    const tbody = document.querySelector("#table-historique tbody");
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const presences = JSON.parse(localStorage.getItem('presences')) || {};
    
    if (Object.keys(presences).length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td colspan="4" class="text-center text-muted py-4">
                <i class="bi bi-info-circle"></i> Aucun historique disponible<br>
                <small class="text-muted">Enregistrez des présences pour voir l'historique</small>
            </td>
        `;
        tbody.appendChild(tr);
        return;
    }
    
    const presencesParDate = {};
    
    Object.values(presences).forEach(presence => {
        const date = presence.date;
        
        if (!presencesParDate[date]) {
            presencesParDate[date] = {
                date: date,
                absents: 0,
                retards: 0,
                details: []
            };
        }
        
        presencesParDate[date].details.push({
            id: presence.id,
            nom: presence.nom,
            prenom: presence.prenom,
            groupe: presence.groupe,
            statut: presence.statut,
            heure: presence.heure,
            heureRetard: presence.heureRetard || '',
            motif: presence.motifRetard || ''
        });
    });
    
    Object.keys(presencesParDate).forEach(date => {
        const journee = presencesParDate[date];
        journee.absents = journee.details.filter(d => d.statut === 'absent').length;
        journee.retards = journee.details.filter(d => d.statut === 'retard').length;
    });
    
    const historiqueArray = Object.values(presencesParDate);
    historiqueArray.sort((a, b) => {
        const datePartsA = a.date.split('/');
        const dateA = `${datePartsA[2]}-${datePartsA[1]}-${datePartsA[0]}`;
        const datePartsB = b.date.split('/');
        const dateB = `${datePartsB[2]}-${datePartsB[1]}-${datePartsB[0]}`;
        return new Date(dateB) - new Date(dateA);
    });
    
    historiqueArray.forEach(journee => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${journee.date}</td>
            <td>${journee.absents}</td>
            <td>${journee.retards}</td>
            <td>
                <button class="btn btn-link btn-details p-0" data-date="${journee.date}">
                    <i class="bi bi-eye"></i> Voir les détails
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const date = this.getAttribute('data-date');
            afficherDetailsJourReel(date, presencesParDate);
        });
    });
}

function afficherDetailsJourReel(date, presencesParDate) {
    const tbody = document.querySelector("#table-details-jour tbody");
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const journee = presencesParDate[date];
    
    if (!journee || journee.details.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td colspan="4" class="text-center text-muted py-3">
                Aucun détail disponible pour cette journée
            </td>
        `;
        tbody.appendChild(tr);
        return;
    }
    
    const absents = journee.details.filter(d => d.statut === 'absent');
    const retards = journee.details.filter(d => d.statut === 'retard');
    const maxLignes = Math.max(absents.length, retards.length);
    
    for (let i = 0; i < maxLignes; i++) {
        const absent = absents[i] || { nom: '', prenom: '' };
        const retard = retards[i] || { nom: '', prenom: '', heureRetard: '', motif: '' };
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${absent.nom ? `${absent.nom} ${absent.prenom}` : ''}</td>
            <td>${retard.nom ? `${retard.nom} ${retard.prenom}` : ''}</td>
            <td>${retard.heureRetard || ''}</td>
            <td>${retard.motif || ''}</td>
        `;
        tbody.appendChild(tr);
    }
    
    document.getElementById('date-details').textContent = date;
    afficherSection('section-details');
}

// =================== ESPACE ÉTUDIANT - LOGIN ===================
function verifierLogin() {
    const prenom = document.getElementById('userinput1').value.trim();
    const nom = document.getElementById('userinput2').value.trim();
    const groupe = document.getElementById('userinput3').value.trim().toUpperCase();
    
    const etudiant = etudiants.find(e => 
        e.Prenom.toLowerCase() === prenom.toLowerCase() && 
        e.Nom.toLowerCase() === nom.toLowerCase() && 
        e.groupe === groupe
    );
    
    if (etudiant) {
        etudiantConnecte = etudiant;
        document.getElementById('login-result').innerHTML = 
            `<span class="text-success">Connexion réussie !</span>`;
        
        setTimeout(() => {
            afficherDashboard();
        }, 500);
    } else {
        document.getElementById('login-result').innerHTML = 
            `<span class="text-danger">Étudiant non trouvé. Vérifiez vos informations.</span>`;
    }
}

// =================== ESPACE ÉTUDIANT - DASHBOARD ===================
function mettreAJourDashboard() {
    if (!etudiantConnecte) return;
    
    document.getElementById('dashNom').textContent = etudiantConnecte.Nom;
    document.getElementById('dashPrenom').textContent = etudiantConnecte.Prenom;
    document.getElementById('dashGroupe').textContent = etudiantConnecte.groupe;
    
    calculerStatistiquesDashboard();
}

function calculerStatistiquesDashboard() {
    if (!etudiantConnecte) return;
    
    const presences = JSON.parse(localStorage.getItem('presences')) || {};
    
    let totalJours = 0;
    let absences = 0;
    let retards = 0;
    let totalPresences = 0;
    
    Object.values(presences).forEach(presence => {
        if (presence.id === etudiantConnecte.id) {
            totalJours++;
            totalPresences++;
            
            if (presence.statut === 'absent') {
                absences++;
            } else if (presence.statut === 'retard') {
                retards++;
            }
        }
    });
    
    const tauxPresence = totalPresences > 0 ? 
        Math.round(((totalPresences - absences) / totalPresences) * 100) : 0;
    
    document.getElementById('dashTotalJours').textContent = totalJours;
    document.getElementById('dashAbsences').textContent = absences;
    document.getElementById('dashRetards').textContent = retards;
    document.getElementById('dashTauxPresence').textContent = tauxPresence + '%';
}

// =================== ESPACE ÉTUDIANT - PROFIL ===================
function mettreAJourProfil() {
    if (!etudiantConnecte) return;
    
    document.getElementById('profile-welcome').textContent = 
        `Bienvenue ${etudiantConnecte.Prenom} ${etudiantConnecte.Nom} !`;
    document.getElementById('profile-prenom').textContent = etudiantConnecte.Prenom;
    document.getElementById('profile-nom').textContent = etudiantConnecte.Nom;
    document.getElementById('profile-groupe').textContent = etudiantConnecte.groupe;
    
    const presences = JSON.parse(localStorage.getItem('presences')) || {};
    let absences = 0;
    let retards = 0;
    
    Object.values(presences).forEach(presence => {
        if (presence.id === etudiantConnecte.id) {
            if (presence.statut === 'absent') {
                absences++;
            } else if (presence.statut === 'retard') {
                retards++;
            }
        }
    });
    
    document.getElementById('profile-absences').textContent = absences;
    document.getElementById('profile-retards').textContent = retards;
    
    let statut = "Excellent";
    if (absences > 5) statut = "À améliorer";
    else if (retards > 3) statut = "Bon";
    else if (absences > 2) statut = "Moyen";
    
    document.getElementById('profile-statut').textContent = statut;
}

// =================== ESPACE ÉTUDIANT - STATISTIQUES ===================
function calculerEtAfficherStatistiques() {
    if (!etudiantConnecte) return;
    
    const presences = JSON.parse(localStorage.getItem('presences')) || {};
    const aujourdhui = new Date();
    const dateLimite = new Date();
    dateLimite.setDate(aujourdhui.getDate() - 30);
    
    let retards = 0;
    let absences = 0;
    let presents = 0;
    let totalHeuresRetard = 0;
    let countHeuresRetard = 0;
    let joursAvecPresence = new Set();
    
    Object.values(presences).forEach(presence => {
        if (presence.id === etudiantConnecte.id) {
            try {
                const [jourStr, moisStr, anneeStr] = presence.date.split('/');
                const datePresence = new Date(anneeStr, moisStr - 1, jourStr);
                
                if (datePresence >= dateLimite) {
                    joursAvecPresence.add(presence.date);
                    
                    if (presence.statut === 'retard') {
                        retards++;
                        if (presence.heureRetard) {
                            const [heures, minutes] = presence.heureRetard.split(':').map(Number);
                            totalHeuresRetard += heures * 60 + minutes;
                            countHeuresRetard++;
                        }
                    } else if (presence.statut === 'absent') {
                        absences++;
                    } else if (presence.statut === 'present') {
                        presents++;
                    }
                }
            } catch (e) {}
        }
    });
    
    const totalPresences = retards + absences + presents;
    let tauxRetard = 0;
    let tauxAbsence = 0;
    
    if (totalPresences > 0) {
        tauxRetard = Math.round((retards / totalPresences) * 100);
        tauxAbsence = Math.round((absences / totalPresences) * 100);
    }
    
    let heureMoyenne = "09:45";
    if (countHeuresRetard > 0) {
        const moyenneMinutes = Math.round(totalHeuresRetard / countHeuresRetard);
        const heures = Math.floor(moyenneMinutes / 60);
        const minutes = moyenneMinutes % 60;
        heureMoyenne = `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    document.getElementById('stats-student-name').textContent = 
        `${etudiantConnecte.Prenom} ${etudiantConnecte.Nom}`;
    document.getElementById('stats-student-info').textContent = 
        `Groupe: ${etudiantConnecte.groupe} | ID: ${etudiantConnecte.id}`;
    
    document.getElementById('stats-taux-retard').textContent = tauxRetard;
    document.getElementById('stats-jours-presents').textContent = joursAvecPresence.size;
    document.getElementById('stats-taux-absence').textContent = tauxAbsence;
    document.getElementById('stats-heure-moyenne').textContent = heureMoyenne;
    
    const aujourdhuiFormatted = aujourdhui.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const dateDebut = new Date();
    dateDebut.setDate(aujourdhui.getDate() - 29);
    const dateDebutFormatted = dateDebut.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    document.getElementById('stats-periode').textContent = 
        `Période: ${dateDebutFormatted} au ${aujourdhuiFormatted}`;
    
    initialiserGraphiqueStatistiques({
        tauxRetard: tauxRetard,
        joursPresents: joursAvecPresence.size,
        tauxAbsence: tauxAbsence
    });
}

function initialiserGraphiqueStatistiques(stats) {
    const ctx = document.getElementById('stats-chart');
    if (!ctx) return;
    
    if (statsChart) {
        statsChart.destroy();
    }
    
    statsChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Taux retard (%)', 'Jours présents', 'Taux absence (%)'],
            datasets: [{
                label: 'Valeurs',
                data: [stats.tauxRetard, stats.joursPresents, stats.tauxAbsence],
                backgroundColor: [
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(220, 53, 69, 0.7)'
                ],
                borderColor: [
                    'rgb(255, 193, 7)',
                    'rgb(40, 167, 69)',
                    'rgb(220, 53, 69)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// =================== ESPACE ÉTUDIANT - HISTORIQUE ===================
function afficherHistoriqueEtudiantTableau() {
    if (!etudiantConnecte) return;
    
    const tbody = document.querySelector("#table-historique-etudiant tbody");
    const vide = document.getElementById('historique-vide');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const presences = JSON.parse(localStorage.getItem('presences')) || {};
    const historique = [];
    
    Object.values(presences).forEach(presence => {
        if (presence.id === etudiantConnecte.id) {
            historique.push({
                date: presence.date,
                statut: presence.statut,
                heure: presence.heure,
                heureRetard: presence.heureRetard || '',
                motif: presence.motifRetard || ''
            });
        }
    });
    
    if (historique.length === 0) {
        if (vide) vide.style.display = 'block';
        return;
    }
    
    if (vide) vide.style.display = 'none';
    
    historique.sort((a, b) => {
        const [jourA, moisA, anneeA] = a.date.split('/');
        const [jourB, moisB, anneeB] = b.date.split('/');
        return new Date(anneeB, moisB - 1, jourB) - new Date(anneeA, moisA - 1, jourA);
    });
    
    historique.forEach(item => {
        const statutColor = item.statut === 'present' ? 'success' : 
                          item.statut === 'absent' ? 'danger' : 'warning';
        const statutText = item.statut === 'present' ? 'Présent' : 
                         item.statut === 'absent' ? 'Absent' : 'En retard';
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.date}</td>
            <td><span class="badge bg-${statutColor}">${statutText}</span></td>
            <td>${item.heure}</td>
            <td>${item.heureRetard ? `Arrivé à ${item.heureRetard}` : ''} ${item.motif ? `- ${item.motif}` : ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

// =================== CONFIGURATION DE LA NAVIGATION ===================
function configurerNavigation() {
    // Bouton Ajouter
    const btnAjouter = document.getElementById('btn-ajouter');
    if (btnAjouter) btnAjouter.addEventListener('click', preparerAjout);
    
    // Bouton Prise de présence
    const btnAbsence = document.getElementById('btn-absence');
    if (btnAbsence) btnAbsence.addEventListener('click', function() {
        afficherSection('section-presence');
    });
    
    const btnAbsence2 = document.getElementById('btn-absence-2');
    if (btnAbsence2) btnAbsence2.addEventListener('click', function() {
        afficherSection('section-presence');
    });
    
    // Bouton Historique
    const btnHistorique = document.getElementById('btn-historique');
    if (btnHistorique) btnHistorique.addEventListener('click', function() {
        afficherSection('section-historique');
    });
    
    const btnHistorique2 = document.getElementById('btn-historique-2');
    if (btnHistorique2) btnHistorique2.addEventListener('click', function() {
        afficherSection('section-historique');
    });
}

// =================== CONFIGURATION DES BOUTONS GLOBAUX ===================
function configurerBoutonsGlobaux() {
    const btnOui = document.getElementById('btnOui');
    if (btnOui) btnOui.addEventListener('click', supprimerEtudiant);
    
    const btnNon = document.getElementById('btnNon');
    if (btnNon) btnNon.addEventListener('click', annulerSuppression);
    
    const btnModifier = document.getElementById('btnmodifie');
    if (btnModifier) btnModifier.addEventListener('click', modifierEtudiant);
    
    const btnAjouterForm = document.getElementById('btn-ajouter-form');
    if (btnAjouterForm) btnAjouterForm.addEventListener('click', ajouterEtudiant);
    
    const btnEnregistrerRetard = document.getElementById('btn-enregistrer-retard');
    if (btnEnregistrerRetard) btnEnregistrerRetard.addEventListener('click', enregistrerRetard);
}

// =================== INITIALISATION AFFICHAGE ===================
function initialiserAffichage() {
    console.log("Initialisation de l'affichage...");
    afficherTableauEtudiants();
    
    if (!localStorage.getItem('presences') || Object.keys(JSON.parse(localStorage.getItem('presences'))).length === 0) {
        setTimeout(() => {
            if (confirm("Aucune donnée de présence trouvée. Voulez-vous générer des données de test ?")) {
                genererDonneesTest();
            }
        }, 1000);
    }
}

// =================== DONNÉES DE TEST ===================
function genererDonneesTest() {
    localStorage.removeItem('presences');
    
    const dates = ["17/12/2025", "16/12/2025", "15/12/2025", "14/12/2025"];
    let presencesTest = {};
    
    dates.forEach((date, dateIndex) => {
        etudiants.forEach(etudiant => {
            const id = etudiant.id;
            const statutChoix = ['present', 'absent', 'retard'][Math.floor(Math.random() * 3)];
            
            let presence = {
                id: id,
                nom: etudiant.Nom,
                prenom: etudiant.Prenom,
                groupe: etudiant.groupe,
                statut: statutChoix,
                date: date,
                heure: dateIndex === 0 ? "09:00" : "08:45",
                timestamp: new Date(date.split('/').reverse().join('-')).getTime()
            };
            
            if (statutChoix === 'retard') {
                presence.heureRetard = `09:${15 + Math.floor(Math.random() * 45)}`;
                presence.motifRetard = ["Traffic", "Transport", "Réunion", "Santé"][Math.floor(Math.random() * 4)];
            }
            
            const cle = `${id}_${date.replace(/\//g, '_')}`;
            presencesTest[cle] = presence;
        });
    });
    
    localStorage.setItem('presences', JSON.stringify(presencesTest));
    alert("Données de test générées !");
}

// =================== EXPOSITION DES FONCTIONS GLOBALES ===================
window.cacherModal = cacherModal;
window.retourTableau = retourTableau;
window.afficherLoginEtudiant = afficherLoginEtudiant;
window.afficherDashboard = afficherDashboard;
window.afficherProfil = afficherProfil;
window.afficherHistoriqueEtudiant = afficherHistoriqueEtudiant;
window.afficherStatistiquesEtudiant = afficherStatistiquesEtudiant;
window.verifierLogin = verifierLogin;
window.preparerAjout = preparerAjout;