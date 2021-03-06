import {Router} from '../common/router'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {User} from './users.model'

class UsersRouter extends Router {

    constructor(){
        super()
        this.on('beforeRender', document=>{
            document.password = undefined
            // delete document.password
        })
    }

    applyRoutes(application: restify.Server){
        
        
        application.get('/users',(req,resp,next)=>{
            User.find()
            .then(this.render(resp,next))
            .catch(next)
        })

        application.get('/users/:id',(req,resp,next)=>{
            User.findById(req.params.id)
            .then(this.render(resp,next))
            .catch(next)
        })

        application.post('/users', (req,resp,next) => {
            const user = new User(req.body)            
            user.save()
            .then(this.render(resp,next))
            .catch(next)
        })
        
        application.put('/users/:id', (req, resp, next)=>{
            const options  = {runValidators: true,overwrite: true}
            User.update({_id:req.params.id}, req.body, options)
                .exec().then((User : any)=>{
                  if(User.n){
                    return User.findById(req.params.id)
                  }else{
                    throw new NotFoundError('Documento não encontrado')
                  }
            })
            .then(this.render(resp,next))
            .catch(next)
        })

        application.patch('/users/:id', (req,resp,next) =>{
            const options = {runValidators: true, new: true}
            User.findByIdAndUpdate(req.params.id,req.body,options)
            .then(this.render(resp,next))
            .catch(next)
        })

        application.del('/users/:id',(req,resp,next)=>{
            User.remove({_id:req.params.id}).exec().then((cmdResult:any) =>{
                if(cmdResult.result.n){
                    resp.send(204)
                    return next()
                }else{
                    throw new NotFoundError('Documento não encontrado') 
                }
                return next()
            })
            .catch(next)
        })
    }
}

export const usersRouter = new UsersRouter()