#Copyright © 2022 Marc Schubert <schubert.mc.ai@gmail.com>

from anki import hooks
from aqt import mw
from aqt.qt import *
from aqt import gui_hooks
import os
import json
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QMainWindow, QTextEdit

addon_folder = os.path.dirname(__file__)

def read_json():
    filepath = os.path.join(addon_folder,"user_files","config.json")
    file = open(filepath)
    data = json.load(file)
    return data

def write_json(dump):
    filepath = os.path.join(addon_folder , "user_files" , "config.json")
    file = open(filepath, "w")
    file.write(json.dumps(dump))
    return 0

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Setup Color Coding Options")
        self.layout = QVBoxLayout()
        self.text =QTextEdit()
        self.text.setText(json.dumps(read_json()))

        self.saveButton = QPushButton("Save")
        self.saveButton.clicked.connect(self.the_button_was_clicked)

        self.cancelButton = QPushButton("Cancel")
        self.cancelButton.clicked.connect(self.cancel_btn_clicked)

        self.btns = QWidget()
        self.btn_layout = QHBoxLayout()
        self.btn_layout.addWidget(self.cancelButton)
        self.btn_layout.addWidget(self.saveButton)
        self.btns.setLayout(self.btn_layout)

        self.layout.addWidget(self.text)
        self.layout.addWidget(self.btns)
        self.mayor_widget = QWidget()
        self.mayor_widget.setLayout(self.layout)

        self.setCentralWidget(self.mayor_widget)

    def the_button_was_clicked(self):
        plain_text = self.text.toPlainText()
        write_json(json.loads(plain_text))
        self.close()
        #for editor in editors:
            #sendNewWords(editor)
            #loadJSFile(editor)

    def cancel_btn_clicked(self):
        self.close()

# Setup Color Coding...
def color_setup_gui():
    mw.myWidget = widget = MainWindow()
    widget.show()

def color_setup_gui_from_button(loose):
    mw.myWidget = widget = MainWindow()
    widget.show()


def pressed_color_current_words_btn(editor):
    web = editor.web
    loadJSFile(web)

def loadJSFile(webview):
    js_path = os.path.join(addon_folder,"changer.js")
    with open(js_path, "r", encoding="utf-8") as js_file:
        js = js_file.read()
        webview.eval(js)
        data = read_json()
        dumped_words = list(data.keys())
        dumped_colors = list(data.values())
      
        webview.eval("getTheWords(%s)" %dumped_words)
        webview.eval("getTheColors(%s)" %dumped_colors)


def sendNewWords(webview):
    data = read_json()
    dumped_words = list(data.keys())
    dumped_colors = list(data.values())
    webview.eval("getTheWords(%s)" % dumped_words)
    webview.eval("getTheColors(%s)" % dumped_colors)

def runThrough_thenupdate(editor):
    web = editor.web
    loadJSFile(web)
    color_setup_gui_from_button("none")


def loadJSFile_livechanger(webview):
    js_path = os.path.join(addon_folder,"live_changer.js")
    #showInfo("loads...")
    with open(js_path, "r", encoding="utf-8") as js_file:
        js = js_file.read()
        webview.eval(js)
        data = read_json()
        dumped_words = list(data.keys())
        dumped_colors = list(data.values())
        webview.eval("getTheWords(%s)" %dumped_words)
        webview.eval("getTheColors(%s)" %dumped_colors)



def setupButtons(buttons, editor):
    icon_path = os.path.join(addon_folder,"icon.png")
    btn = editor.addButton(icon_path,
                           "foo",
                           runThrough_thenupdate,
                           tip= "Color current Words",
                           label = "ColorCoding",
                           rightside=False
                           )
    buttons.append(btn)

def setupLiveChanger(editor)->None:
    web = editor.web
    loadJSFile_livechanger(web)

action2 = QAction("Color Coding...", mw)
qconnect(action2.triggered, color_setup_gui)
mw.form.menuTools.addAction(action2)



editors = []
def add_to_editors(editor)->None:
    editor = editor.web
    editors.append(editor)

gui_hooks.editor_did_init_buttons.append(setupButtons)
gui_hooks.editor_did_init.append(setupLiveChanger)
gui_hooks.editor_did_init.append(add_to_editors)




