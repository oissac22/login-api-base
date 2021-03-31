import { Request, Response } from "express"
import jwt from 'jsonwebtoken'



// constants ***********************************

    export const PORT_HTTP          = Number(
                                        process.env.PORT_HTTP       || 11000
                                    )

    export const KEY_TOKEN          =   process.env.KEY_TOKEN       || 'test-key-token'
    export const URL_BASE           =   process.env.URL_BASE        || '';  // exemples: '/login', '/security', '/login/security', etc
    export const TOKEN_NAME         =   process.env.TOKEN_NAME      || 'tokenTestApi'
    export const TOKEN_EXPIRE       =   process.env.TOKEN_EXPIRE    || '1d' // 1d = expire in 1 day

    export const DATA_BODY_LIMIT    = Number(
                                        process.env.DATA_BODY_LIMIT || '1h' // 1 hora / 1 hours
                                    )


// typescripts ********************************

    // edite este tipo / edit this type
    export type TTokenData = {
                logged:boolean,
                user:string
            }




// functions ***********************************

            
    // validar login / validate login
    // edite essa função / edit this function
        const validateLogin = async (login:string, password:string):Promise<TTokenData | false> => {
            if( password === '12345' ){
                const result = { logged:true, user:login }
                return result;
            }
            return false;
        }


    // verifica se esta logado e retorna os dados do token caso sim ou false caso não
        export async function logged(token:string){
            try{
                const result = jwt.verify( token, KEY_TOKEN )
                return result as TTokenData;
            }catch(err){
                return false
            }
        }


    //faz o login
        export async function singIn(login:string, password:string, response:Response){
            const result = await validateLogin(login, password)
            if(!result) return false;
            const token = jwt.sign(
                    result,
                    KEY_TOKEN,
                    {
                        expiresIn:TOKEN_EXPIRE
                    }
                )
            response.cookie(TOKEN_NAME, token)
            return result;
        }


    //faz o logoff
        export async function singOut(response:Response){
            response.cookie(TOKEN_NAME, '')
        }