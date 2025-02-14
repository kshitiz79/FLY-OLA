import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePaymentResponse = async () => {
      const params = new URLSearchParams(location.search);
      const success = params.get('success');
      
      if (success === 'true') {
        navigate('/booking-success');
      } else {
        navigate('/booking-failure');
      }
    };

    handlePaymentResponse();
  }, [location, navigate]);

  return <div>Processing payment...</div>;
};

export default PaymentRedirect;