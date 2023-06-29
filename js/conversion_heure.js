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
        console.log(heures + ":" + minutes);
        return (heures + ":" + minutes);
}




