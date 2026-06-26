import { Button } from 'react-bootstrap';
import { FaApple, FaGoogle } from 'react-icons/fa';

function SocialLoginButtons({ onGoogle, onApple, disabled }) {
  return (
    <div className="rc-social-buttons">
      <Button
        type="button"
        className="rc-social-btn"
        onClick={onGoogle}
        disabled={disabled}
      >
        <FaGoogle aria-hidden="true" className="rc-social-icon google" />
        <span>Continuar com Google</span>
      </Button>

      <Button
        type="button"
        className="rc-social-btn"
        onClick={onApple}
        disabled={disabled}
      >
        <FaApple aria-hidden="true" className="rc-social-icon apple" />
        <span>Continuar com Apple</span>
      </Button>
    </div>
  );
}

export default SocialLoginButtons;
