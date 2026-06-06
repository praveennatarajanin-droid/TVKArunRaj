/**
 * TVK Visual Layout Editor Canvas Controller
 * This script runs inside the index.html?mode=editor iframe canvas.
 */
(function() {
  console.log("TVK Visual Layout Editor Canvas Mode initialized.");

  // Inject Custom Styles
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    .editor-hovered {
      outline: 2px dashed #3b82f6 !important;
      outline-offset: -2px !important;
      cursor: grab !important;
    }
    .editor-selected {
      outline: 3px solid #1d4ed8 !important;
      outline-offset: -3px !important;
      box-shadow: 0 0 15px rgba(29, 78, 216, 0.4) !important;
    }
    .editor-floating-toolbar {
      position: absolute;
      background: #1e293b;
      border-radius: 8px;
      padding: 6px 8px;
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      max-width: 380px;
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.5);
      border: 1px solid #475569;
      z-index: 9999999;
      align-items: center;
    }
    .editor-toolbar-section {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .editor-toolbar-divider {
      width: 1px;
      height: 24px;
      background: #475569;
      margin: 0 2px;
    }
    .editor-floating-toolbar button {
      background: #334155;
      border: none;
      color: #f8fafc;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.1s ease;
      flex-shrink: 0;
    }
    .editor-floating-toolbar button:hover {
      background: #3b82f6;
      color: #fff;
    }
    .editor-floating-toolbar button:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .editor-floating-toolbar button:disabled:hover {
      background: #334155;
    }
    .editor-floating-toolbar button.btn-save {
      background: #10b981;
      width: auto;
      padding: 0 10px;
      font-weight: 700;
      font-size: 0.75rem;
      gap: 0.35rem;
    }
    .editor-floating-toolbar button.btn-save:hover {
      background: #059669;
    }
    .editor-floating-toolbar button.btn-hide {
      background: #64748b;
    }
    .editor-floating-toolbar button.btn-hide:hover {
      background: #f59e0b;
    }
    .editor-floating-toolbar button.btn-delete {
      background: #334155;
      color: #f87171;
    }
    .editor-floating-toolbar button.btn-delete:hover {
      background: #ef4444;
      color: #fff;
    }
    .editor-badge {
      position: absolute;
      top: -24px;
      left: 0;
      background: #1d4ed8;
      color: #fff;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px 4px 0 0;
      pointer-events: none;
      white-space: nowrap;
    }
    /* Prevent links from navigating out of canvas */
    a {
      pointer-events: none !important;
    }
    .editor-floating-toolbar button {
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(styleEl);

  let selectedElement = null;
  let hoveredElement = null;
  let draggedElement = null;
  let toolbarEl = null;

  // Track hidden sections
  let hiddenSections = [];

  const sectionSelector = "#homepage-sections-container > section";
  const cardSelector = ".hero-col-side .side-news-card, .latest-card, .grid-card, .category-feed-item, .initiative-card, .community-card";

  // Re-bind event listeners for editor mode
  const initEditorElements = () => {
    // Target sections
    document.querySelectorAll(sectionSelector).forEach(el => {
      if (!el.hasAttribute("data-editor-init")) {
        setupElement(el, "Section: " + (el.id || "Unnamed"));
      }
    });

    // Target sub-cards
    document.querySelectorAll(cardSelector).forEach(el => {
      if (!el.hasAttribute("data-editor-init")) {
        setupElement(el, "Card Item");
      }
    });

    // Handle inline double-click text editing
    document.querySelectorAll("h1, h2, h3, h4, h5, p").forEach(textEl => {
      if (textEl.closest(".editor-floating-toolbar")) return;
      if (textEl.hasAttribute("data-editor-text-init")) return;
      textEl.setAttribute("data-editor-text-init", "true");
      textEl.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        textEl.contentEditable = "true";
        textEl.focus();
        textEl.style.outline = "2px solid #10b981";
        textEl.addEventListener("blur", () => {
          textEl.contentEditable = "false";
          textEl.style.outline = "";
          notifyChanges();
        }, { once: true });
      });
    });
  };

  const setupElement = (el, typeLabel) => {
    el.setAttribute("draggable", "true");
    el.setAttribute("data-editor-label", typeLabel);
    el.setAttribute("data-editor-init", "true");

    // Hover Highlight
    el.addEventListener("mouseover", (e) => {
      e.stopPropagation();
      if (selectedElement === el) return;
      if (hoveredElement && hoveredElement !== el) {
        hoveredElement.classList.remove("editor-hovered");
      }
      hoveredElement = el;
      el.classList.add("editor-hovered");
    });

    el.addEventListener("mouseout", (e) => {
      e.stopPropagation();
      el.classList.remove("editor-hovered");
      if (hoveredElement === el) hoveredElement = null;
    });

    // Selection click
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectElement(el);
    });

    // Drag and Drop
    el.addEventListener("dragstart", (e) => {
      draggedElement = el;
      e.dataTransfer.effectAllowed = "move";
      el.style.opacity = "0.5";
    });

    el.addEventListener("dragend", () => {
      el.style.opacity = "";
      document.querySelectorAll(".editor-hovered").forEach(h => h.classList.remove("editor-hovered"));
      draggedElement = null;
    });

    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      return false;
    });

    el.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (draggedElement && draggedElement !== el && draggedElement.parentNode === el.parentNode) {
        const rect = el.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          el.parentNode.insertBefore(draggedElement, el);
        } else {
          el.parentNode.insertBefore(draggedElement, el.nextSibling);
        }
        notifyChanges();
        if (selectedElement) selectElement(selectedElement);
      }
    });
  };

  const selectElement = (el) => {
    if (selectedElement) {
      selectedElement.classList.remove("editor-selected");
      removeToolbar();
    }

    selectedElement = el;
    el.classList.add("editor-selected");
    createToolbar(el);
  };

  // Helper: make a toolbar button
  const makeBtn = (icon, title, colorClass, handler, disabled) => {
    const btn = document.createElement("button");
    btn.className = "editor-btn" + (colorClass ? " " + colorClass : "");
    btn.title = title;
    btn.innerHTML = `<i class="fas ${icon}"></i>`;
    if (disabled) btn.disabled = true;
    btn.onclick = handler;
    return btn;
  };

  const createToolbar = (el) => {
    removeToolbar();

    const rect = el.getBoundingClientRect();
    const typeLabel = el.getAttribute("data-editor-label") || "Element";

    toolbarEl = document.createElement("div");
    toolbarEl.className = "editor-floating-toolbar";

    // Position: above the selected element, clamped to viewport
    const toolbarWidth = 360;
    let leftPos = rect.left + (rect.width / 2) - (toolbarWidth / 2);
    leftPos = Math.max(8, Math.min(leftPos, window.innerWidth - toolbarWidth - 8));
    const topPos = window.scrollY + rect.top - 52;

    toolbarEl.style.top = `${topPos}px`;
    toolbarEl.style.left = `${leftPos}px`;

    // Badge showing element type
    const badge = document.createElement("div");
    badge.className = "editor-badge";
    badge.textContent = typeLabel;
    toolbarEl.appendChild(badge);

    // --- MOVE DIRECTION GROUP (always shows all 4) ---
    const moveGroup = document.createElement("div");
    moveGroup.className = "editor-toolbar-section";

    const hasPrev = !!el.previousElementSibling;
    const hasNext = !!el.nextElementSibling;

    // Move Up button (moves element before its previous sibling)
    moveGroup.appendChild(makeBtn("fa-arrow-up", "Move Up", "", () => {
      const prev = el.previousElementSibling;
      if (prev) {
        el.parentNode.insertBefore(el, prev);
        notifyChanges();
        selectElement(el);
      }
    }, !hasPrev));

    // Move Down button (moves element after its next sibling)
    moveGroup.appendChild(makeBtn("fa-arrow-down", "Move Down", "", () => {
      const next = el.nextElementSibling;
      if (next) {
        el.parentNode.insertBefore(next, el);
        notifyChanges();
        selectElement(el);
      }
    }, !hasNext));

    // Move Left button (same as Move Up — for horizontal layouts this swaps within parent)
    moveGroup.appendChild(makeBtn("fa-arrow-left", "Move Left", "", () => {
      const prev = el.previousElementSibling;
      if (prev) {
        el.parentNode.insertBefore(el, prev);
        notifyChanges();
        selectElement(el);
      }
    }, !hasPrev));

    // Move Right button (same as Move Down for RTL/horizontal context)
    moveGroup.appendChild(makeBtn("fa-arrow-right", "Move Right", "", () => {
      const next = el.nextElementSibling;
      if (next) {
        el.parentNode.insertBefore(next, el);
        notifyChanges();
        selectElement(el);
      }
    }, !hasNext));

    toolbarEl.appendChild(moveGroup);

    // Divider
    const divider1 = document.createElement("div");
    divider1.className = "editor-toolbar-divider";
    toolbarEl.appendChild(divider1);

    // --- ACTION GROUP ---
    const actionGroup = document.createElement("div");
    actionGroup.className = "editor-toolbar-section";

    // Duplicate
    actionGroup.appendChild(makeBtn("fa-clone", "Duplicate", "", () => {
      const isSection = el.matches(sectionSelector);
      const clone = el.cloneNode(true);
      if (isSection) {
        clone.id = `${el.id}_dup_${Date.now()}`;
        clone.removeAttribute("data-editor-init");
      }
      el.parentNode.insertBefore(clone, el.nextSibling);
      initEditorElements();
      notifyChanges();
      selectElement(clone);
    }));

    // Hide
    actionGroup.appendChild(makeBtn("fa-eye-slash", "Hide Section", "btn-hide", () => {
      const isSection = el.matches(sectionSelector);
      el.style.setProperty("display", "none", "important");
      if (isSection && !hiddenSections.includes(el.id)) {
        hiddenSections.push(el.id);
      }
      if (selectedElement) {
        selectedElement.classList.remove("editor-selected");
        selectedElement = null;
      }
      removeToolbar();
      notifyChanges();
    }));

    // Delete
    actionGroup.appendChild(makeBtn("fa-trash-alt", "Delete Element", "btn-delete", () => {
      if (confirm("Permanently delete this element?")) {
        el.remove();
        if (selectedElement === el) selectedElement = null;
        removeToolbar();
        notifyChanges();
      }
    }));

    toolbarEl.appendChild(actionGroup);

    // Divider
    const divider2 = document.createElement("div");
    divider2.className = "editor-toolbar-divider";
    toolbarEl.appendChild(divider2);

    // --- SAVE BUTTON ---
    const saveBtn = document.createElement("button");
    saveBtn.className = "editor-btn btn-save";
    saveBtn.title = "Save Layout to Database";
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    saveBtn.onclick = () => {
      if (window.parent && typeof window.parent.saveLayoutState === "function") {
        window.parent.saveLayoutState();
      }
    };
    toolbarEl.appendChild(saveBtn);

    document.body.appendChild(toolbarEl);
  };

  const removeToolbar = () => {
    if (toolbarEl) {
      toolbarEl.remove();
      toolbarEl = null;
    }
  };

  // Compile and notify changes to parent window
  const notifyChanges = () => {
    const container = document.getElementById("homepage-sections-container");
    if (!container) return;

    const order = Array.from(container.children)
      .filter(el => el.tagName === "SECTION")
      .map(el => el.id);

    const layoutState = {
      section_order: order,
      hidden_sections: hiddenSections
    };

    if (window.parent && typeof window.parent.registerLayoutChange === "function") {
      window.parent.registerLayoutChange(layoutState);
    }
  };

  // Click outside deselects
  document.addEventListener("click", (e) => {
    if (
      selectedElement &&
      !selectedElement.contains(e.target) &&
      (!toolbarEl || !toolbarEl.contains(e.target))
    ) {
      selectedElement.classList.remove("editor-selected");
      selectedElement = null;
      removeToolbar();
    }
  });

  // Scroll repositions toolbar
  document.addEventListener("scroll", () => {
    if (selectedElement && toolbarEl) {
      const rect = selectedElement.getBoundingClientRect();
      toolbarEl.style.top = `${window.scrollY + rect.top - 52}px`;
    }
  });

  // External APIs for parent communication
  window.resetLayoutOrder = () => {
    hiddenSections = [];
    notifyChanges();
    window.location.reload();
  };

  window.setHiddenSections = (list) => {
    hiddenSections = list || [];
  };

  // Initial trigger
  initEditorElements();
})();
