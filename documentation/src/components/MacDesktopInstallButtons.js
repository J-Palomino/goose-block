import Link from "@docusaurus/Link";
import { IconDownload } from "@site/src/components/icons/download";

const DesktopInstallButtons = () => {
  return (
    <div>
      <p>To download Daisy Desktop for macOS, click one of the buttons below:</p>
      <div className="pill-button">
        <Link
          className="button button--primary button--lg"
          to="https://github.com/block/daisy/releases/download/stable/Daisy.zip"
        >
          <IconDownload /> macOS Silicon
        </Link>
        <Link
          className="button button--primary button--lg"
          to="https://github.com/block/daisy/releases/download/stable/Daisy_intel_mac.zip"
        >
          <IconDownload /> macOS Intel
        </Link>
      </div>
    </div>
  );
};

export default DesktopInstallButtons;
