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