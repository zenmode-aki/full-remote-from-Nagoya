// Rich Text Editor Functionality
let isEditMode = false;
let currentSelection = null;

// Image Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.profile-image');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all images and dots
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current image and dot
        images[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }

    // Function to go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % images.length;
        showSlide(next);
    }

    // Auto-play carousel
    function startCarousel() {
        slideInterval = setInterval(nextSlide, 4000); // Change image every 4 seconds
    }

    // Stop auto-play
    function stopCarousel() {
        clearInterval(slideInterval);
    }

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopCarousel();
            startCarousel(); // Restart auto-play
        });
    });

    // Pause auto-play on hover
    const carousel = document.querySelector('.image-carousel');
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);

    // Start the carousel
    startCarousel();

    // Rich Text Editor Setup
    setupRichTextEditor();
    
    // Theme Toggle Setup
    setupThemeToggle();

    // Accordion Behavior Setup
    setupAccordionBehavior();
});

function setupRichTextEditor() {
    const editModeBtn = document.getElementById('edit-mode-btn');
    const editStatus = document.getElementById('edit-status');
    const toolbar = document.getElementById('editing-toolbar');
    
    // Make all text elements editable when clicked
    document.querySelectorAll('p, h2, h4, li').forEach(element => {
        element.classList.add('editable');
    });

    // Toggle edit mode
    editModeBtn.addEventListener('click', () => {
        isEditMode = !isEditMode;
        document.body.classList.toggle('edit-mode', isEditMode);
        
        if (isEditMode) {
            editStatus.textContent = 'Edit Mode: ON - Click any text to edit';
            editModeBtn.innerHTML = '<i class="fas fa-eye"></i>';
            enableEditing();
        } else {
            editStatus.textContent = 'Edit Mode: OFF';
            editModeBtn.innerHTML = '<i class="fas fa-edit"></i>';
            disableEditing();
        }
    });

    // Toolbar buttons
    document.getElementById('bold-btn').addEventListener('click', () => applyFormat('bold'));
    document.getElementById('italic-btn').addEventListener('click', () => applyFormat('italic'));
    document.getElementById('underline-btn').addEventListener('click', () => applyFormat('underline'));
    document.getElementById('highlight-btn').addEventListener('click', () => applyHighlight());
    document.getElementById('text-color').addEventListener('change', (e) => applyTextColor(e.target.value));
    document.getElementById('bg-color').addEventListener('change', (e) => applyBackgroundColor(e.target.value));
    document.getElementById('save-btn').addEventListener('click', saveChanges);
}

function enableEditing() {
    document.querySelectorAll('.editable').forEach(element => {
        element.contentEditable = true;
        element.addEventListener('mouseup', handleTextSelection);
        element.addEventListener('keyup', handleTextSelection);
    });
}

function disableEditing() {
    document.querySelectorAll('.editable').forEach(element => {
        element.contentEditable = false;
        element.removeEventListener('mouseup', handleTextSelection);
        element.removeEventListener('keyup', handleTextSelection);
    });
}

function handleTextSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
        currentSelection = selection.getRangeAt(0);
        showToolbar();
    }
}

function showToolbar() {
    const toolbar = document.getElementById('editing-toolbar');
    toolbar.style.display = 'flex';
}

function applyFormat(command) {
    if (currentSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(currentSelection);
        document.execCommand(command, false, null);
    }
}

function applyHighlight() {
    const bgColor = document.getElementById('bg-color').value;
    applyBackgroundColor(bgColor);
}

function applyTextColor(color) {
    if (currentSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(currentSelection);
        document.execCommand('foreColor', false, color);
    }
}

function applyBackgroundColor(color) {
    if (currentSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(currentSelection);
        document.execCommand('hiliteColor', false, color);
    }
}

function saveChanges() {
    // Here you could implement saving to localStorage or a server
    const editStatus = document.getElementById('edit-status');
    editStatus.textContent = 'Changes saved!';
    setTimeout(() => {
        editStatus.textContent = isEditMode ? 'Edit Mode: ON - Click any text to edit' : 'Edit Mode: OFF';
    }, 2000);
}

function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const icon = themeToggleBtn.querySelector('i');
    const label = themeToggleBtn.querySelector('.theme-label');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        label.textContent = 'Light Mode';
        themeToggleBtn.title = 'Switch to Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        label.textContent = 'Dark Mode';
        themeToggleBtn.title = 'Switch to Dark Mode';
    }
}

function setupAccordionBehavior() {
  const accordions = document.querySelectorAll('.horizontal-item');

  accordions.forEach(accordion => {
    accordion.addEventListener('click', (e) => {
      // Prevent the default toggle if we are clicking the summary
      if (e.target.tagName === 'SUMMARY') {
        // If it's already open, let the default behavior close it.
        if (accordion.open) return;
        
        e.preventDefault();
        
        // Close all others
        accordions.forEach(otherAccordion => {
          otherAccordion.open = false;
        });

        // Open the clicked one
        accordion.open = true;
        
        // Auto-highlight specific text when Education section is opened
        if (accordion.querySelector('summary').textContent.trim() === 'Education') {
          setTimeout(() => {
            autoHighlightText(accordion, 'Withdrew after six months.', '#ffd700');
          }, 300); // Small delay to ensure the accordion is fully opened
        }
      }
    });
  });
}

function autoHighlightText(container, targetText, highlightColor) {
  // Find all text nodes within the container
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    const text = node.textContent;
    const index = text.indexOf(targetText);
    
    if (index !== -1) {
      // Create a range for the target text
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + targetText.length);
      
      // Create a span element with highlight
      const span = document.createElement('span');
      span.style.backgroundColor = highlightColor;
      span.style.padding = '2px 4px';
      span.style.borderRadius = '3px';
      span.style.transition = 'all 0.3s ease';
      
      // Replace the text with highlighted version
      try {
        range.surroundContents(span);
      } catch (e) {
        // If surroundContents fails, use extractContents and appendChild
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }
      
      // Add a subtle animation
      setTimeout(() => {
        span.style.transform = 'scale(1.05)';
        setTimeout(() => {
          span.style.transform = 'scale(1)';
        }, 200);
      }, 100);
      
      break; // Only highlight the first occurrence
    }
  }
} 