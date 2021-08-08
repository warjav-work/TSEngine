namespace TSE {
    export class MessageSubscriptionNode {
        public message: Message;
        public handler: IMessageHandel;

        public constructor(message: Message, handler: IMessageHandel) {
            this.message = message;
            this.handler = handler;
        }
    }
}