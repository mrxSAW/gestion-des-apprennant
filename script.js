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