namespace colibri {

    export interface IElectron {

        sendMessage(msg: string);
        sendMessageSync(msg: string);
    }
}