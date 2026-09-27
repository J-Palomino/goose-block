import Link from "@docusaurus/Link";
import { IconDownload } from "@site/src/components/icons/download";

const WindowsDesktopInstallButtons = () => {
  return (
    <div>
      <p>To download Daisy Desktop for Windows, click the button below:</p>
      <div className="pill-button">
        <Link
          className="button button--primary button--lg"
          to="https://github.com/block/daisy/releases/download/stable/Daisy-win32-x64.zip"
        >
          <IconDownload /> Windows
        </Link>
      </div>
    </div>
  );
};

export default WindowsDesktopInstallButtons;
