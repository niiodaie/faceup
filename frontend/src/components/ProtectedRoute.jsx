import { Navigate } from 'react-router-dom';
import useSession from '../hooks/useSession';

export default function ProtectedRoute({ children }) {
  const session = useSession();

  if (session === null) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
