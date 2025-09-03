<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Contractor;

class ContractorRegistrationRequest extends Notification
{
    use Queueable;

    public $contractor;

    /**
     * Create a new notification instance.
     */
    public function __construct(Contractor $contractor)
    {
        $this->contractor = $contractor;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouvelle demande d\'inscription contractant')
            ->line('Un nouveau contractant a demandé un accès à la plateforme ParkX.')
            ->line('Nom: ' . $this->contractor->name)
            ->line('Email: ' . $this->contractor->email)
            ->line('Entreprise: ' . ($this->contractor->company_name ?? 'Non spécifiée'))
            ->line('Téléphone: ' . ($this->contractor->phone ?? 'Non spécifié'))
            ->line('Rôle: ' . ($this->contractor->role ?? 'Non spécifié'))
            ->action('Voir la demande', route('admin.contractors.pending'))
            ->line('Merci d\'utiliser notre plateforme!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'contractor_registration_request',
            'title' => 'Nouvelle demande d\'inscription contractant',
            'message' => "Le contractant {$this->contractor->name} ({$this->contractor->email}) a demandé un accès à la plateforme.",
            'contractor_id' => $this->contractor->id,
            'contractor_name' => $this->contractor->name,
            'contractor_email' => $this->contractor->email,
            'company_name' => $this->contractor->company_name,
            'phone' => $this->contractor->phone,
            'role' => $this->contractor->role,
            'created_at' => now(),
        ];
    }
}
