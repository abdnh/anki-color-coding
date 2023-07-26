import json
import os
from typing import Dict, List, Optional

from aqt import gui_hooks, mw
from aqt.editor import Editor
from aqt.qt import *
from aqt.webview import WebContent

addon_folder = os.path.dirname(__file__)


def read_config() -> Dict[str, str]:
    filepath = os.path.join(addon_folder, "user_files", "config.json")
    with open(filepath, "r", encoding="utf-8") as file:
        data = json.load(file)
        return data


def write_config(config: Dict[str, str]):
    filepath = os.path.join(addon_folder, "user_files", "config.json")
    with open(filepath, "w", encoding="utf-8") as file:
        file.write(json.dumps(config))


class MainWindow(QMainWindow):
    def __init__(self, parent: QWidget, editor: Optional[Editor] = None):
        super().__init__(parent)
        self.editor = editor

        self.setWindowTitle("Setup Color Coding Options")
        self.vbox = QVBoxLayout()
        self.text = QTextEdit(self)
        self.text.setText(json.dumps(read_config()))

        self.saveButton = QPushButton("Save", self)
        self.saveButton.clicked.connect(self.the_button_was_clicked)

        self.cancelButton = QPushButton("Cancel", self)
        self.cancelButton.clicked.connect(self.cancel_btn_clicked)

        self.btns = QWidget(self)
        self.btn_layout = QHBoxLayout()
        self.btn_layout.addWidget(self.cancelButton)
        self.btn_layout.addWidget(self.saveButton)
        self.btns.setLayout(self.btn_layout)

        self.vbox.addWidget(self.text)
        self.vbox.addWidget(self.btns)
        self.mayor_widget = QWidget(self)
        self.mayor_widget.setLayout(self.vbox)

        self.setCentralWidget(self.mayor_widget)

    def the_button_was_clicked(self):
        plain_text = self.text.toPlainText()
        config = json.loads(plain_text)
        write_config(config)
        if self.editor:
            self.editor.web.eval("ColorCodingSetConfig(%s)" % json.dumps(config))

        self.close()

    def cancel_btn_clicked(self):
        self.close()


def show_config(parent: Optional[QWidget] = None, editor: Optional[Editor] = None):
    widget = MainWindow(parent or mw, editor)
    widget.show()


def add_editor_button(buttons: List[str], editor: Editor) -> None:
    icon_path = os.path.join(addon_folder, "icon.png")
    btn = editor.addButton(
        icon_path,
        "color_coding",
        lambda e: show_config(e.widget, e),
        tip="ColorCoding config",
        label="ColorCoding",
        rightside=False,
    )
    buttons.append(btn)


def on_editor_did_load_note(editor: Editor) -> None:
    config = read_config()
    editor.web.eval(
        "ColorCodingSetConfig(%s); ColorCodingSetup();" % json.dumps(config)
    )


web_base = f"/_addons/{mw.addonManager.addonFromModule(__name__)}/web"


def inject_script(web_content: WebContent, context: Optional[object]) -> None:
    if isinstance(context, Editor):
        web_content.js.append(f"{web_base}/highlighter.js")
        web_content.js.append(f"{web_base}/vendor/mark.min.js")


action = QAction("Color Coding...", mw)
qconnect(action.triggered, show_config)
mw.form.menuTools.addAction(action)

gui_hooks.editor_did_init_buttons.append(add_editor_button)
gui_hooks.editor_did_load_note.append(on_editor_did_load_note)
gui_hooks.webview_will_set_content.append(inject_script)
mw.addonManager.setWebExports(__name__, r"web/.*")
