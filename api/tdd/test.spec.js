"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const URL_BASE = 'http://localhost:11000';
const axios_1 = __importDefault(require("axios"));
const api = axios_1.default.create({
    baseURL: URL_BASE
});
describe(`login test`, () => {
    const LOGIN_TEST = 'teste login';
    var COOKIES = '';
    it(`logged. must return false`, async () => {
        const result = await axios_1.default.get(`${URL_BASE}/logged`);
        const data = result.data;
        expect(data).toHaveProperty('logged', false);
    });
    it(`singin. must return error "not login informed"`, async () => {
        const result = await axios_1.default.post(`${URL_BASE}/singin`, { login: '', password: '' });
        const data = result.data;
        expect(data).toHaveProperty('error', "\"login\" não informado");
    });
    it(`singin. must return error "not password informed"`, async () => {
        const result = await axios_1.default.post(`${URL_BASE}/singin`, { login: LOGIN_TEST, password: '' });
        const data = result.data;
        expect(data).toHaveProperty('error', "\"password\" não informado");
    });
    it(`singin. must return error "Acesso negado"`, async () => {
        const result = await axios_1.default.post(`${URL_BASE}/singin`, { login: LOGIN_TEST, password: 'passwordErrado' });
        const data = result.data;
        expect(data).toHaveProperty('error', "Acesso negado");
    });
    it(`singin. must return "login sucess"`, async () => {
        const result = await axios_1.default.post(`${URL_BASE}/singin`, { login: LOGIN_TEST, password: '12345' });
        const data = result.data;
        expect(data).toHaveProperty('logged', true);
        expect(data).toHaveProperty('user', LOGIN_TEST);
        expect(result).toHaveProperty('headers');
        expect(result.headers).toHaveProperty('set-cookie');
        COOKIES = result.headers['set-cookie']
            .map(cookie => cookie.replace(/;.*$/, ''))
            .join(';');
    });
    it(`logged. must return true`, async () => {
        const result = await axios_1.default.get(`${URL_BASE}/logged`, {
            headers: {
                Cookie: COOKIES
            }
        });
        const data = result.data;
        expect(data).toHaveProperty('logged', true);
    });
});
