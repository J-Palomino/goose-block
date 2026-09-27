import DaisyLogo from './DaisyLogo';
import AnimatedIcons from './AnimatedIcons';
import FlyingBird from './FlyingBird';
import { ChatState } from '../types/chatState';

interface LoadingDaisyProps {
  message?: string;
  chatState?: ChatState;
}

const LoadingDaisy = ({ message, chatState = ChatState.Idle }: LoadingDaisyProps) => {
  // Determine the appropriate message based on state
  const getLoadingMessage = () => {
    if (message) return message; // Custom message takes priority

    if (chatState === ChatState.Thinking) return 'daisy is thinking…';
    if (chatState === ChatState.Streaming) return 'daisy is working on it…';
    if (chatState === ChatState.WaitingForUserInput) return 'daisy is waiting…';

    // Default fallback
    return 'daisy is working on it…';
  };

  return (
    <div className="w-full animate-fade-slide-up">
      <div
        data-testid="loading-indicator"
        className="flex items-center gap-2 text-xs text-textStandard py-2"
      >
        {chatState === ChatState.Thinking ? (
          <AnimatedIcons className="flex-shrink-0" cycleInterval={600} />
        ) : chatState === ChatState.Streaming ? (
          <FlyingBird className="flex-shrink-0" cycleInterval={150} />
        ) : chatState === ChatState.WaitingForUserInput ? (
          <AnimatedIcons className="flex-shrink-0" cycleInterval={600} variant="waiting" />
        ) : (
          <DaisyLogo size="small" hover={false} />
        )}
        {getLoadingMessage()}
      </div>
    </div>
  );
};

export default LoadingDaisy;
