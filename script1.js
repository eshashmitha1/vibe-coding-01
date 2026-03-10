document.addEventListener('DOMContentLoaded', () => {
    const ideaInput = document.getElementById('ideaInput');
    const categorySelect = document.getElementById('categorySelect');
    const addBtn = document.querySelector('.btn-primary');
    const boardGrid = document.querySelector('.board-grid');

    // Function to create a new idea card
    function createIdeaCard(text, category) {
        const card = document.createElement('div');
        card.className = `card category-${category} animate-in`;
        
        const dateStr = 'Just now';
        const authorName = 'You';
        const initials = 'YO';

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <span class="tag">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span class="date">${dateStr}</span>
                </div>
                <div class="card-options">
                    <button class="edit-btn" title="Edit">✎</button>
                    <button class="delete-btn" title="Delete">×</button>
                </div>
            </div>
            <div class="card-body">
                <p class="idea-text">${text}</p>
            </div>
            <div class="card-footer">
                <div class="author">
                    <div class="avatar">${initials}</div>
                    <span>${authorName}</span>
                </div>
                <button class="vote-btn">▲ 0</button>
            </div>
        `;

        attachCardEvents(card);
        return card;
    }

    // Attach all event listeners to a card
    function attachCardEvents(card) {
        const deleteBtn = card.querySelector('.delete-btn');
        const editBtn = card.querySelector('.edit-btn');
        const voteBtn = card.querySelector('.vote-btn');

        deleteBtn.addEventListener('click', () => handleDelete(card));
        editBtn.addEventListener('click', () => handleEdit(card, editBtn));
        voteBtn.addEventListener('click', () => handleVote(voteBtn));
    }

    // Handle Delete
    function handleDelete(card) {
        if (confirm('Are you sure you want to delete this idea?')) {
            card.classList.add('fade-out');
            setTimeout(() => {
                card.remove();
            }, 300);
        }
    }

    // Handle Edit
    function handleEdit(card, btn) {
        const body = card.querySelector('.card-body');
        const textElement = body.querySelector('.idea-text');
        const isEditing = card.classList.contains('editing');

        if (!isEditing) {
            // Switch to edit mode
            const currentText = textElement.innerText;
            body.innerHTML = `<textarea class="edit-textarea">${currentText}</textarea>`;
            btn.innerText = '💾';
            btn.title = 'Save';
            card.classList.add('editing');
            body.querySelector('.edit-textarea').focus();
        } else {
            // Save changes
            const newText = body.querySelector('.edit-textarea').value.trim();
            if (newText === '') return;
            
            body.innerHTML = `<p class="idea-text">${newText}</p>`;
            btn.innerText = '✎';
            btn.title = 'Edit';
            card.classList.remove('editing');
        }
    }

    // Function to handle voting
    function handleVote(button) {
        const currentVotes = parseInt(button.innerText.replace('▲ ', ''));
        button.innerText = `▲ ${currentVotes + 1}`;
        button.classList.add('voted');
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }

    // Add Idea Event
    addBtn.addEventListener('click', () => {
        const text = ideaInput.value.trim();
        const category = categorySelect.value;

        if (text === '') {
            ideaInput.classList.add('shake');
            setTimeout(() => ideaInput.classList.remove('shake'), 500);
            return;
        }

        const newCard = createIdeaCard(text, category);
        boardGrid.prepend(newCard);
        
        ideaInput.value = '';
        ideaInput.focus();
    });

    // Initialize existing cards
    document.querySelectorAll('.card').forEach(card => {
        // Add delete/edit buttons to static HTML if they don't exist
        if (!card.querySelector('.card-options')) {
            const header = card.querySelector('.card-header');
            const options = document.createElement('div');
            options.className = 'card-options';
            options.innerHTML = `
                <button class="edit-btn" title="Edit">✎</button>
                <button class="delete-btn" title="Delete">×</button>
            `;
            header.appendChild(options);

            // Add class to paragraph for consistency
            const p = card.querySelector('.card-body p');
            p.classList.add('idea-text');
        }
        attachCardEvents(card);
    });

    // Enter key support
    ideaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });
});
