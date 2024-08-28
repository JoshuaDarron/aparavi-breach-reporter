export abstract class Controller {
    abstract findAll (): any[]
    abstract findOne (item: object): any
    abstract create (item: object): any
    abstract update (item: object): any
    abstract delete (id: string): any
}
