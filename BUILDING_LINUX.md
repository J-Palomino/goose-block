# Building Daisy Desktop on Linux

This guide covers building the Daisy Desktop application from source on various Linux distributions.

## Prerequisites

### System Dependencies

**Debian/Ubuntu:**
```bash
sudo apt update
sudo apt install -y dpkg fakeroot build-essential libxcb1-dev libxcb-util-dev protobuf-compiler
```

**Arch/Manjaro:**
```bash
sudo pacman -S --needed dpkg fakeroot base-devel
```

**Fedora/RHEL/CentOS:**
```bash
sudo dnf install dpkg-dev fakeroot gcc gcc-c++ make
```

**openSUSE:**
```bash
sudo zypper install dpkg fakeroot gcc gcc-c++ make
```

**android / termux:**

daisy is not officially support termux build yet, you need some minor patch to fix build issues.
We will publish daisy (block-daisy) into termux-packages.
If you want to try there is a non-official build, https://github.com/shawn111/daisy/releases/download/termux/daisy-termux-aarch64.tar.bz2
For more details, see: https://github.com/block/daisy/pull/3890

```bash
pkg install rust
pkg install cmake protobuf clang build-essential
```

### Development Tools

- **Rust**: Install via [rustup](https://rustup.rs/)
- **Node.js**: Version 22.9.0 or later (use [nvm](https://github.com/nvm-sh/nvm) for version management)
- **npm**: Comes with Node.js

## Build Process

### 1. Clone and Setup
```bash
git clone https://github.com/block/daisy.git
cd daisy
```

### 2. Build the Rust Backend
```bash
cargo build --release -p daisy-server
```

### 3. Prepare the Desktop Application
```bash
cd ui/desktop
npm install

# Copy the server binary to the expected location
mkdir -p src/bin
cp ../../target/release/daisyd src/bin/
```

### 4. Build the Application

#### Option A: ZIP Distribution (Recommended)
Works on all Linux distributions:
```bash
npm run make -- --targets=@electron-forge/maker-zip
```

Output: `out/make/zip/linux/x64/Daisy-linux-x64-{version}.zip`

#### Option B: DEB Package
For Debian/Ubuntu systems:
```bash
npm run make -- --targets=@electron-forge/maker-deb
```

Output: `out/make/deb/x64/daisy_{version}_amd64.deb`

#### Option C: Both Formats
```bash
npm run make
```

### 5. Run the Application

#### From Build Directory
```bash
./out/Daisy-linux-x64/Daisy
```

#### Install DEB Package (if built)
```bash
sudo dpkg -i out/make/deb/x64/daisy_*.deb
```

## Troubleshooting

### Common Issues

#### Missing System Dependencies
If you see errors about missing `dpkg` or `fakeroot`:
```bash
# Install the missing packages for your distribution (see Prerequisites above)
```

#### GLib Warnings
You may see warnings like:
```
GLib-GObject: instance has no handler with id
```
These are harmless and don't affect functionality. To suppress them, create a launcher script:

```bash
#!/bin/bash
cd /path/to/daisy/ui/desktop/out/Daisy-linux-x64
./Daisy 2>&1 | grep -v "GLib-GObject" | grep -v "browser_main_loop"
```

#### Server Binary Not Found
If you see "Could not find daisyd binary", ensure you've:
1. Built the Rust backend: `cargo build --release -p daisy-server`
2. Copied it to the right location: `cp ../../target/release/daisyd src/bin/`
3. Rebuilt the application: `npm run make`

### Distribution-Specific Notes

#### Arch/Manjaro
- The RPM maker is disabled by default as it's not compatible with Arch-based systems
- Use the ZIP distribution method for maximum compatibility

#### Flatpak/Snap
Building as Flatpak or Snap packages is not currently supported but may be added in the future.

## Development Workflow

For active development:

1. **Backend changes**: Rebuild with `cargo build --release -p daisy-server` and copy the binary
2. **Frontend changes**: Use `npm run start` for hot reload during development
3. **Full rebuild**: Run the complete build process above

## Creating System Integration

### Desktop Entry
Create `~/.local/share/applications/daisy.desktop`:
```ini
[Desktop Entry]
Name=Daisy AI Agent
Comment=Local AI agent for development tasks
Exec=/path/to/daisy/ui/desktop/out/Daisy-linux-x64/Daisy %U
Icon=/path/to/daisy/ui/desktop/out/Daisy-linux-x64/resources/app.asar.unpacked/src/images/icon.png
Terminal=false
Type=Application
Categories=Development;Utility;
StartupNotify=true
MimeType=x-scheme-handler/daisy
```

### System-wide Installation
To install system-wide:
```bash
sudo cp -r out/Daisy-linux-x64 /opt/daisy
sudo ln -s /opt/daisy/Daisy /usr/local/bin/daisy-gui
```

## Contributing

When contributing changes that affect the Linux build process, please:

1. Test on multiple distributions if possible
2. Update this documentation
3. Update `ui/desktop/README.md` if needed
4. Consider CI/CD implications for automated builds
