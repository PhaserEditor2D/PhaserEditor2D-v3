namespace colibri {

    export interface IElectronMessage {
        method: string,
        body?: any
    }

    export interface IElectron {

        sendMessage(msg: IElectronMessage);
        sendMessageSync(msg: IElectronMessage);
    }
}