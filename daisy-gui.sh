#!/bin/bash
# Launcher script for Daisy GUI
# Suppresses common GLib warnings that don't affect functionality

cd /home/alfonsodg/Devel-Local/oss/daisy/ui/desktop/out/Daisy-linux-x64
./Daisy 2>&1 | grep -v "GLib-GObject" | grep -v "browser_main_loop"
