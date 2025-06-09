// components/FiltersPanel.tsx
import React from 'react';
import { ButtonGroup, ToggleButton, Card } from 'react-bootstrap';
import { Period } from '../contexts/MetricDashboardContext';

interface Props {
  period: Period;
  setPeriod: (value: Period) => void;
  referenceDate: Date;
  setReferenceDate: (date: Date) => void;
}

const FiltersPanel: React.FC<Props> = ({ period, setPeriod, referenceDate, setReferenceDate }) => {
  const periodOptions = [
    { value: '7d', label: 'Week' },
    { value: '30d', label: 'Month' },
    { value: 'all', label: 'All' },
  ];

  return (
    <Card className="my-3 p-3 shadow-sm">
      <h5 className="mb-3">Filters</h5>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <ButtonGroup size="sm">
          {periodOptions.map((opt) => (
            <ToggleButton
              key={opt.value}
              type="radio"
              variant="outline-primary"
              name="global-period-selector"
              id={`period-${opt.value}`}
              value={opt.value}
              checked={period === opt.value}
              onChange={(e) => setPeriod(e.currentTarget.value as Period)}
            >
              {opt.label}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="reference-date" className="mb-0"><strong>Reference date:</strong></label>
          <input
            type="date"
            id="reference-date"
            className="form-control form-control-sm"
            style={{ width: '150px' }}
            value={referenceDate.toISOString().split('T')[0]}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setReferenceDate(new Date(e.target.value))}
          />
        </div>
      </div>
    </Card>
  );
};

export default FiltersPanel;
