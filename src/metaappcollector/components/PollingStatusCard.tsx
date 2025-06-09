import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'lucide-react';
import { PollingStatusDTO } from '../DTOs/PollingStatusDTO';
import { useState } from 'react';

interface Props {
  pollings: (PollingStatusDTO | null)[];
  onTogglePolling: (type: 'metrics' | 'reviews', enabled: boolean, intervalHours: number) => void;
  onManualReviewPolling: (from: string, to: string) => void;
}

const PollingStatusCard: React.FC<Props> = ({ pollings, onTogglePolling, onManualReviewPolling }) => {
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
  const today = new Date().toISOString().split('T')[0];
  const [manualDates, setManualDates] = useState<Record<string, { from: string; to: string }>>({
    reviews: { from: today, to: today },
  });
  const [isFetchingManual, setIsFetchingManual] = useState(false);

  return (
    <Card className="my-3 p-3 shadow-sm">
      <h5 className="mb-3">Polling Status</h5>
      <div className="d-flex flex-column gap-3">
        {pollings.map(
          (poll) =>
            poll && (
              <Card key={poll.type} className="p-3 shadow-sm" style={{ marginBottom: 0 }}>
                <Row className="align-items-center mb-2">
                  <Col>
                    <strong className="text-capitalize">
                      {poll.type === 'metrics' ? '📊 Metrics' : '📝 Reviews'}
                    </strong>
                  </Col>
                  <Col xs="auto" className="d-flex align-items-center gap-1">
                    <strong>Status:</strong>
                    {poll.enabled ? (
                      <CheckCircle color="green" size={20} />
                    ) : (
                      <XCircle color="red" size={20} />
                    )}
                  </Col>
                </Row>

                <Row className="align-items-center text-sm mb-2">
                  <Col md={4} className="mb-2 mb-md-0">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <strong>Interval</strong> (hours):
                      </Col>
                      <Col xs="auto">
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
                          size="sm"
                          style={{ width: '5rem', paddingLeft: '6px', paddingRight: '6px' }}
                        />
                      </Col>
                      <Col xs="auto" className="d-flex gap-1">
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
                          <>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 text-success text-decoration-none"
                              onClick={() => {
                                poll.intervalHours = editedIntervals[poll.type] ?? poll.intervalHours;
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
                          </>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
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
                  </Col>
                  <Col md={4}>
                    <strong>Next run:</strong> {formatDate(poll.nextRun)}
                  </Col>
                </Row>
                <Row className="text-end mt-2">
                  <Col>
                    <Button
                      variant={poll.enabled ? 'outline-danger' : 'outline-success'}
                      size="sm"
                      onClick={() => {
                        const newInterval =
                          editedIntervals[poll.type] ?? poll.intervalHours;
                        onTogglePolling(poll.type, poll.enabled, newInterval);
                        setEditedIntervals((prev) => {
                          const { [poll.type]: _, ...rest } = prev;
                          return rest;
                        });
                      }}
                    >
                      {poll.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    {poll.type === 'reviews' && (
                      <Row className="mt-3">
                        <Col md={4} className="text-start">
                          <Form.Group controlId={`dateFrom-${poll.type}`}>
                            <Form.Label className="text-start w-100 fw-bold">Date from</Form.Label>
                            <Form.Control
                              type="date"
                              size="sm"
                              value={manualDates[poll.type]?.from ?? ''}
                              onChange={(e) =>
                                setManualDates((prev) => ({
                                  ...prev,
                                  [poll.type]: {
                                    ...prev[poll.type],
                                    from: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} className="text-start">
                          <Form.Group controlId={`dateTo-${poll.type}`}>
                            <Form.Label className="text-start w-100 fw-bold">Date to</Form.Label>
                            <Form.Control
                              type="date"
                              size="sm"
                              value={manualDates[poll.type]?.to ?? ''}
                              onChange={(e) =>
                                setManualDates((prev) => ({
                                  ...prev,
                                  [poll.type]: {
                                    ...prev[poll.type],
                                    to: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isFetchingManual || !manualDates[poll.type]?.from || !manualDates[poll.type]?.to}
                            onClick={async () => {
                              onManualReviewPolling(manualDates.reviews.from, manualDates.reviews.to)
                            }}
                          >
                            {isFetchingManual ? 'Fetching...' : 'Manual fetch'}
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </Card>
            )
        )}
      </div>
    </Card>
  );
};

export default PollingStatusCard;
