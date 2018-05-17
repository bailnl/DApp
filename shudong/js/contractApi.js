const CONTRACT_ADDRESS = "n1PH7cFJ5ZinM6YgrftGjmyckmX64B5KTyD";

class SmartContractApi {
    constructor(contractAdress) {
        let NebPay = require("nebpay");
        this.nebPay = new NebPay();
        this._contractAdress = contractAdress || CONTRACT_ADDRESS;
    }

    getContractAddress() {
        return this.contractAdress;
    }

    _simulateCall({ value = "0", callArgs = "[]", callFunction , callback }) {
        this.nebPay.simulateCall(this._contractAdress, value, callFunction, callArgs, {
            callback: function(resp){
                if(callback){
                    callback(resp);
                }
            }
        });
    }

    _call({ value = "0", callArgs = "[]", callFunction , callback }) {
        this.nebPay.call(this._contractAdress, value, callFunction, callArgs, {
            callback: function(resp){
                if(callback){
                    callback(resp);
                }
            }
        });
    }
}

class NoteContractApi extends SmartContractApi{
    add(text, color, cb) {
        this._call({
            callArgs : `[${Date.now()}, "${text}", "${color}"]`,
            callFunction : "add",
            callback: cb
        });
    }

    update(noteId, text, color, cb) {
        this._call({
            callArgs : `[${noteId}, "${text}", "${color}"]`,
            callFunction : "update",
            callback: cb
        });
    }

    delete(noteId, cb) {
        this._call({
            callArgs: `[${noteId}]`,
            callFunction : "delete",
            callback: cb
        });
    }

    getTotalCount(cb) {
        this._simulateCall({
            callFunction : "total",
            callback: cb
        });
    }

    get(limit, offset, cb) {
        this._simulateCall({
            callArgs : `[${limit}, ${offset}]`,
            callFunction : "get",
            callback: cb
        });;
    }
}
