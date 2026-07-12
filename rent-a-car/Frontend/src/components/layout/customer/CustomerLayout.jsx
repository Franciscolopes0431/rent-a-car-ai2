import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar';
import CustomerFooter from './CustomerFooter';

function CustomerLayout() {
  return (
    <div className="rc-customer-layout">
      <CustomerNavbar />
      <main className="rc-customer-main">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}

export default CustomerLayout;
