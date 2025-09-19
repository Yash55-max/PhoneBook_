class Phonebook {
    constructor() {
        this.contacts = [];
        this.currentContactId = null;
        this.apiUrl = "http://localhost:5000/api/contacts"; // backend API
        this.contactImageDataUrl = "";
        this.showingFavorites = false;
        this.init();
    }

    async init() {
        await this.loadContacts();
        this.setupEventListeners();

        // Add image input event listener
        document.getElementById('contactImage').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 1024 * 1024) { // 1MB
                    alert("Image size must be less than or equal to 1MB.");
                    e.target.value = "";
                    this.contactImageDataUrl = "";
                    return;
                }
                const reader = new FileReader();
                reader.onload = (evt) => {
                    this.contactImageDataUrl = evt.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                this.contactImageDataUrl = "";
            }
        });
    }

    setupEventListeners() {
        document.getElementById('addContactBtn').addEventListener('click', () => this.openModal());
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContact();
        });
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchContacts(e.target.value));
        document.getElementById('favoritesBtn').addEventListener('click', () => this.toggleFavoritesView());
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        window.addEventListener('click', (event) => {
            if (event.target === document.getElementById('contactModal')) {
                this.closeModal();
            }
        });
        
        // Add event delegation for edit and delete buttons
        document.getElementById('contactsList').addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            const favBtn = e.target.closest('.favourite-btn');
            
            if (editBtn) {
                const contactId = editBtn.dataset.contactId;
                const contact = this.contacts.find(c => c._id == contactId);
                if (contact) this.openModal(contact);
            } else if (deleteBtn) {
                const contactId = deleteBtn.dataset.contactId;
                const contactName = deleteBtn.dataset.contactName;
                this.showDeleteDialog(contactId, contactName);
            } else if (favBtn) {
                const contactId = favBtn.dataset.contactId;
                this.toggleFavourite(contactId);
            }
        });
    }

    // === API CALLS ===
    async loadContacts() {
        try {
            const res = await fetch(this.apiUrl);
            if (!res.ok) throw new Error("Failed to fetch contacts");
            this.contacts = await res.json();
            this.updateFavoritesCount();
            this.renderContacts();
        } catch (err) {
            alert("Could not load contacts. Is your backend running?");
            console.error("Error loading contacts:", err);
        }
    }

    async saveContact() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const notes = document.getElementById('notes').value.trim();

        if (!name || !phone) {
            alert('Name and phone are required!');
            return;
        }

        // Use the image data URL if present
        let image = this.contactImageDataUrl;
        // If editing, keep the old image if a new one is not selected
        if (this.currentContactId && !image) {
            const editingContact = this.contacts.find(c => c._id === this.currentContactId);
            image = editingContact && editingContact.image ? editingContact.image : "";
        }

        const contactData = { name, phone, email, address, notes, image };

        try {
            let response;
            if (this.currentContactId) {
                response = await fetch(`${this.apiUrl}/${this.currentContactId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(contactData)
                });
            } else {
                response = await fetch(this.apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(contactData)
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error("Save failed: " + errorText);
            }

            this.closeModal();
            this.currentContactId = null;
            this.contactImageDataUrl = ""; // reset after save
            document.getElementById('contactImage').value = ""; // reset file input
            await this.loadContacts();
        } catch (err) {
            alert("Could not save contact. Check backend and browser console.");
            console.error("Error saving contact:", err);
        }
    }

    async deleteContact(contactId) {
        try {
            const response = await fetch(`${this.apiUrl}/${contactId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            await this.loadContacts();
        } catch (err) {
            alert("Could not delete contact. Check backend and browser console.");
            console.error("Error deleting contact:", err);
        }
    }

    // === UI Functions ===
    renderContacts(filteredContacts = null) {
        const contactsList = document.getElementById('contactsList');
        const emptyState = document.getElementById('emptyState');
        const noFavoritesState = document.getElementById('noFavoritesState');
        const favoritesHeader = document.getElementById('favoritesHeader');
        
        contactsList.innerHTML = '';
        const contactsToRender = filteredContacts || this.contacts;

        // Hide all empty states initially
        emptyState.style.display = 'none';
        noFavoritesState.style.display = 'none';
        favoritesHeader.style.display = 'none';

        if (this.showingFavorites) {
            favoritesHeader.style.display = 'block';
            if (contactsToRender.length === 0) {
                noFavoritesState.style.display = 'block';
                return;
            }
        } else if (contactsToRender.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        contactsToRender.forEach(contact => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            if (contact.favorite) card.classList.add('favorite');

            // Add image if present
            const imgHtml = contact.image
                ? `<img src="${contact.image}" alt="Contact Image" class="contact-img">`
                : '';

            // Add favourite icon (always visible, toggleable)
            const favBtnHtml = `
                <button class="favourite-btn${contact.favorite ? ' active' : ''}" 
                    title="${contact.favorite ? 'Remove from favourites' : 'Add to favourites'}"
                    onclick="phonebook.toggleFavourite('${contact._id}')">
                    <i class="fas fa-star"></i>
                </button>
            `;

            card.innerHTML = `
                <div>
                    ${imgHtml}
                    <h3>${contact.name}</h3>
                    <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                    ${contact.email ? `<p><i class="fas fa-envelope"></i> ${contact.email}</p>` : ''}
                    ${contact.address ? `<p><i class="fas fa-home"></i> ${contact.address}</p>` : ''}
                </div>
                <div class="contact-actions">
                    ${favBtnHtml}
                    <button class="edit-btn" data-contact-id="${contact._id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-contact-id="${contact._id}" data-contact-name="${contact.name.replace(/"/g, '"')}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            contactsList.appendChild(card);
        });
    }

    searchContacts(query) {
        const lowerQuery = query.toLowerCase();
        const filtered = this.contacts.filter(contact =>
            contact.name.toLowerCase().includes(lowerQuery) ||
            contact.phone.includes(query) ||
            (contact.email && contact.email.toLowerCase().includes(lowerQuery)) ||
            (contact.address && contact.address.toLowerCase().includes(lowerQuery))
        );
        this.renderContacts(filtered);
    }

    openModal(contact = null) {
        const modal = document.getElementById('contactModal');
        modal.style.display = 'block';

        if (contact) {
            this.currentContactId = contact._id;
            document.getElementById('modalTitle').innerText = 'Edit Contact';
            document.getElementById('name').value = contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('email').value = contact.email || '';
            document.getElementById('address').value = contact.address || '';
            document.getElementById('notes').value = contact.notes || '';
            this.contactImageDataUrl = contact.image || "";
            document.getElementById('contactImage').value = "";
        } else {
            this.currentContactId = null;
            document.getElementById('modalTitle').innerText = 'Add Contact';
            document.getElementById('contactForm').reset();
            this.contactImageDataUrl = "";
            document.getElementById('contactImage').value = "";
        }
    }

    closeModal() {
        document.getElementById('contactModal').style.display = 'none';
    }

    // Show delete confirmation dialog
    showDeleteDialog(contactId, contactName) {
        this.currentContactId = contactId;
        document.getElementById('deleteContactName').textContent = contactName;
        document.getElementById('deleteModal').style.display = 'block';
    }

    // Overwrite deleteContact to close dialog after delete
    async deleteContact() {
        try {
            const response = await fetch(`${this.apiUrl}/${this.currentContactId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            this.closeDeleteModal();
            await this.loadContacts();
        } catch (err) {
            alert("Could not delete contact. Check backend and browser console.");
            console.error("Error deleting contact:", err);
        }
    }

    // Add closeDeleteModal to hide the dialog
    closeDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        this.currentContactId = null;
    }

    // Add this method to toggle favourite status and update backend
    async toggleFavourite(contactId) {
        const idx = this.contacts.findIndex(c => String(c._id) === String(contactId));
        if (idx !== -1) {
            // Toggle favourite
            const updatedContact = { ...this.contacts[idx], favorite: !this.contacts[idx].favorite };
            try {
                const response = await fetch(`${this.apiUrl}/${contactId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(updatedContact)
                });
                if (!response.ok) throw new Error("Failed to update favourite");
                await this.loadContacts();
            } catch (err) {
                alert("Could not update favourite. Check backend and browser console.");
                console.error("Error updating favourite:", err);
            }
        }
    }

    toggleFavoritesView() {
        this.showingFavorites = !this.showingFavorites;
        const favoritesBtn = document.getElementById('favoritesBtn');
        
        if (this.showingFavorites) {
            const favoritesList = this.contacts.filter(contact => contact.favorite);
            this.renderContacts(favoritesList);
            favoritesBtn.classList.add('active');
        } else {
            this.renderContacts();
            favoritesBtn.classList.remove('active');
        }
    }

    updateFavoritesCount() {
        const favoritesCount = this.contacts.filter(contact => contact.favorite).length;
        document.getElementById('favoritesCount').innerText = favoritesCount;
    }
}

// Initialize app
const phonebook = new Phonebook();
