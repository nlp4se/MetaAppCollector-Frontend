import { Card, Button, Form } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'lucide-react';
import { PollingStatusDTO } from '../DTOs/PollingStatusDTO';
import { useState } from 'react';

interface Props {
  pollings: (PollingStatusDTO | null)[];
  onTogglePolling: (type: 'metrics' | 'reviews', enabled: boolean, intervalHours: number) => void;
}

const PollingStatusCard: React.FC<Props> = ({ pollings, onTogglePolling }) => {
  const [editedIntervals, setEditedIntervals] = useState<Record<string, number>>({});
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});

  const formatDate = (date: Date | null): string => {
    if (!date) return '-';
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleIntervalChange = (type: 'metrics' | 'reviews', value: number) => {
    setEditedIntervals((prev) => ({ ...prev, [type]: value }));
  };

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
                  <div className="d-flex align-items-center gap-1">
                    <strong>Status:</strong>
                    {poll.enabled ? (
                      <CheckCircle color="green" size={20} />
                    ) : (
                      <XCircle color="red" size={20} />
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem' }}>
                  <div className="mb-2 d-flex align-items-center gap-2">
                    <span style={{ whiteSpace: 'nowrap' }}>
                      <strong style={{ marginRight: '2px' }}>Interval</strong>
                      (hours):
                    </span>
                    <div className="d-flex align-items-center gap-2">
                        <Form.Control
                          type="number"
                          min={1}
                          value={editedIntervals[poll.type] ?? poll.intervalHours}
                          readOnly={!editMode[poll.type]}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw.length <= 3) {
                              const parsed = parseInt(raw, 10);
                              if (!isNaN(parsed) && parsed > 0) {
                                handleIntervalChange(poll.type, parsed);
                              }
                            }
                          }}
                          style={{
                            width: `${Math.max(2, String(editedIntervals[poll.type] ?? poll.intervalHours).length + 5)}ch`,
                            cursor: !editMode[poll.type] ? 'default' : 'text',
                            paddingLeft: '4px',
                            paddingRight: '4px',
                          }}
                          size="sm"
                        />	
                      {!poll.enabled && !editMode[poll.type] && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-decoration-none"
                          onClick={() =>
                            setEditMode((prev) => ({ ...prev, [poll.type]: true }))
                          }
                          title="Edit interval"
                        >
                          ✏️
                        </Button>
                      )}
                      {editMode[poll.type] && (
                        <div className="d-flex align-items-center gap-1">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-success text-decoration-none"
                            onClick={() => {
                              poll.intervalHours = editedIntervals[poll.type] ?? poll.intervalHours; // ⬅️ actualització local
                              setEditMode((prev) => ({ ...prev, [poll.type]: false }));
                            }}
                            title="Save"
                          >
                            ✅
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-danger text-decoration-none"
                            onClick={() => {
                              setEditedIntervals((prev) => ({
                                ...prev,
                                [poll.type]: poll.intervalHours,
                              }));
                              setEditMode((prev) => ({ ...prev, [poll.type]: false }));
                            }}
                            title="Cancel"
                          >
                            ❌
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <strong>Last run:</strong>{' '}
                    {!poll.enabled || poll.lastRun
                      ? formatDate(poll.lastRun)
                      : formatDate(
                          poll.nextRun && typeof poll.intervalHours === 'number'
                            ? (() => {
                                const next = new Date(poll.nextRun);
                                if (isNaN(next.getTime())) return null;
                                next.setHours(next.getHours() - poll.intervalHours);
                                return next;
                              })()
                            : null
                        )}
                  </div>
                  <div>
                    <strong>Next run:</strong> {formatDate(poll.nextRun)}
                  </div>
                </div>
                <div className="text-end mt-2">
                  <Button
                    variant={poll.enabled ? 'outline-danger' : 'outline-success'}
                    size="sm"
                    onClick={() => {
                      const newInterval = editedIntervals[poll.type] ?? poll.intervalHours;
                      onTogglePolling(poll.type, poll.enabled, newInterval);
                      setEditedIntervals((prev) => {
                        const { [poll.type]: _, ...rest } = prev;
                        return rest;
                      });
                    }}
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
