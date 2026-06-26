import Button from 'react-bootstrap/Button';

function FilterChips({ options, active, onChange }) {
  return (
    <div className="rc-filter-chips d-flex flex-wrap gap-2 mb-3">
      {options.map((option) => {
        const isActive = String(option.value) === String(active);
        return (
          <Button
            key={option.value}
            variant={isActive ? 'warning' : 'secondary'}
            className={`btn-sm ${isActive ? 'rc-chip-active' : 'rc-chip'}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export default FilterChips;
