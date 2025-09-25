// Render meeting tiles
function renderTiles(data) {
	const container = document.getElementById('tiles-container');
	container.innerHTML = '';
	if (!data || !data.length) {
		container.innerHTML = '<p>No meeting data found.</p>';
		return;
	}
	data.forEach((meeting, idx) => {
		const tile = document.createElement('div');
		tile.className = 'meeting-tile';
		tile.tabIndex = 0;
		// Dynamically show up to 3 keys as summary
		const keys = Object.keys(meeting);
		let summary = '';
		keys.slice(0, 3).forEach(key => {
			let value = meeting[key];
			if (Array.isArray(value)) value = value.join(', ');
			summary += `<div><span class="modal-label">${key}:</span> ${value || ''}</div>`;
		});
		tile.innerHTML = summary;
		tile.addEventListener('click', () => showModal(meeting));
		tile.addEventListener('keypress', (e) => {
			if (e.key === 'Enter' || e.key === ' ') showModal(meeting);
		});
		container.appendChild(tile);
	});
}

// Show modal with meeting details
function showModal(meeting) {
	const modal = document.getElementById('meeting-modal');
	const modalContent = document.getElementById('modal-content');
	let html = '';
	html += `<div class="modal-title">Meeting Details</div>`;
	Object.keys(meeting).forEach(key => {
		let value = meeting[key];
		if (Array.isArray(value)) value = value.join(', ');
		html += `<div class="modal-detail"><span class="modal-label">${key}:</span> ${value || ''}</div>`;
	});
	modalContent.querySelector('.modal-title')?.remove();
	modalContent.querySelectorAll('.modal-detail')?.forEach(e => e.remove());
	modalContent.insertAdjacentHTML('afterbegin', html);
	modal.style.display = 'flex';
}

// Hide modal
function hideModal() {
	document.getElementById('meeting-modal').style.display = 'none';
	// Remove details for next open
	const modalContent = document.getElementById('modal-content');
	modalContent.querySelector('.modal-title')?.remove();
	modalContent.querySelectorAll('.modal-detail')?.forEach(e => e.remove());
}

document.getElementById('close-modal').addEventListener('click', hideModal);
window.addEventListener('click', function(e) {
	const modal = document.getElementById('meeting-modal');
	if (e.target === modal) hideModal();
});
window.addEventListener('keydown', function(e) {
	if (e.key === 'Escape') hideModal();
});

// Try to fetch all JSON files from meetings folder
async function loadMeetings() {
	// List of JSON files to fetch
	const files = [
		'meetings/dummy_meetings.json'
		// Add more JSON files here as needed
	];
	let allData = [];
	for (const file of files) {
		try {
			const res = await fetch(file);
			if (!res.ok) continue;
			const json = await res.json();
			// If file is an array, treat each item as a meeting
			if (Array.isArray(json)) {
				allData = allData.concat(json);
			} else {
				allData.push(json);
			}
		} catch (err) {
			// Ignore missing files
		}
	}
	renderTiles(allData);
}

window.addEventListener('DOMContentLoaded', loadMeetings);
