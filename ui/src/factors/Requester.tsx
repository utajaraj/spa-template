interface RequestIterface {
    url: string,
    method: "get" | "post" | "patch" | "delete",
    params?: any,
    body?: any
}
export class Requester {

    request: RequestIterface

    constructor(req: any) {
        this.request = req
    }

    private async get() {
        let { url, params } = this.request
        return await fetch(url + `?${new URLSearchParams(params)}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        }).then((res) => { return res.json() })
    }
    private async post() {
        let { url, body } = this.request
        return await fetch(url, {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then((res) => { return res.json() })
    }

    private async patch() {
        let { url, body } = this.request
        return await fetch(url, {
            body: JSON.stringify(body),
            method: "PATCH",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then((res) => { return res.json() })
    }

    private async delete() {
        let { url, body } = this.request
        return await fetch(url, {
            body: JSON.stringify(body),
            method: "DELETE",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then((res) => { return res.json() })
    }

    send() {
        const { method } = this.request
        switch (method) {
            case "get":
                return this.get()
                break;
            case "post":
                return this.post()
                break;
            case "patch":
                return this.patch()
                break;
            case "delete":
                return this.delete()
                break;

            default:
                break;
        }
    }
}