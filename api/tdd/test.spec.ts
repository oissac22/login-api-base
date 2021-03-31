const URL_BASE = 'http://localhost:11000'



import axios from 'axios'

const api = axios.create({
    baseURL:URL_BASE
})


describe(`login test`, () => {

    const LOGIN_TEST = 'teste login'
    var COOKIES = ''

    it(`logged. must return false`, async () => {
        const result = await axios.get<{ logged:false }>(`${URL_BASE}/logged`)
        const data = result.data;
        expect(data).toHaveProperty('logged', false)
    })

    it(`singin. must return error "not login informed"`, async () => {
        const result = await axios.post(`${URL_BASE}/singin`, { login:'', password:'' })
        const data = result.data;
        expect(data).toHaveProperty('error', "\"login\" não informado")
    })

    it(`singin. must return error "not password informed"`, async () => {
        const result = await axios.post(`${URL_BASE}/singin`, { login:LOGIN_TEST, password:'' })
        const data = result.data;
        expect(data).toHaveProperty('error', "\"password\" não informado")
    })

    it(`singin. must return error "Acesso negado"`, async () => {
        const result = await axios.post(`${URL_BASE}/singin`, { login:LOGIN_TEST, password:'passwordErrado' })
        const data = result.data;
        expect(data).toHaveProperty('error', "Acesso negado")
    })

    it(`singin. must return "login sucess"`, async () => {
        const result = await axios.post(`${URL_BASE}/singin`, { login:LOGIN_TEST, password:'12345' })
        const data = result.data;
        expect(data).toHaveProperty('logged', true)
        expect(data).toHaveProperty('user', LOGIN_TEST)
        expect(result).toHaveProperty('headers')
        expect(result.headers).toHaveProperty('set-cookie')
        COOKIES = (result.headers['set-cookie'] as string[])
                        .map( cookie =>
                            cookie.replace(/;.*$/,'')
                        )
                        .join(';')
    })

    it(`logged. must return true`, async () => {
        const result = await axios.get<{ logged:false }>(`${URL_BASE}/logged`, {
            headers:{
                Cookie: COOKIES
            }
        })
        const data = result.data;
        expect(data).toHaveProperty('logged', true)
    })

})