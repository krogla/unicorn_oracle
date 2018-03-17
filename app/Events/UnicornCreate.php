<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UnicornCreate implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

	public $data;

	/**
	 * The name of the queue on which to place the event.
	 *
	 * @var string
	 */
//    public $broadcastQueue = 'your-queue-name';

	/**
	 * Create a new event instance.
	 *
	 * @return void
	 */
	public function __construct($data)
	{
		$this->data = $data;
	}


    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('unicorn-events');
    }

	/**
	 * The event's broadcast name.
	 *
	 * @return string
	 */
//    public function broadcastAs()
//    {
//        return 'unicorn.created';
//    }

	/**
	 * Get the data to broadcast.
	 *
	 * @return array
	 */
//    public function broadcastWith()
//    {
//        return ['id' => $this->user->id];
//    }

}
