export function ajoutListenersAvis() {
	const piecesElements = document.querySelectorAll('.fiches article button');

	for (let i = 0; i < piecesElements.length; i++) {
		piecesElements[i].addEventListener('click', async (event) => {
			const id = event.target.dataset.id;
			const avis = await fetch(`http://localhost:8081/pieces/${id}/avis`)
				.then((res) => res.json())
				.catch((error) => console.error('Erreur :', error));

			const avisElement = document.createElement('p');
			for (let i = 0; i < avis.length; i++) {
				avisElement.innerHTML += `<b>${avis[i].utilisateur} :</b> <br /> ${avis[i].commentaire}<br>`;
			}
			piecesElements[i].appendChild(avisElement);
			const pieceElement = event.target.parentElement;
			afficherAvis(pieceElement, avis);
		});
	}
}

export function afficherAvis(pieceElement, avis) {
	for (let i = 0; i < avis.length; i++) {
		avisElement.innerHTML += `<b>${avis[i].utilisateur} :</b> <br /> ${avis[i].commentaire}<br>`;
	}
}

export function ajoutListenerEnvoyerAvis() {
	const formulaireAvis = document.querySelector('.formulaire-avis');
	formulaireAvis.addEventListener('submit', (event) => {
		event.preventDefault();
		// Création de l’objet du nouvel avis.
		const avis = {
			pieceId: parseInt(event.target.querySelector('[name=piece-id]').value),
			utilisateur: event.target.querySelector('[name=utilisateur').value,
			commentaire: event.target.querySelector('[name=commentaire]').value,
			nbEtoiles: parseInt(event.target.querySelector('[name=nbEtoiles]').value),
		};
		// Création de la charge utile au format JSON
		const chargeUtile = JSON.stringify(avis);

		// Envoi de l’avis au serveur
		fetch('http://localhost:8081/avis', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: chargeUtile,
		});
	});
}

/* Implantation du graphique des avis */
export async function afficherGraphiqueAvis() {
	// Calcul du nombre total de commentaires par quantité d'étoiles attribuées
	const avis = await fetch('http://localhost:8081/avis').then((avis) =>
		avis.json()
	);
	const nb_commentaires = [0, 0, 0, 0, 0];

	for (let commentaire of avis) {
		nb_commentaires[commentaire.nbEtoiles - 1]++;
	}
	// Légende qui s'affichera sur la gauche à côté de la barre horizontale
	const labels = ['5', '4', '3', '2', '1'];
	// Données et personnalisation du graphique
	const data = {
		labels: labels,
		datasets: [
			{
				label: 'Étoiles attribuées',
				data: nb_commentaires.reverse(),
				backgroundColor: 'rgba(255, 230, 0, 1)', // couleur jaune
			},
		],
	};
	// Objet de configuration final
	const config = {
		type: 'bar',
		data: data,
		options: {
			indexAxis: 'y',
		},
	};
	// Rendu du graphique dans l'élément canvas
	new Chart(document.querySelector('#graphique-avis'), config);
	// Graphique des piéces
	// récupération liste pieces depuis le localstorage
	const piecesJSON = window.localStorage.getItem('pieces');
	const pieces = JSON.parse(piecesJSON);

	// calcul du nombre de commentaires en créant 2 variables
	let nbCommentaireDispo = 0;
	let nbCommentaireNonDispo = 0;

	// boucle pour parcourir la liste des pièces
	for (let i = 0; i < avis.length; i++) {
		const piece = pieces.find((p) => p.id === avis[i].pieceId);
		if (piece) {
			if (piece.disponibilite) {
				nbCommentaireDispo++;
			}
		} else {
			nbCommentaireNonDispo++;
		}
	}
	// légende qui s'affichera sur la gauche à côté de la barre horizontale
	const labelsDispo = ['Disponibles', 'Non Dispo.'];
	// Données et la personnalisation du graphique
	const dataDispo = {
		labels: labelsDispo,
		datasets: [
			{
				label: 'Nombre de commentaires',
				data: [nbCommentaireDispo, nbCommentaireNonDispo],
				backgroundColor: 'rgba(0, 230, 255, 1)',
			},
		],
	};
	// Objet de configuration final avec
	const configDispo = {
		// le type de graphique
		type: 'bar',
		// les données
		data: dataDispo,
	};
	// Rendu du graphique dans l'element canvas
	new Chart(document.querySelector('#graphique-dispo'), configDispo);
}
