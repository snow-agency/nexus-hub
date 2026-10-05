import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>

      <p>Bienvenue {user?.name} !</p>

      <p>Email : {user?.email}</p>

      <button type="button" onClick={logout}>
        {' '}
        Se déconnecter{' '}
      </button>
    </main>
  );
}

export default Dashboard;
