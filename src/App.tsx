import { useEffect, useState } from "react";

import {
  PushNotificationSchema,
  PushNotifications,
} from "@capacitor/push-notifications";

const NotificationType = {
  FOREGROUND: "foreground",
  ACTION: "action",
} as const;

type Notification = Pick<PushNotificationSchema, "id" | "title" | "body"> & {
  type: typeof NotificationType[keyof typeof NotificationType];
};

function App() {
  const [notifications, setnotifications] = useState<Notification[]>([]);

  useEffect(() => {
    PushNotifications.checkPermissions().then((res) => {
      if (res.receive !== "granted") {
        PushNotifications.requestPermissions().then((res) => {
          if (res.receive === "denied") {
            console.log("Push Notification permission denied");
          } else {
            console.log("Push Notification permission granted");
            register();
          }
        });
      } else {
        register();
      }
    });
  }, []);

  const register = () => {
    console.log("Initializing HomePage");

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token) => {
      console.log("Push registration success", JSON.stringify(token));
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        setnotifications((notifications) => [
          ...notifications,
          {
            id: notification.id,
            title: notification.title,
            body: notification.body,
            type: "foreground",
          },
        ]);
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        setnotifications((notifications) => [
          ...notifications,
          {
            id: notification.notification.data.id,
            title: notification.notification.data.title,
            body: notification.notification.data.body,
            type: "action",
          },
        ]);
      }
    );
  };

  return (
    <main>
      {notifications.map((notification) => (
        <div key={notification.id}>
          <label>
            <h3>{notification.title}</h3>
            <p>{notification.body}</p>
            {notification.type === "foreground" && (
              <p>This data was received in foreground</p>
            )}
            {notification.type === "action" && (
              <p>This data was received on tap</p>
            )}
          </label>
        </div>
      ))}

      <button onClick={register}>Register for Push</button>
    </main>
  );
}

export default App;
