import { Button, Form, InputGroup } from 'react-bootstrap';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  setShowPassword,
  isInvalid,
  ariaDescribedBy,
}) {
  return (
    <InputGroup>
      <Form.Control
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rc-auth-input rc-password-control"
        isInvalid={isInvalid}
        aria-invalid={isInvalid ? 'true' : 'false'}
        aria-describedby={ariaDescribedBy}
      />
      <Button
        variant="link"
        type="button"
        className="rc-password-toggle"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label="Mostrar/ocultar palavra-passe"
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </Button>
    </InputGroup>
  );
}

export default PasswordInput;
