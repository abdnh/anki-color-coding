function _ColorCodingSetKeyHandler(editable) {
    editable.addEventListener("keyup", (e) => {
        if (e.which == 32) {
            ColorCodingHighlight(editable);
        }
    });
}

function ColorCodingSetConfig(config) {
    globalThis.colorCodingConfig = config;
}

async function ColorCodingSetup() {
    if (document.getElementById("fields")) {
        [...document.getElementById("fields").children].forEach((field) => {
            const editable = field.editingArea.editable;
            _ColorCodingSetKeyHandler(editable);
            ColorCodingHighlight(editable);
        });
    } else {
        const NoteEditor = require("anki/NoteEditor");
        const svelteStore = require("svelte/store");
        while (!NoteEditor.instances[0]?.fields?.length) {
            await new Promise(requestAnimationFrame);
        }
        NoteEditor.instances[0].fields.forEach(async (field) => {
            const richText = svelteStore.get(
                field.editingArea.editingInputs
            )[0];
            const editable = await richText.element;
            _ColorCodingSetKeyHandler(editable);
            ColorCodingHighlight(editable);
        });
    }
}

function ColorCodingHighlight(editable) {
    const instance = new Mark(editable);
    for (const [word, color] of Object.entries(globalThis.colorCodingConfig)) {
        instance.markRegExp(new RegExp(word, "g"), {
            element: "span",
            className: "",
            acrossElements: true,
            each: (e) => {
                if (color === "bold") {
                    e.style.fontWeight = "bold";
                } else if (color === "italic") {
                    e.style.fontStyle = "italic";
                } else if (color === "underline") {
                    e.style.textDecoration = "underline";
                } else {
                    e.style.color = color;
                }
            },
            filter: (e) => {
                if (e.parentNode.dataset && e.parentNode.dataset.markjs) {
                    return false;
                }
                return true;
            },
        });
    }
}
