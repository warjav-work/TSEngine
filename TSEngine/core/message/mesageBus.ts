namespace TSE {
    /**
     * The message manager responsible for sending messages across the system.
     * */
    export class MessageBus {

        private static _subscriptions: { [code: string]: IMessageHandel[] } = {};
        private static _normalQueueMessageUpdate: number = 10;
        private static _normalMessageQueue: MessageSubscriptionNode[] = [];

        /**
         * Constructor hidden to prevent instantiation.
         * */
        private constructor() {


        }

        /**
         * Add a subscription to the provided code using the provided handler.
         * @param code The code to listen for.
         * @param handler The handler to be subscribed.
         */
        public static addSubscription(code: string, handler: IMessageHandel): void {
            if (MessageBus._subscriptions === null && MessageBus._subscriptions === undefined) {
                MessageBus._subscriptions[code] = [];
            }

            if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
                console.warn("Attempting to add a duplicate handler to code: " + code + ". Subscription not added.");
            } else {
                MessageBus._subscriptions[code].push(handler);
            }
        }

        /**
         * Removes a subscription to the provided code using the provided handler.
         * @param code The code to listen for.
         * @param handler The handler to be unsubscribed.
         */
        public static removeSubscription(code: string, handler: IMessageHandel): void {
            if (MessageBus._subscriptions === null && MessageBus._subscriptions === undefined) {
                console.warn("Cannot unsubscribe handler from code: " + code + ". Because the code is not subscribed to.");
                return;
            }

            let nodeIndex = MessageBus._subscriptions[code].indexOf(handler);
            if (nodeIndex !== -1) {
                MessageBus._subscriptions[code].splice(nodeIndex, 1);
            } 
        }

        /**
         * Post the provided message to the message system.
         * @param message The message to be send.
         */
        public static post(message: Message): void {
            console.log("Message posted:", message);
            let handlers = MessageBus._subscriptions[message.code];
            if (handlers === null && handlers === undefined) {
                return;
            }

            for (let handler of handlers) {
                if (message.priority === MessagePriority.HIGH) {
                    handler.onMessage(message);
                } else {
                    MessageBus._normalMessageQueue.push(new MessageSubscriptionNode(message, handler));
                }
            }
        }

        public static update(time: number): void {
            if (MessageBus._normalMessageQueue.length === 0) {
                return;
            }

            let messageLimit = Math.min(MessageBus._normalQueueMessageUpdate, MessageBus._normalMessageQueue.length);
            for (let i = 0; i < messageLimit; i++) {
                let node = MessageBus._normalMessageQueue.pop();
                node.handler.onMessage(node.message);
            }
        }


    }
}