let ContentItem = function (text) {
    let obj = text ? JSON.parse(text) : {}
    this.content = obj.content
    this.time = obj.time
    this.id = obj.id
    this.author = obj.author
}

ContentItem.prototype = {
    toString: function () {
        return JSON.stringify(this)
    }
}

let Shudong = function () {
    LocalContractStorage.defineProperty(this, "count")
    LocalContractStorage.defineMapProperty(this, "userContents")
    LocalContractStorage.defineMapProperty(this, "contents", {
        parse: function (text) {
            return new ContentItem(text)
        },
        stringify: function (o) {
            return o.toString()
        }
    })
}

Shudong.prototype = {
    init: function () {
        this.count = new BigNumber(1)
    },

    total: function () {
        return new BigNumber(this.count).minus(1).toNumber()
    },


    add: function (text, date) {


        let index = this.count

        this.count = new BigNumber(index).plus(1)


        let from = Blockchain.transaction.from

        let contentItem = new ContentItem()
        contentItem.author = from
        contentItem.id = index
        contentItem.time = date
        contentItem.content = text


        this.contents.put(index, contentItem)


        let userContents = this.userContents.get(from) || []
        userContents.push(index)
        this.userContents.put(from, userContents)


    },


    update: function (id, text) {
        let content = this.contents.get(id)
        if (!content) {
            throw new Error("note not found")
        }
        content.content = text
        content.time = new Date().toLocaleString()
        this.contents.put(id, content)
    },


    delete: function (id) {
        let content = this.contents.get(id)
        if (!content) {
            throw new Error("content not found")
        }
        this.contents.del(id)
    },
    get: function (limit, offset) {
        let arr = []
        offset = new BigNumber(offset)
        limit = new BigNumber(limit)

        for (let i = offset; i.lessThan(offset.plus(limit)); i = i.plus(1)) {
            let index = i.toNumber()
            let content = this.contents.get(index)
            if (content) {
                arr.push(content)
            }
        }

        return arr
    },


    getByWallet: function (wallet) {
        wallet = wallet || Blockchain.transaction.from
        let contentsIds = this.userContents.get(wallet)
        if (!contentsIds) {
            throw new Error(`Wallet = ${wallet} does not have any contents `)
        }

        let arr = []
        for (const id of contentsIds) {
            let content = this.contents.get(id)
            if (content) {
                arr.push(content)
            }
        }
        return arr
    }
}
module.exports = Shudong