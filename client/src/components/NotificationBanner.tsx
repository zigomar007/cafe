import { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";

interface Emission {
  id: string;
  title: string;
  host: string;
  startTime: string;
  endTime: string;
  isLive: boolean;
}

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState<Emission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Données des émissions
  const emissions: Emission[] = [
    {
      id: "1",
      title: "La Matinale avec Dali",
      host: "Dali",
      startTime: "06:00",
      endTime: "10:00",
      isLive: false,
    },
    {
      id: "2",
      title: "L'Aventure du Jazz",
      host: "DJ Lionel",
      startTime: "22:00",
      endTime: "23:59",
      isLive: false,
    },
    {
      id: "3",
      title: "Formats Intimes",
      host: "Équipe Radio Zigomar",
      startTime: "12:00",
      endTime: "14:00",
      isLive: false,
    },
  ];

  function isCurrentlyLive(startTime: string, endTime: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    return currentTimeInMinutes >= startInMinutes && currentTimeInMinutes <= endInMinutes;
  }

  useEffect(() => {
    // Fonction pour mettre à jour les notifications
    const updateNotifications = () => {
      const updated = emissions.map((e) => ({
        ...e,
        isLive: isCurrentlyLive(e.startTime, e.endTime),
      }));
      const live = updated.filter((e) => e.isLive);
      setNotifications(live);
    };

    // Mise à jour initiale
    updateNotifications();

    // Mettre à jour chaque minute
    const interval = setInterval(updateNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  // Afficher la notification si visible ET il y a des émissions en direct
  if (!isVisible || notifications.length === 0) {
    return null;
  }

  const currentNotification = notifications[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed top-20 left-4 right-4 z-40 max-w-md mx-auto md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-2xl p-4 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20">
              <Bell size={18} className="animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-100">EN DIRECT MAINTENANT</p>
            <h3 className="text-lg font-bold mt-1 truncate">{currentNotification.title}</h3>
            <p className="text-sm text-red-100 mt-1">
              Avec {currentNotification.host} • {currentNotification.startTime} - {currentNotification.endTime}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-red-100 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation dots */}
        {notifications.length > 1 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-red-500/30">
            <div className="flex gap-1">
              {notifications.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "bg-white w-6" : "bg-red-300 w-1.5"
                  }`}
                  aria-label={`Notification ${index + 1}`}
                />
              ))}
            </div>
            {notifications.length > 1 && (
              <button
                onClick={handleNext}
                className="text-xs text-red-100 hover:text-white transition-colors"
              >
                Suivant →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
