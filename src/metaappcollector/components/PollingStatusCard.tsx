// components/PollingStatusCard.tsx
import { Card, Button } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'lucide-react';
import { PollingStatusDTO } from '../DTOs/PollingStatusDTO';

interface Props {
  pollings: (PollingStatusDTO | null)[];
  onTogglePolling: (type: 'metrics' | 'reviews', enabled: boolean) => void;
}

const PollingStatusCard: React.FC<Props> = ({ pollings, onTogglePolling }) => {
  return (
    <Card className="my-3 p-3 shadow-sm">
      <h5 className="mb-3">Polling Status</h5>
      <div className="d-flex gap-3 flex-wrap">
        {pollings.map(
          (poll) =>
            poll && (
              <Card key={poll.type} className="p-3 shadow-sm" style={{ flex: '1 1 300px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong className="text-capitalize">
                    {poll.type === 'metrics' ? '📊 Metrics' : '📝 Reviews'}
                  </strong>
                  {poll.enabled ? (
                    <CheckCircle color="green" size={20} />
                  ) : (
                    <XCircle color="red" size={20} />
                  )}
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                  <div><strong>Interval:</strong> {poll.intervalHours}h</div>
                  <div><strong>Last run:</strong> {poll.lastRun || 'N/A'}</div>
                  <div><strong>Next run:</strong> {poll.nextRun || 'N/A'}</div>
                  <div><strong>Starts at:</strong> {poll.startAt || 'N/A'}</div>
                </div>
                <div className="text-end mt-2">
                  <Button
                    variant={poll.enabled ? 'outline-danger' : 'outline-success'}
                    size="sm"
                    onClick={() => onTogglePolling(poll.type, poll.enabled)}
                  >
                    {poll.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </Card>
            )
        )}
      </div>
    </Card>
  );
};

export default PollingStatusCard;
