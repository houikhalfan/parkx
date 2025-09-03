<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\HseStat;
use App\Models\User;
use App\Models\Contractor;

class StatisticsSubmitted extends Notification
{
    use Queueable;

    protected $statistics;
    protected $user; // Can be User or Contractor

    public function __construct(HseStat $statistics, $user)
    {
        $this->statistics = $statistics;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        $userName = $this->user->name ?? $this->user->company_name ?? 'Utilisateur';
        $userType = $this->user instanceof Contractor ? 'contractor' : 'user';
        
        // Convert UTC time to Morocco timezone (GMT+1)
        $moroccoTime = $this->statistics->created_at->setTimezone('Africa/Casablanca');
        
        return [
            'type' => 'statistics_submitted',
            'title' => 'Nouvelles statistiques HSE soumises',
            'message' => "L'utilisateur {$userName} a soumis de nouvelles statistiques HSE pour le site {$this->statistics->site} ({$moroccoTime->format('Y-m-d H:i:s')})",
            'statistics_id' => $this->statistics->id,
            'user_id' => $this->user->id,
            'user_name' => $userName,
            'user_type' => $userType,
            'site' => $this->statistics->site,
            'date' => $moroccoTime->format('Y-m-d H:i:s'), // Use Morocco time
            'created_at' => now(),
        ];
    }
}
