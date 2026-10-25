import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import PublicacionesPage from './pages/PublicacionesPage';
import { obtenerSesion } from './services/sesion';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

// Paso 10: Componente para restringir acceso a rutas que requieren sesión
const RutaProtegida: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const sesionActiva = obtenerSesion();
  return sesionActiva ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" element={<LoginPage />} />
        {/* Desafío 1: Ruta para el registro */}
        <Route path="/registro" element={<RegistroPage />} />
        {/* Paso 10: Ruta protegida con el wrapper personalizado */}
        <Route
          path="/publicaciones"
          element={
            <RutaProtegida>
              <PublicacionesPage />
            </RutaProtegida>
          }
        />
        <Route path="/" element={<Navigate to="/publicaciones" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
