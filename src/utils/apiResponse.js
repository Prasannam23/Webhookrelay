export function sendSuccess(res,{statusCode = 200, data =null,meta=null,message=null}){
    return res.status(statusCode).json({
        success:true,
        ...(message && {message}),
        data,
        ...(meta && {meta})

    })
}
