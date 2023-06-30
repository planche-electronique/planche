/*
    Planche-électronique - projet de système d'enregistrement de vols en planeur pour clubs de vol à voile
    
    main.js
            fichier principal qui s'occupe de la gestion du site internet de planche électronique qui permet
        de logger des vols en planeur
    
    Licensed under the MIT licence, provided 'as is' without any warranty.
    Soumis à la licence MIT, fourni 'en l'état' sans aucune garantie.
    Voir https://raw.githubusercontent.com/planche-electronique/planche/master/LICENSE pour la licence complète
*/




async function maitre(document) {
    
    let bouton = document.getElementById("bouton_soumission");
    
    bouton.addEventListener("click", () => {
        sous_maitre(document);
    });
}

async function sous_maitre(document) {
    let immatriculations = await lire_json('./immatriculations.json');    
    let pilotes          = await lire_json('./pilotes.json');
    let treuils          = await lire_json('./treuils.json');
    let remorqueurs      = await lire_json('./remorqueurs.json');
    let pilotes_tr       = await lire_json('./pilotes_tr.json');
    let pilotes_rq       = await lire_json('./pilotes_rq.json');

    const CodeDecollage = [
        "T",
        "R",
    ];
    
    const CodeVol = [
        "B",
        "S",
        "E",
        "C",
        "M",
    ]


    let infos_fixes = {
        "immatriculations": immatriculations,
        "pilotes": pilotes,
        "treuils": treuils,
        "remorqueurs": remorqueurs,
        "pilotes_tr": pilotes_tr,
        "pilotes_rq": pilotes_rq,
        "CodeDecollage": CodeDecollage,
        "CodeVol": CodeVol
    }

    await premier_chargement_tableau(
        document,
        infos_fixes
    );
        
    let tableau = document.getElementById("tableau");
    mise_a_jour_automatique(document, tableau, infos_fixes);
}
    
    
document.addEventListener('DOMContentLoaded', (_) => {
    maitre(document);
});




async function mise_a_jour_automatique(document, tableau, infos_fixes) {
    
    while(tableau.rows.length > 1) {
        tableau.deleteRow(1);
    }

    let entree_date = document.getElementById("entree_date");
    let date = entree_date.value;
    let vols = await vols_du(date.replaceAll("-", "/"));
    await chargement_des_ressources(document, tableau, vols, infos_fixes);
    setTimeout(
        function() {
            mise_a_jour_automatique(document, tableau, infos_fixes);
        },
        77777
    );
}





