import express, { Request } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import * as config from './edit-me'
import * as controller from './controller'


const api = express()

api.use(cors({
    credentials:true,
    origin:(origin,callback) => {
        callback(null, true)   
    }
}))

api.use(cookieParser())

api.use(express.json({
    inflate:false,
    limit: config.DATA_BODY_LIMIT
}))

api.use(express.urlencoded({
    limit:config.DATA_BODY_LIMIT
}))





api.get(`${config.URL_BASE}/logged`, controller.logged)
api.post(`${config.URL_BASE}/singin`, controller.singin)
api.get(`${config.URL_BASE}/singout`, controller.singout)





api.listen( config.PORT_HTTP, () => {
    console.log(`RUN in port ${config.PORT_HTTP}`)
    console.log(`URL logged:`, `${config.URL_BASE}/logged`)
    console.log(`URL singin:`, `${config.URL_BASE}/singin`)
    console.log(`URL singout:`, `${config.URL_BASE}/singout`)
})