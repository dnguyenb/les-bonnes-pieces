export const ajoutListenersAvis = () => {
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
		});
	}
};
