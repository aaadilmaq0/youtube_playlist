export interface Video{
    id:string,
    title:string,
    thumbnail:string,
    start?:number,
    end?:number,
    hours:number,
    minutes:number,
    seconds:number,
    channel:string
}