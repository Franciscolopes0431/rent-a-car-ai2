import { InputGroup, Form } from 'react-bootstrap';

function SearchBar({ value, onChange, placeholder = 'Pesquisar...' }) {
  return (
    <InputGroup className="rc-search-bar rc-card mb-3">
      <InputGroup.Text>
        <i className="bi bi-search" aria-hidden="true" />
      </InputGroup.Text>
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Pesquisar"
      />
    </InputGroup>
  );
}

export default SearchBar;
