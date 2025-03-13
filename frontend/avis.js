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
	const avisElement = document.createElement('p');
	for (let i = 0; i < avis.length; i++) {
		avisElement.innerHTML += `<b>${avis[i].utilisateur} :</b> <br /> ${avis[i].commentaire}<br>`;
	}
	pieceElement.appendChild(avisElement);
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
