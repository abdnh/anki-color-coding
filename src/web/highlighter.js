function _ColorCodingSetKeyHandler(config, editable) {
    editable.addEventListener("keyup", (e) => {
        if (e.which == 32) {
            ColorCodingHighlight(config, editable);
        }
    });
}

async function ColorCodingSetup(config) {
    if (document.getElementById("fields")) {
        [...document.getElementById("fields").children].forEach((field) => {
            const editable = field.editingArea.editable;
            _ColorCodingSetKeyHandler(config, editable);
            ColorCodingHighlight(config, editable);
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
            _ColorCodingSetKeyHandler(config, editable);
            ColorCodingHighlight(config, editable);
        });
    }
}

function ColorCodingHighlight(config, editable) {
    const instance = new Mark(editable);
    for (const [word, color] of Object.entries(config)) {
        instance.markRegExp(new RegExp(word, "g"), {
            element: "span",
            className: "",
            acrossElements: true,
            each: (e) => {
                e.style.color = color;
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
