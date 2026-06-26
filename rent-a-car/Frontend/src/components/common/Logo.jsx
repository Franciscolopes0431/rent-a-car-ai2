import { BsCarFrontFill } from 'react-icons/bs';

function Logo() {
  return (
    <div className="rc-logo" aria-label="RentCar">
      <span className="rc-logo-icon" aria-hidden="true">
        <BsCarFrontFill />
      </span>
      <span className="rc-logo-text">
        RENT<span>CAR</span>
      </span>
    </div>
  );
}

export default Logo;
