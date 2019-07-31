/**
 * FilezillaMenu for GNOME Shell
 *
 * Copyright (c) 2014 Gary Sandi Vigabriel <gary.gsv@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const St = imports.gi.St;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;
const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;


const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const FilezillaMenu = new Lang.Class({
    Name: 'FilezillaMenu.FilezillaMenu',
    Extends: PanelMenu.Button,

    _init: function() {
        this.parent(0.0, _("filezilla"));

        let hbox = new St.BoxLayout({ style_class: 'panel-status-menu-box' });
        let icon = new St.Icon({ style_class:'filezilla_icon'});
        hbox.add_child(icon);

        this.actor.add_child(hbox);

        try {
            let userdir = String(GLib.get_home_dir());
            let sitemanager = userdir + '/.config/filezilla/sitemanager.xml';
            let content = Shell.get_file_contents_utf8_sync(sitemanager);
            let lines = content.toString().split('\n');
            for (let i=0; i<lines.length; i++) {
                if (lines[i].includes('<Name>')) {
                    let id = lines[i].replace('<Name>', '').replace('</Name>', '').trim();
                    this.menu.addAction(id, function(event) {
                        Util.spawn(['filezilla', '-c', '0/' + id]);
                    });
                }
            }
        } catch (err) {
            Main.notifyError("Error reading file");
        }
    },
});

function init() {
}

let _indicator;

function enable() {
    // check if filezilla is installed
    try {
        Util.trySpawn(['filezilla','--help']);
    } catch (err) {
        Main.notifyError("Error : " + err.message);
        throw err;
    }
    _indicator = new FilezillaMenu;
    Main.panel.addToStatusArea('filezilla-menu', _indicator);
}

function disable() {
    _indicator.destroy();
}

