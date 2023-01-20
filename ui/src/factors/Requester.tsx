interface RequestIterface{
    url?:any,
    params?:any,
    body?:any
}
export class Requester {

    request:RequestIterface

    constructor(req:any) {
        this.request = req
    }

    async get() {
        let { url, params } = this.request
        return await fetch(url + `?${new URLSearchParams(params)}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        }).then((res)=>{return res.json()})
    }
    async post() {
        let { url, body } = this.request
        return await fetch(url, {
            body: JSON.stringify(body),
            method: "POST",
             headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }, 
            credentials: 'include',
        }).then((res)=>{return res.json()})
    }

    async patch() {
        let { url, body } = this.request
        return await fetch(url, {
            body: JSON.stringify(body),
            method: "PATCH",
             headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }, 
            credentials: 'include',
        }).then((res)=>{return res.json()})
    }

    async delete() {
        let { url, body } = this.request
        return await fetch(url, {
            body: JSON.stringify(body),
            method: "DELETE",
             headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }, 
            credentials: 'include',
        }).then((res)=>{return res.json()})
    }
}