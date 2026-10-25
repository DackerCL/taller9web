// Desafío 1: Formulario y vista de registro de usuarios
import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast
} from "@ionic/react";

import { registrarUsuario } from "../services/api";
import "./LoginPage.css";

const RegistroPage: React.FC = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [procesando, setProcesando] = useState(false);
  const router = useIonRouter();
  const [mostrarToast] = useIonToast();

  const alRegistrar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setProcesando(true);

    try {
      await registrarUsuario(nombreUsuario, clave);
      mostrarToast({
        message: "¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.",
        color: "success",
        duration: 3500,
        position: "bottom"
      });
      router.push("/login", "root", "replace");
    } catch (error) {
      mostrarToast({
        message: error instanceof Error ? error.message : "Error al registrar la cuenta",
        color: "danger",
        duration: 3500,
        position: "bottom"
      });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form className="login" onSubmit={alRegistrar}>
          <h1>Registro de Usuario</h1>
          <p>Crea tu cuenta para publicar y gestionar publicaciones.</p>

          <IonList>
            <IonItem>
              <IonInput
                label="Nombre de usuario"
                labelPlacement="stacked"
                value={nombreUsuario}
                autocomplete="username"
                placeholder="Ingresa tu nombre de usuario"
                onIonInput={(e) => setNombreUsuario(e.detail.value ?? "")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Contraseña"
                labelPlacement="stacked"
                type="password"
                value={clave}
                autocomplete="new-password"
                placeholder="Mínimo 8 caracteres"
                onIonInput={(e) => setClave(e.detail.value ?? "")}
              >
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonItem>
          </IonList>

          <IonButton type="submit" expand="block" disabled={procesando}>
            {procesando ? "Registrando..." : "Crear Cuenta"}
          </IonButton>

          <IonButton routerLink="/login" fill="clear" expand="block">
            ¿Ya tienes una cuenta? Inicia sesión aquí
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default RegistroPage;
