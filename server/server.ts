import * as restify from 'restify'
import { environment } from './../common/environment';
import {Router} from '../common/router'

export class Server{

    application: restify.Server
    
    initRoutes(routers: Router[]): 
        Promise<any>{
            return new Promise((resolve,reject) => {
                try{
                    this.application = restify.createServer({
                        name: 'custommer-api',
                        version: '1.0.0'
                    })
                    this.application.use(restify.plugins.queryParser())

                    //routes
                    this.application.listen(environment.server.port,() => {
                        resolve(this.application)
                    })

                    for(let router of routers){
                        router.applyRoutes(this.application)
                    }
                }
                catch(error){
                    reject(error)
                }
            })
        }

    bootstrap(routers: Router[] = []): 
        Promise<Server>{
            return this.initRoutes(routers).then( () => this)
        }
        
} 