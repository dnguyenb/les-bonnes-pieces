export function ajoutListenersAvis() {
	const piecesElements = document.querySelectorAll('.fiches article button');

	for (let i = 0; i < piecesElements.length; i++) {
		piecesElements[i].addEventListener('click', async (event) => {
			const id = event.target.dataset.id;
			try {
				// Utiliser le filtre de json-server pour obtenir les avis d'une pièce spécifique
				const response = await fetch(
					`http://localhost:8081/avis?pieceId=${id}`
				);
				if (!response.ok) {
					throw new Error(`Erreur HTTP: ${response.status}`);
				}
				const avis = await response.json();
				const pieceElement = event.target.parentElement;
				afficherAvis(pieceElement, avis);
			} catch (error) {
				console.error('Erreur lors de la récupération des avis:', error);
				const pieceElement = event.target.parentElement;
				afficherAvis(pieceElement, []); // Afficher "Aucun avis" en cas d'erreur
			}
		});
	}
}

export function afficherAvis(pieceElement, avis) {
	// Création d'un élément pour afficher les avis
	const avisElement = document.createElement('div');
	avisElement.classList.add('avis');

	// Vérifier si des avis existent
	if (avis && avis.length > 0) {
		for (let i = 0; i < avis.length; i++) {
			avisElement.innerHTML += `<p><b>${avis[i].utilisateur} :</b> <br /> ${avis[i].commentaire}</p>`;
		}
	} else {
		avisElement.innerHTML = '<p>Aucun avis pour cette pièce.</p>';
	}

	// Supprimer les avis précédents s'ils existent
	const ancienAvis = pieceElement.querySelector('.avis');
	if (ancienAvis) {
		pieceElement.removeChild(ancienAvis);
	}

	pieceElement.appendChild(avisElement);
}

export function ajoutListenerEnvoyerAvis() {
	const formulaireAvis = document.querySelector('.formulaire-avis');
	formulaireAvis.addEventListener('submit', async (event) => {
		event.preventDefault();
		// Création de l'objet du nouvel avis.
		const avis = {
			pieceId: parseInt(event.target.querySelector('[name=piece-id]').value),
			utilisateur: event.target.querySelector('[name=utilisateur').value,
			commentaire: event.target.querySelector('[name=commentaire]').value,
			nbEtoiles: parseInt(event.target.querySelector('[name=nbEtoiles]').value),
		};
		// Création de la charge utile au format JSON
		const chargeUtile = JSON.stringify(avis);

		// Envoi de l'avis au serveur
		try {
			const response = await fetch('http://localhost:8081/avis', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: chargeUtile,
			});

			if (response.ok) {
				// Réinitialiser le formulaire après envoi réussi
				event.target.reset();
				// Mettre à jour les graphiques
				afficherGraphiqueAvis();
			}
		} catch (error) {
			console.error("Erreur lors de l'envoi de l'avis:", error);
		}
	});
}

/* Implantation du graphique des avis */
export async function afficherGraphiqueAvis() {
	// Vérifier si Chart.js est disponible
	if (typeof Chart === 'undefined') {
		console.error("Chart.js n'est pas chargé correctement");
		return;
	}

	try {
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

		// Vérifier si le canvas existe
		const graphiqueAvisCanvas = document.querySelector('#graphique-avis');
		if (!graphiqueAvisCanvas) {
			console.error('Canvas #graphique-avis non trouvé');
			return;
		}

		// Détruire le graphique précédent s'il existe pour éviter des conflits
		const existingChart = Chart.getChart(graphiqueAvisCanvas);
		if (existingChart) {
			existingChart.destroy();
		}

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
		new Chart(graphiqueAvisCanvas, config);

		// Graphique des pièces
		// récupération liste pieces depuis le localstorage
		const piecesJSON = window.localStorage.getItem('pieces');
		const pieces = JSON.parse(piecesJSON);

		if (!pieces) {
			console.error('Aucune pièce trouvée dans le localStorage');
			return;
		}

		// calcul du nombre de commentaires en créant 2 variables
		let nbCommentaireDispo = 0;
		let nbCommentaireNonDispo = 0;

		// boucle pour parcourir la liste des pièces
		for (let i = 0; i < avis.length; i++) {
			const piece = pieces.find((p) => p.id === avis[i].pieceId);
			if (piece) {
				if (piece.disponibilite) {
					nbCommentaireDispo++;
				} else {
					nbCommentaireNonDispo++;
				}
			}
		}

		// Vérifier si le canvas existe
		const graphiqueDispoCanvas = document.querySelector('#graphique-dispo');
		if (!graphiqueDispoCanvas) {
			console.error('Canvas #graphique-dispo non trouvé');
			return;
		}

		// Détruire le graphique précédent s'il existe
		const existingDispoChart = Chart.getChart(graphiqueDispoCanvas);
		if (existingDispoChart) {
			existingDispoChart.destroy();
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
		new Chart(graphiqueDispoCanvas, configDispo);
	} catch (error) {
		console.error("Erreur lors de l'affichage des graphiques:", error);
	}
}
