/*
    Planche-électronique - projet de système d'enregistrement de vols en planeur pour clubs de vol à voile
    
    affectations.js
        toutes les fonctions qui s'occupent de créer et supprimer des affectations
    
    Licensed under the MIT licence, provided 'as is' without any warranty.
    Soumis à la licence MIT, fourni 'en l'état' sans aucune garantie.
    Voir https://raw.githubusercontent.com/planche-electronique/planche/master/LICENSE pour la licence complète
*/




async function creer_affectation(vols, infos_fixes) {
    let plus_petit_numero_ogn = 0; // pour trouver le plus petit et l'ajouter
    for (let vol of vols) {
        if (structuredCLone(vol).numero_ogn < plus_petit_numero_ogn) {
            plus_petit_numero_ogn = structuredClone(vol).numero_ogn;
        }
    }
    vols.unshift({
        "numero_ogn": plus_petit_numero_ogn-1,
        "aeronef": "",
        "code_vol":"",
        "code_decollage":"",
        "machine_decollage": "",
        "decolleur": "",
        "pilote1": "",
        "pilote2": "",
        "decollage": "",
        "atterissage": "",
    });
    let tableau= document.getElementById("tableau");
    nettoyage_tableau(tableau);
    await chargement_des_ressources(
        document,
        tableau,
        vols,
        infos_fixes
    );
}




function supprimer_vol(numero_ogn, vols) {
    console.log(numero_ogn + vols);
}
