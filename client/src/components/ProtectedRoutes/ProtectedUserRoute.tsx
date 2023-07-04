import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';

const ProtectedLoginRoute = ({ children }: any): JSX.Element => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to='/login' />;
  }
  return children;
};

export default ProtectedLoginRoute;
