/*
    Planche-électronique - projet de système d'enregistrement de vols en planeur pour clubs de vol à voile
    
    conversion_heure.js
        Ce fichier contient des fonctions s'occupeent de convertir des heures sous différents formats.
    
    Licensed under the MIT licence, provided 'as is' without any warranty.
    Soumis à la licence MIT, fourni 'en l'état' sans aucune garantie.
    Voir https://raw.githubusercontent.com/planche-electronique/planche/master/LICENSE pour la licence complète
*/




function temps_texte_vers_heure_type(temps) {
    let heure_decollage = temps.slice(0, 2);
    let minute_decollage = temps.slice(3, 5);
    let decollage = new Date(0, 0, 0, heure_decollage, minute_decollage);
    return decollage;
}




function temps_type_vers_temps_texte(temps_type) {
        let heures = Math.floor(temps_type / 3600000).toString();
        let minutes = Math.floor((temps_type-heures*3600000) / 60000);
        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
        return (heures + ":" + minutes);
}




