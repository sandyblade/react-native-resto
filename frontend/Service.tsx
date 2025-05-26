import axios from "axios"
import { APP_BACKEND_URL } from "@env"

const http = (auth_token?: string) => {

    let headers = {}

    headers = {
        ...headers,
        "Content-type": "application/json",
    }

    if (localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null) {
        auth_token = localStorage.getItem('auth_token')!
    }

    if (auth_token !== undefined && auth_token !== null) {
        headers = {
            ...headers,
            "Authorization ": `Bearer ${auth_token}`
        }
    }

    return axios.create({ baseURL: `${APP_BACKEND_URL}`, headers: headers })
}

const ping = async () => {
    return await http().get("/api/ping")
}

const expiredMessage = `Your session has been expired. Please log in again to continue using the app`

const auth = {
    login: async (body: unknown) => {
        return await http().post("/api/auth/login", body)
    },
    forgot: async (body: unknown) => {
        return await http().post("/api/auth/email/forgot", body)
    },
    reset: async (token: string | undefined, body: unknown) => {
        return await http().post(`/api/auth/email/reset/${token}`, body)
    },
}

const getUpload = (path: string) => {
    return `${APP_BACKEND_URL}/${path}`
}

const profile = {
    detail: async () => {
        return await http().get("/api/profile/detail")
    },
    changePassword: async (body: unknown) => {
        return await http().post("/api/profile/password", body)
    },
    changeProfile: async (body: unknown) => {
        return await http().post("/api/profile/update", body)
    },
    upload: async (formData: unknown) => {
        const auth_token = localStorage.getItem('auth_token')
        const headerUpload = {
            'Content-Type': 'multipart/form-data',
            "Authorization ": `Bearer ${auth_token}`
        }
        return await axios.create({ baseURL: `${APP_BACKEND_URL}`, headers: headerUpload }).post("/api/profile/upload", formData)
    },
}

const home = {
    summary: async () => {
        return await http().get("/api/home/summary")
    },
}

const history = {
    list: async (params: string) => {
        return await http().get(`/api/history/list?${params}`)
    },
    detail: async (id: string) => {
        return await http().get(`/api/history/detail/${id}`)
    },
}

const menu = {
    list: async () => {
        return await http().get('/api/menu/list')
    },
}

const order = {
    pending: async () => {
        return await http().get('/api/order/pending')
    },
    item: async () => {
        return await http().get('/api/order/items')
    },
    save: async (body: unknown) => {
        return await http().post("/api/order/save", body)
    },
    detail: async (id: string) => {
        return await http().get(`/api/order/detail/${id}`)
    },
}

export default {
    ping,
    getUpload,
    expiredMessage,
    auth,
    profile,
    home,
    history,
    order,
    menu
}