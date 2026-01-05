
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
