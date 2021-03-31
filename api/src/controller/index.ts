import { NextFunction, Request, Response } from 'express'
import * as config from '../edit-me'


interface IRequest extends Request<any, any, {login:string, password:string}>{}

type TResponse = {
    logged?:boolean,
    result?:config.TTokenData,
    error?:string,
    logoff?:boolean,
    timeLeft?:number,
    attempts?:number //tentativas
}

type TIpData = {
    ip:string,
    limit:number,
    block:boolean,
    seconds:number
}

var IP_LOGIN_LIST_ERROR:TIpData[] = []

function getIp(ip:string):TIpData{
    var result = IP_LOGIN_LIST_ERROR.find( list =>
            list.ip === ip
        )
    if(!result){
        result = {
            ip,
            limit: 3,
            block:false,
            seconds: 30
        }
        setIp(result)
    }
    return result;
}

function setIp(data:TIpData){
    IP_LOGIN_LIST_ERROR.push( data )
}

function deleteIp(ip:string){
    IP_LOGIN_LIST_ERROR = IP_LOGIN_LIST_ERROR.filter( line =>
            line.ip !== ip
        )
}



export async function logged(req:IRequest, res:Response<TResponse>, next:NextFunction ){
    try{
        const token = req.cookies[config.TOKEN_NAME] as string;
        if(!token)
            return res.json({ logged:false })
        const result = await config.logged(token)
        res.json({
            logged:true,
            result:result || undefined
        })
    }catch(err){
        console.error(err)
        res.json({
            logged:false,
            error:'Erro interno no sistema'
        })
    }
}



export async function singin(req:IRequest, res:Response<TResponse>, next:NextFunction ){
    try{
        const { login='', password='' } = req.body

        var ip = req.headers['x-forwarded-for'] || 
                // req.connection?.remoteAddress || 
                req.socket.remoteAddress ||
                // (req.connection?.socket ? req.connection?.socket?.remoteAddress : null)
                'ip_undefined';

        if(!login) return res.json({error:'"login" não informado'})
        if(!password) return res.json({error:'"password" não informado'})
                
        let loginIpVerified = getIp(ip+'')

        if(loginIpVerified.block) {
            return res.json({
                error:`Acesso negado, aguarde ${loginIpVerified.seconds} segundos`,
                timeLeft:loginIpVerified.seconds
            })
        }

        const result = await config.singIn( login, password, res )
        if(!result){
            loginIpVerified.limit--;
            loginIpVerified.block = loginIpVerified.limit <= 0;
            if(loginIpVerified.block){
                let ipSelect = loginIpVerified.ip
                let time:NodeJS.Timeout;
                time = setInterval(() => {
                    loginIpVerified.seconds--;
                    if(!( loginIpVerified.seconds )){
                        deleteIp(loginIpVerified.ip)
                        clearInterval(time)
                    }
                }, 1000)
            }
            if(loginIpVerified.limit <= 0)
                return res.json({
                            error:`Acesso negado, login temporariamente bloqueado, aguarde ${loginIpVerified.seconds} segundos`,
                            timeLeft: 30
                        })
            return res.json({ error:'Acesso negado', attempts: loginIpVerified.limit })
        }
        deleteIp(loginIpVerified.ip)
        res.json(result)
    }catch(err){
        console.error(err)
        res.json({
            error:'Erro interno no sistema'
        })
    }
}



export async function singout(req:IRequest, res:Response<TResponse>, next:NextFunction ){
    try{
        await config.singOut(res)
        return res.json({ logoff:true })
    }catch(err){
        console.error(err)
        res.json({
            error:'Erro interno no sistema'
        })
    }
}