<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BarberApproved extends Notification
{
    use Queueable;

    public function __construct()
    {
        // Puoi passare dati qui se servono (es. il nome dell'admin)
    }

    // Specifichiamo che la notifica va salvata nel database
    public function via($notifiable): array
    {
        return ['database'];
    }

    // Questo è il JSON che verrà salvato nella colonna 'data' della tabella notifications
    public function toArray($notifiable): array
    {
        return [
            'type' => 'success',
            'message' => 'Your request has been approved!',
            'description' => 'You are now a barber!',
        ];
    }
}
