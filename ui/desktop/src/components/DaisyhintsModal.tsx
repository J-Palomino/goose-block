import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Check } from './icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const ModalHelpText = () => (
  <div className="text-sm flex-col space-y-4">
    <p>
      .daisyhints is a text file used to provide additional context about your project and improve
      the communication with Daisy.
    </p>
    <p>
      Please make sure <span className="font-bold">Developer</span> extension is enabled in the
      settings page. This extension is required to use .daisyhints. You'll need to restart your
      session for .daisyhints updates to take effect.
    </p>
    <p>
      See{' '}
      <Button
        variant="link"
        className="text-blue-500 hover:text-blue-600 p-0 h-auto"
        onClick={() =>
          window.open('https://block.github.io/daisy/docs/guides/using-daisyhints/', '_blank')
        }
      >
        using .daisyhints
      </Button>{' '}
      for more information.
    </p>
  </div>
);

const ModalError = ({ error }: { error: Error }) => (
  <div className="text-sm text-textSubtle">
    <div className="text-red-600">Error reading .daisyhints file: {JSON.stringify(error)}</div>
  </div>
);

const ModalFileInfo = ({ filePath, found }: { filePath: string; found: boolean }) => (
  <div className="text-sm font-medium">
    {found ? (
      <div className="text-green-600">
        <Check className="w-4 h-4 inline-block" /> .daisyhints file found at: {filePath}
      </div>
    ) : (
      <div>Creating new .daisyhints file at: {filePath}</div>
    )}
  </div>
);

const getDaisyhintsFile = async (filePath: string) => await window.electron.readFile(filePath);

type DaisyhintsModalProps = {
  directory: string;
  setIsDaisyhintsModalOpen: (isOpen: boolean) => void;
};

export const DaisyhintsModal = ({ directory, setIsDaisyhintsModalOpen }: DaisyhintsModalProps) => {
  const daisyhintsFilePath = `${directory}/.daisyhints`;
  const [daisyhintsFile, setDaisyhintsFile] = useState<string>('');
  const [daisyhintsFileFound, setDaisyhintsFileFound] = useState<boolean>(false);
  const [daisyhintsFileReadError, setDaisyhintsFileReadError] = useState<string>('');

  useEffect(() => {
    const fetchDaisyhintsFile = async () => {
      try {
        const { file, error, found } = await getDaisyhintsFile(daisyhintsFilePath);
        setDaisyhintsFile(file);
        setDaisyhintsFileFound(found);
        // Only set error if file was found but there was an actual read error
        // If file is not found, treat it as creating a new file (no error)
        setDaisyhintsFileReadError(found && error ? error : '');
      } catch (error) {
        console.error('Error fetching .daisyhints file:', error);
        setDaisyhintsFileReadError('Failed to access .daisyhints file');
      }
    };
    if (directory) fetchDaisyhintsFile();
  }, [directory, daisyhintsFilePath]);

  const writeFile = async () => {
    await window.electron.writeFile(daisyhintsFilePath, daisyhintsFile);
    setIsDaisyhintsModalOpen(false);
  };

  const handleClose = () => {
    setIsDaisyhintsModalOpen(false);
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[80%] sm:max-h-[80%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Configure .daisyhints</DialogTitle>
          <DialogDescription>
            Configure your project's .daisyhints file to provide additional context to Daisy.
          </DialogDescription>
        </DialogHeader>

        <ModalHelpText />

        <div className="py-4">
          {daisyhintsFileReadError ? (
            <ModalError error={new Error(daisyhintsFileReadError)} />
          ) : (
            <div className="space-y-2">
              <ModalFileInfo filePath={daisyhintsFilePath} found={daisyhintsFileFound} />
              <textarea
                defaultValue={daisyhintsFile}
                autoFocus
                className="w-full h-80 border rounded-md p-2 text-sm resize-none bg-background-default text-textStandard border-borderStandard focus:outline-none"
                onChange={(event) => setDaisyhintsFile(event.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={writeFile}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
